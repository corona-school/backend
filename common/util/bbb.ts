import {hashToken} from "./hashing";
import {getLogger} from 'log4js';
import axios, {AxiosResponse} from "axios";
import {Parser} from "xml2js";
import {Mutex} from "async-mutex";
import {Pupil} from "../entity/Pupil";
import {CourseAttendanceLogging} from "../entity/CourseAttendanceLogging";
import {Course} from "../entity/Course";
import {getManager, getRepository} from "typeorm";
import {log} from "util";

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
                (userName: string): string => getMeetingUrl(id, userName, attendeePW),
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

export function getMeetingUrl(id: string, name: string, pw: string): string {
    const callName = 'join';
    const queryParams = encodeURI(`fullName=${name}&meetingID=${id}&password=${pw}&redirect=true`);

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
        (userName: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
            o && o.attendeePW && o.attendeePW.length > 0 && o.attendeePW[0]),
        (userName: string): string => getMeetingUrl(o && o.meetingID && o.meetingID.length > 0 && o.meetingID[0], userName,
            o && o.moderatorPW && o.moderatorPW.length > 0 && o.moderatorPW[0]));
}

export class BBBMeeting {
    meetingID: string;
    meetingName: string;
    attendeePW: string;
    moderatorPW: string;

    attendeeUrl: (userName: string) => string;
    moderatorUrl: (userName: string) => string;

    constructor(meetingID: string, meetingName: string, attendeePW: string, moderatorPW,
                attendeeUrl: (userName: string) => string, moderatorUrl: (userName: string) => string) {
        this.meetingID = meetingID;
        this.meetingName = meetingName;
        this.attendeePW = attendeePW;
        this.moderatorPW = moderatorPW;

        this.attendeeUrl = attendeeUrl;
        this.moderatorUrl = moderatorUrl;
    }
}

export class BBBMeetingInfo {
    meetingID: string;
    meetingName: string;
    attendeePW: string;
    moderatorPW: string;
    createTime: string;
    createDate: string;

    attendeeUrl: (userName: string) => string;
    moderatorUrl: (userName: string) => string;

    constructor(meetingID: string, meetingName: string, attendeePW: string, moderatorPW,
                attendeeUrl: (userName: string) => string, moderatorUrl: (userName: string) => string) {
        this.meetingID = meetingID;
        this.meetingName = meetingName;
        this.attendeePW = attendeePW;
        this.moderatorPW = moderatorPW;

        this.attendeeUrl = attendeeUrl;
        this.moderatorUrl = moderatorUrl;
    }
}

export class Attendee {
    userID: string;
    fullName: string;
    firstname: string;
    lastname: string;
    role: string;


    constructor(userID: string, fullName: string, firstname: string, lastname: string, role: string) {
        this.userID = userID;
        this.fullName = fullName;
        this.firstname = firstname;
        this.lastname = lastname;
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
    const name = o.fullName[0].split(" ");
    const firstname = name[0];
    const lastname = name[name.length - 1];

    return new Attendee(o && o.userID && o.userID.length > 0 && o.userID[0],
        o && o.fullName && o.fullName.length > 0 && o.fullName[0],
        firstname, lastname, o && o.role && o.role.length > 0 && o.role[0]);
}

export async function createBBBlog(user: Pupil, ip: string, courseId) {
    const courseAttendanceLogging = new CourseAttendanceLogging();
    const logger = getLogger();
    const entityManager = getManager();

    if (courseId == null) {
        logger.error("Can't save new course attendance: courseId is null");
        logger.debug(courseAttendanceLogging);
    } else {
        try {
            courseAttendanceLogging.ip = ip;
            courseAttendanceLogging.pupil = await entityManager.findOne(Pupil,
                {firstname: user.firstname, lastname: user.lastname});
            courseAttendanceLogging.course = await entityManager.findOne(Course, {id: courseId});

            await entityManager.save(CourseAttendanceLogging, courseAttendanceLogging);
            // await transactionLog.log(new CreateCourseEvent(student, course));
            logger.info("Successfully saved new Course Attendance");
        } catch (e) {
            logger.error("Can't save new course attendance: " + e.message);
            logger.debug(courseAttendanceLogging, e);
        }
    }
}

export async function updateBBBlog(user: Attendee, ip: string, courseId) {
    const courseAttendanceLogging = new CourseAttendanceLogging();
    const logger = getLogger();
    const entityManager = getManager();
    const repository = getRepository("CourseAttendanceLogging");

    if (courseId == null) {
        logger.error("Can't save new course attendance: courseId is null");
        logger.debug(courseAttendanceLogging);
    } else {
        try {
            // courseAttendanceLogging.ip = ip;
            // courseAttendanceLogging.pupil = await entityManager.findOne(Pupil,
            //     {firstname: user.firstname, lastname: user.lastname});
            // courseAttendanceLogging.course = await entityManager.findOne(Course, {id: courseId});

            console.log("repository.find(): ", await repository.findOne({ pupilId: 1}));
            var dbEntry = await repository.findOne({ pupilId: 1});
            // TODO: Update Entry in Database
            // dbEntry.updatedAt: new Date();
            // await repository.save(dbEntry);
            // await entityManager.save(CourseAttendanceLogging, courseAttendanceLogging);
            // await transactionLog.log(new CreateCourseEvent(student, course));
            logger.info("Successfully updated Course Attendance from pupil");
        } catch (e) {
            logger.error("Can't save new course attendance: " + e.message);
            logger.debug(courseAttendanceLogging, e);
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
        // console.log(mappedAttendees);
        return mappedAttendees;
    } catch (error) {
        logger.debug(error);
        return null;
    }
}

export async function handleBBBlog() {
    const meetings = await getBBBMeetings();
    for (const meeting of meetings) {
        const meetingAttendees = await getBBBMeetingAttendees(meeting.meetingID);
        console.log("Attendees of meeting with ID " + meeting.meetingID + ": ", meetingAttendees);
        for (const attendee of meetingAttendees) {
            if (attendee.role && attendee.role === "VIEWER") {
                // TODO: IP-Adresse einfügen
                updateBBBlog(attendee, "localhost", meeting.meetingID);
            }
        }
    }
}

setInterval(() => {
    handleBBBlog();
}, 15000);
