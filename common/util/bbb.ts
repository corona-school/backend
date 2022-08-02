import {hashToken} from "./hashing";
import {getLogger} from 'log4js';
import {Parser} from "xml2js";
import {Pupil} from "../entity/Pupil";
import {CourseAttendanceLog} from "../entity/CourseAttendanceLog";
import {getManager} from "typeorm";
import {Lecture} from "../entity/Lecture";
import {getTransactionLog} from "../transactionlog";
import CreateCourseAttendanceLogEvent from "../transactionlog/types/CreateCourseAttendanceLogEvent";
import {BBBMeeting} from "../entity/BBBMeeting";
import CreateBBBMeetingEvent from "../transactionlog/types/CreateBBBMeetingEvent";
import {Student} from "../entity/Student";
import { addCleanupAction } from "./cleanup";

const parser = new Parser();
const logger = getLogger();

const sharedSecret = process.env.BBB_SECRET;
const baseUrl = process.env.BBB_BASEURL;

const courseAttendanceLogInterval = 600000;
const bbbMeetingInfoHandlerTimeout = setInterval(() => {
    handleBBBMeetingInfos();
}, courseAttendanceLogInterval);
addCleanupAction(() => clearInterval(bbbMeetingInfoHandlerTimeout)); //cleanup on sigterm

export async function isBBBMeetingInDB(id: string): Promise<boolean> {
    const entityManager = getManager();
    const meeting = await entityManager.findOne(BBBMeeting, {meetingID: id});
    return !!meeting;
}

export async function getBBBMeetingFromDB(id: string): Promise<BBBMeeting> {
    const entityManager = getManager();
    return await entityManager.findOne(BBBMeeting, {meetingID: id});
}

export async function createBBBMeeting(name: string, id: string, user: Pupil | Student): Promise<BBBMeeting> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();
    const attendeePW = hashToken('' + Math.random(), "sha1");
    const moderatorPW = hashToken('' + Math.random(), "sha1");
    const bbbMeeting = new BBBMeeting();

    try {
        // Create new BBBMeeting
        bbbMeeting.meetingID = id;
        bbbMeeting.meetingName = name;
        bbbMeeting.moderatorPW = moderatorPW;
        bbbMeeting.attendeePW = attendeePW;
        await entityManager.save(BBBMeeting, bbbMeeting);
        await transactionLog.log(new CreateBBBMeetingEvent(user, bbbMeeting));
        logger.info("Successfully saved new bbb meeting with id ", bbbMeeting.meetingID);
        return bbbMeeting;
    } catch (e) {
        logger.error("Can't save new bbb meeting: " + e.message);
        logger.debug(bbbMeeting, e);
    }
}

export async function startBBBMeeting(meeting: BBBMeeting) {
    const callName = 'create';
    const params = {
        attendeePW: meeting.attendeePW,
        meetingID: meeting.meetingID,
        moderatorPW: meeting.moderatorPW,
        name: meeting.meetingName,
        record: "false"
    };
    const queryParams = new URLSearchParams(params).toString(); //use URLSearchParams to have correct encoding which also encodes "'" correctly as required by application/x-www-form-urlencoded format (which BBB seems to use and require)

    const response = await fetch(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`, {
        headers: {
            //explicitly use application/xml such that the server will respond with xml always (for some reaseon the BBB server supports json responses only if the request failed, but not if the request was successful)
            accept: "application/xml"
        }
    });
    if (response.status !== 200) {
        //response level error (for example network error, server crash...)
        throw new Error("Status code: " + response.status);
    }

    const data = await response.text();

    //in case of a successful *BBB* response, it always contains a returncode, which must be SUCCESS
    const parsedResponseData = await (new Parser({
        explicitArray: false //do not put all child nodes into an array automatically...
    })).parseStringPromise(data);

    if (parsedResponseData.response?.returncode !== "SUCCESS") {
        logger.error(`An error occurred during creation of the BBB meeting (meetingID: ${meeting.meetingID}). Error: ${parsedResponseData.response.message}`);
        throw new Error(`Meeting with id '${meeting.meetingID}' couldn't be started!`);
        //TODO: improve error handling – also for the other calls (and refactor this whole thing here...)
    }
}

export function getMeetingUrl(id: string, name: string, pw: string, userID?: string): string {
    const callName = 'join';
    const params = {
        fullName: name,
        meetingID: id,
        password: pw,
        redirect: "true",
        userID: userID
    };
    const queryParams = new URLSearchParams(params).toString();

    return (`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
}


export async function isBBBMeetingRunning(id: string): Promise<boolean> {
    const callName = 'isMeetingRunning';
    const queryParams = encodeURI(`meetingID=${id}`);
    return fetch(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`)
        .then(res => res.text())
        .then(data => parser.parseStringPromise(data))
        .then(jsonResponse => jsonResponse && jsonResponse.response && jsonResponse.response.running &&
            jsonResponse.response.running.length > 0 && jsonResponse.response.running[0] === "true")
        .catch(error => {
            logger.debug(error);
            return Promise.reject("An error occurred.");
        });
}

export async function getRunningBBBMeetings(): Promise<ApiBBBMeeting[]> {
    const callName = "getMeetings";


    try {
        const dataRaw = await fetch(`${baseUrl}${callName}?checksum=${hashToken(callName + sharedSecret, "sha1")}`);
        const data = await dataRaw.text();
        const jsonResponse = await parser.parseStringPromise(data);


        return mapJSONtoApiBBBMeetings(jsonResponse);
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

function mapJSONtoApiBBBMeetings(json: any): ApiBBBMeeting[] {
    if (json && json.response && json.response.meetings && json.response.meetings.length > 0 && json.response.meetings[0] &&
        json.response.meetings[0].meeting && json.response.meetings[0].meeting.length > 0) {
        return json.response.meetings[0].meeting.map(o => mapJSONtoApiBBBMeeting(o));
    }
    return [];
}

function mapJSONtoApiBBBMeeting(o: any): ApiBBBMeeting {
    return new ApiBBBMeeting(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0],
                             o && o.meetingName && o.meetingName.length > 0 && o.meetingName[0],
                             o && o.attendeePW && o.attendeePW.length > 0 && o.attendeePW[0],
                             o && o.moderatorPW && o.moderatorPW.length > 0 && o.moderatorPW[0],
                             (userName: string, userID: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
                                                                                         o && o.attendeePW && o.attendeePW.length > 0 && o.attendeePW[0], userID),
                             (userName: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
                                                                         o && o.moderatorPW && o.moderatorPW.length > 0 && o.moderatorPW[0]));
}

export class ApiBBBMeeting {
    meetingID: string;
    meetingName: string;
    attendeePW: string;
    moderatorPW: string;

    attendeeUrl: (userName: string, userID: string) => string;
    moderatorUrl: (userName: string) => string;

    constructor(meetingID: string, meetingName: string, attendeePW: string, moderatorPW,
                attendeeUrl: (userName: string, userID: string) => string, moderatorUrl: (userName: string) => string) {
        this.meetingID = meetingID;
        this.meetingName = meetingName;
        this.attendeePW = attendeePW;
        this.moderatorPW = moderatorPW;

        this.attendeeUrl = attendeeUrl;
        this.moderatorUrl = moderatorUrl;
    }
}

export class Attendee {
    wix_id: string;
    fullName: string;
    role: string;


    constructor(wix_id: string, fullName: string, role: string) {
        this.wix_id = wix_id;
        this.fullName = fullName;
        this.role = role;
    }
}

function mapJSONtoAttendees(json: any): Attendee[] {
    if (json && json.response && json.response.attendees && json.response.attendees.length > 0 && json.response.attendees[0] &&
        json.response.attendees[0].attendee && json.response.attendees[0].attendee.length > 0) {
        return json.response.attendees[0].attendee.map(o => mapJSONtoAttendee(o));
    }
    return [];
}

function mapJSONtoAttendee(o: any): Attendee {
    return new Attendee(o && o.userID && o.userID.length > 0 && o.userID[0],
                        o && o.fullName && o.fullName.length > 0 && o.fullName[0],
                        o && o.role && o.role.length > 0 && o.role[0]);
}

function lessThanDate(date1: Date, date2: Date): boolean {
    if (date1.getFullYear() < date2.getFullYear()) {
        return true;
    } else if (date1.getMonth() < date2.getMonth()) {
        return true;
    } else if (date1.getDate() < date2.getDate()) {
        return true;
    }
    return false;
}

// Returns active lecture of the subcourse, assuming that there is only one active lecture of the subcourse
async function getActiveLectureOfSubcourse(subcourseId: string): Promise<Lecture> {
    const entityManager = getManager();
    const lectures = await entityManager
        .createQueryBuilder(Lecture, "lecture")
        .where("lecture.subcourse.id = :id", {id: subcourseId})
        .getMany();

    // check if lecture is running now (lecture.start + duration > now)
    for (const lecture of lectures) {
        if (!lessThanDate(lecture.start, new Date())
            && (lecture.start.getTime() + (lecture.duration * 60000)) > new Date().getTime()) {
            return lecture;
        }
    }
    return null;
}

// Returns CourseAttendanceLog by lectureId and pupilId
async function getCourseAttendanceLog(lectureId: number, pupilId: number): Promise<CourseAttendanceLog> {
    const entityManager = getManager();
    return await entityManager
        .createQueryBuilder(CourseAttendanceLog, "courseAttendanceLog")
        .where("courseAttendanceLog.lecture.id = :lectureId", {lectureId: lectureId})
        .andWhere("courseAttendanceLog.pupil.id = :pupilId", {pupilId: pupilId})
        .getOne();
}

// Creates or updates a CourseAttendanceLog by pupil, ip (optional for update) and subcourseId
export async function createOrUpdateCourseAttendanceLog(pupil: Pupil, ip: string, subcourseId: string) {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();
    const courseAttendanceLog = new CourseAttendanceLog();

    if (subcourseId == null) {
        logger.error("Can't save new course attendance: subcourseId is null");
        logger.debug(courseAttendanceLog);
    } else {
        const activeLecture = await getActiveLectureOfSubcourse(subcourseId);
        if (activeLecture) {
            const logToUpdate = await getCourseAttendanceLog(activeLecture.id, pupil.id);
            if (logToUpdate) {
                // To prevent a high attendance time through rejoining check the absence time
                // If absence time (difference between now and updatedAt) is shorter than interval time, add abscence time to attended time
                // Else add courseAttendanceLogInterval to attendedTime
                const absenceTime = new Date().getTime() - logToUpdate.updatedAt.getTime();
                if (absenceTime < courseAttendanceLogInterval) {
                    logToUpdate.attendedTime += absenceTime;
                } else {
                    logToUpdate.attendedTime += courseAttendanceLogInterval;
                }
                // Update log
                await entityManager.save(CourseAttendanceLog, logToUpdate);
                await transactionLog.log(new CreateCourseAttendanceLogEvent(pupil, logToUpdate));
                logger.info("Successfully updated log with id: ", logToUpdate.id);
            } else {
                try {
                    // Create new log
                    courseAttendanceLog.ip = ip;
                    courseAttendanceLog.pupil = pupil;
                    courseAttendanceLog.lecture = activeLecture;
                    courseAttendanceLog.attendedTime = null;
                    await entityManager.save(CourseAttendanceLog, courseAttendanceLog);
                    await transactionLog.log(new CreateCourseAttendanceLogEvent(pupil, courseAttendanceLog));
                    logger.info("Successfully saved new Course Attendance to lecture with id ", activeLecture.id);
                } catch (e) {
                    logger.error("Can't save new course attendance: " + e.message);
                    logger.debug(courseAttendanceLog, e);
                }
            }
        } else {
            logger.error("Can't save new course attendance: no active lecture");
        }
    }
}

export async function getRunningBBBMeetingAttendees(meetingID: string): Promise<Attendee[]> {
    const callName = "getMeetingInfo";
    const queryParams = encodeURI(`meetingID=${meetingID}`);

    try {
        const dataRaw = await fetch(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
        const data = await dataRaw.text();
        const jsonResponse = await parser.parseStringPromise(data);
        return mapJSONtoAttendees(jsonResponse);
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

export async function handleBBBMeetingInfos() {
    const entityManager = getManager();
    const meetings = await getRunningBBBMeetings();
    if (meetings != null) {
        for (const meeting of meetings) {
            const meetingAttendees = await getRunningBBBMeetingAttendees(meeting.meetingID);
            if (meetingAttendees != null) {
                const map = new Map();
                const filteredMeetingAttendees: Attendee[] = [];
                for (const attendee of meetingAttendees) {
                    if (!map.has(attendee.wix_id)) {
                        map.set(attendee.wix_id, true);
                        filteredMeetingAttendees.push(attendee);
                    }
                }
                for (const attendee of filteredMeetingAttendees) {
                    if (attendee.role && attendee.role === "VIEWER") {
                        const pupilFromDB = await entityManager.findOne(Pupil, {wix_id: attendee.wix_id});
                        if (pupilFromDB) {
                            await createOrUpdateCourseAttendanceLog(pupilFromDB, null, meeting.meetingID);
                        } else {
                            logger.error("Can't find attendee in db: " + attendee.fullName);
                        }
                    }
                }
            } else {
                logger.error("Can't get bbb meeting attendees.");
            }
        }
    } else {
        logger.error("Can't get bbb meetings.");
    }
}
