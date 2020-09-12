import {hashToken} from "./hashing";
import {getLogger} from 'log4js';
import axios from "axios";
import {Parser} from "xml2js";
import {Mutex} from "async-mutex";
import {Pupil} from "../entity/Pupil";
import {CourseAttendanceLog} from "../entity/CourseAttendanceLog";
import {getManager} from "typeorm";
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

const courseAttendanceLogInterval = 600000;
setInterval(() => {
    handleBBBMeetingInfos();
}, courseAttendanceLogInterval);

export async function createBBBMeeting(name: string, id: string): Promise<BBBMeeting> {
    const attendeePW = hashToken('' + Math.random(), "sha1");
    const moderatorPW = hashToken('' + Math.random(), "sha1");

    const callName = 'create';
    const queryParams = encodeURI(`attendeePW=${attendeePW}&meetingID=${id}&moderatorPW=${moderatorPW}&name=${name}&record=false`);
    let meetingIsRunning: boolean = await isBBBMeetingRunning(id);

    if (bbbMeetingCache.get(id) && meetingIsRunning) {
        return bbbMeetingCache.get(id);
    } else {
        if (bbbMeetingCache.get(id)) {
            bbbMeetingCache.delete(id);
        }
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
                // Update log
                logToUpdate.attendedTime += courseAttendanceLogInterval;
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

export async function getBBBMeetingAttendees(meetingID: string): Promise<Attendee[]> {
    const callName = "getMeetingInfo";
    const queryParams = encodeURI(`meetingID=${meetingID}`);

    try {
        const response = await axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`);
        const jsonResponse = await parser.parseStringPromise(response.data);
        return mapJSONtoAttendees(jsonResponse);
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

export async function handleBBBMeetingInfos() {
    const entityManager = getManager();
    const meetings = await getBBBMeetings();
    if (meetings != null) {
        for (const meeting of meetings) {
            const meetingAttendees = await getBBBMeetingAttendees(meeting.meetingID);
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
                            createOrUpdateCourseAttendanceLog(pupilFromDB, null, meeting.meetingID);
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
