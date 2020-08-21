import {hashToken} from "./hashing";
import {getLogger} from 'log4js';
import axios from "axios";
import {Parser} from "xml2js";
import {Mutex} from "async-mutex";
import {Pupil} from "../entity/Pupil";
import {CourseAttendanceLog} from "../entity/CourseAttendanceLog";
import {Course} from "../entity/Course";
import {getManager, Raw, Not, getConnection, getRepository} from "typeorm";
import {Subcourse} from "../entity/Subcourse";
import {Lecture} from "../entity/Lecture";
import {getTransactionLog} from "../transactionlog";
import CreateCourseAttendanceLogEvent from "../transactionlog/types/CreateCourseAttendanceLogEvent";

const parser = new Parser();
const logger = getLogger();

const cacheUpdateMutex = new Mutex();
export const bbbMeetingCache: Map<string, BBBMeeting> = new Map<string, BBBMeeting>();
updateBBBMeetingCache();
setInterval(() => {
    updateBBBMeetingCache();
}, 840000);

const sharedSecret = process.env.BBB_SECRET;
const baseUrl = process.env.BBB_BASEURL;

const courseAttendanceLogInterval = 15000;
setInterval(() => {
    handleBBBMeetingInfos();
}, courseAttendanceLogInterval);

export async function createBBBMeeting(name: string, id: string): Promise<BBBMeeting> {
    const attendeePW = hashToken('' + Math.random(), "sha1");
    const moderatorPW = hashToken('' + Math.random(), "sha1");

    const callName = 'create';
    const queryParams = encodeURI(`attendeePW=${attendeePW}&meetingID=${id}&moderatorPW=${moderatorPW}&name=${name}&record=false`);

    if (!bbbMeetingCache.has(id)) {
        const release = await cacheUpdateMutex.acquire();
        const response = await axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
        if (response.status === 200) {
            const m: BBBMeeting = new BBBMeeting(id, name, attendeePW, moderatorPW,
                (userName: string, userID: string): string => getMeetingUrl(id, userName, attendeePW, userID),
                (userName: string): string => getMeetingUrl(id, userName, moderatorPW));
            bbbMeetingCache.set(m.meetingID, m);

            release();
            return m;
        } else {
            release();
            throw new Error("Status code: " + response.status);
        }
    } else {
        return bbbMeetingCache.get(id);
    }
}

export function getMeetingUrl(id: string, name: string, pw: string, userID?: string): string {
    const callName = 'join';
    const queryParams = encodeURI(`fullName=${name}&meetingID=${id}&password=${pw}&redirect=true&userID=${userID}`);

    return (`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
}


export async function isBBBMeetingRunning(id: string): Promise<boolean> {
    const callName = 'isMeetingRunning';
    const queryParams = encodeURI(`meetingID=${id}`);
    return axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`)
        .then(response => parser.parseStringPromise(response.data))
        .then(jsonResponse => jsonResponse && jsonResponse.response && jsonResponse.response.running &&
            jsonResponse.response.running.length > 0 && jsonResponse.response.running[0] === "true")
        .catch(error => {
            logger.debug(error);
            return Promise.reject("An error occured.");
        });
}

export async function endBBBMeeting(id: string, moderatorPW: string): Promise<boolean> {
    const callName = "end";
    const queryParams = encodeURI(`meetingID=${id}&password=${moderatorPW}`);

    return axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`)
        .then(response => parser.parseStringPromise(response.data))
        .then(jsonResponse => jsonResponse && jsonResponse.response && jsonResponse.response.returncode &&
            jsonResponse.response.returncode.length > 0 && jsonResponse.response.returncode[0] === "SUCCESS")
        .catch(error => {
            logger.debug(error);
            return Promise.reject("An error occured.");
        });
}

export async function getBBBMeetings(): Promise<BBBMeeting[]> {
    const callName = "getMeetings";


    try {
        const response = await axios.get(`${baseUrl}${callName}?checksum=${hashToken(callName + sharedSecret, "sha1")}`);
        const jsonResponse = await parser.parseStringPromise(response.data);


        return mapJSONtoBBBMeetings(jsonResponse);
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

export async function updateBBBMeetingCache(): Promise<void> {
    const release = await cacheUpdateMutex.acquire();

    bbbMeetingCache.clear();

    const meetings = await getBBBMeetings();
    meetings?.forEach(meeting => bbbMeetingCache.set(meeting.meetingID, meeting));

    release();
}

function mapJSONtoBBBMeetings(json: any): BBBMeeting[] {
    if (json && json.response && json.response.meetings && json.response.meetings.length > 0 && json.response.meetings[0] &&
        json.response.meetings[0].meeting && json.response.meetings[0].meeting.length > 0) {
        return json.response.meetings[0].meeting.map(o => mapJSONtoBBBMeeting(o));
    }
    return [];
}

function mapJSONtoBBBMeeting(o: any): BBBMeeting {
    return new BBBMeeting(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0],
        o && o.meetingName && o.meetingName.length > 0 && o.meetingName[0],
        o && o.attendeePW && o.attendeePW.length > 0 && o.attendeePW[0],
        o && o.moderatorPW && o.moderatorPW.length > 0 && o.moderatorPW[0],
        (userName: string, userID: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
            o && o.attendeePW && o.attendeePW.length > 0 && o.attendeePW[0], userID),
        (userName: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
            o && o.moderatorPW && o.moderatorPW.length > 0 && o.moderatorPW[0]));
}

export class BBBMeeting {
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

// Creates new CourseAttendanceLog by pupil, ip and subcourseId
export async function createCourseAttendanceLog(pupil: Pupil, ip: string, subcourseId) {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();
    const courseAttendanceLog = new CourseAttendanceLog();

    if (subcourseId == null) {
        logger.error("Can't save new course attendance: subcourseId is null");
        logger.debug(courseAttendanceLog);
    } else {
        const activeLecture = await getActiveLectureOfSubcourse(subcourseId);
        if (activeLecture) {
            const checkCourseAttendanceLog = await getCourseAttendanceLog(activeLecture.id, pupil.id);
            if (checkCourseAttendanceLog) {
                const attendee = new Attendee(pupil.wix_id.toString(), pupil.firstname + pupil.lastname, "VIEWER");
                await updateCourseAttendanceLog(attendee, subcourseId, checkCourseAttendanceLog);
            } else {
                try {
                    courseAttendanceLog.ip = ip;
                    courseAttendanceLog.pupil = pupil;
                    courseAttendanceLog.subcourse = await entityManager.findOne(Subcourse, {id: subcourseId});
                    courseAttendanceLog.lecture = activeLecture;
                    courseAttendanceLog.updatedAt = null;
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

export async function updateCourseAttendanceLog(attendee: Attendee, subcourseId, courseAttendanceLog?: CourseAttendanceLog) {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();
    const activeLecture = await getActiveLectureOfSubcourse(subcourseId);
    const pupilFromDB = await entityManager.findOne(Pupil, {wix_id: attendee.wix_id});

    if (!activeLecture || !pupilFromDB) {
        logger.error("Can't save new course attendance: activeLecture or pupilFromDB is null");
    } else {
        const logToUpdate = courseAttendanceLog ? courseAttendanceLog : await getCourseAttendanceLog(activeLecture.id, pupilFromDB.id);
        if (subcourseId == null) {
            logger.error("Can't save new course attendance: courseId is null");
        } else {
            try {
                if (logToUpdate) {
                    logToUpdate.updatedAt = new Date();
                    logToUpdate.attendedTime += courseAttendanceLogInterval;
                    await entityManager.save(CourseAttendanceLog, logToUpdate);
                    await transactionLog.log(new CreateCourseAttendanceLogEvent(pupilFromDB, logToUpdate));
                    logger.info("Successfully updated log with id: ", logToUpdate.id);
                } else {
                    logger.error("User with id " + attendee.wix_id + " is in meeting " + subcourseId + " but log could not be found.");
                }

            } catch (e) {
                logger.error("Can't save new course attendance: " + e.message);
                logger.debug(logToUpdate, e);
            }
        }
    }
}

export async function getBBBMeetingAttendees(meetingID): Promise<Attendee[]> {
    const callName = "getMeetingInfo";
    const queryParams = encodeURI(`meetingID=${meetingID}`);

    try {
        const response = await axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
        const jsonResponse = await parser.parseStringPromise(response.data);
        const mappedAttendees = mapJSONtoAttendees(jsonResponse);
        return mappedAttendees;
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

export async function handleBBBMeetingInfos() {
    const meetings = await getBBBMeetings();
    for (const meeting of meetings) {
        const meetingAttendees = await getBBBMeetingAttendees(meeting.meetingID);
        for (const attendee of meetingAttendees) {
            if (attendee.role && attendee.role === "VIEWER") {
                updateCourseAttendanceLog(attendee, meeting.meetingID);
            }
        }
    }
}
