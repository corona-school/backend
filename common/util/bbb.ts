import { hashToken } from "./hashing";
import { getLogger } from 'log4js';
import axios from "axios";
import { Parser } from "xml2js";

const parser = new Parser();
const logger = getLogger();

export const bbbMeetingCache: Map<string, BBBMeeting> = new Map<string, BBBMeeting>();
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
        return axios.get(`${baseUrl}${callName}?${queryParams}&checksum=${hashToken(callName + queryParams + sharedSecret, "sha1")}`)
            .then(response => {
                if (response.status === 200) {
                    const m: BBBMeeting = new BBBMeeting(id, name, attendeePW, moderatorPW,
                        (userName: string): string => getMeetingUrl(id, userName, attendeePW),
                        (userName: string): string => getMeetingUrl(id, userName, moderatorPW));
                    bbbMeetingCache.set(m.meetingID, m);
                    return m;
                } else {
                    Promise.reject("Status code: " + response.status);
                }
            })
            .catch(error => {
                logger.debug(error);
                return Promise.reject("An error occured.");
            });
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

export async function getBBBMeetings(): Promise<[BBBMeeting]> {
    const callName = "getMeetings";

    return axios.get(`${baseUrl}${callName}?checksum=${hashToken(callName + sharedSecret, "sha1")}`)
        .then(response => parser.parseStringPromise(response.data))
        .then(jsonResponse => mapJSONtoBBBMeetings(jsonResponse))
        .catch(error => {
            logger.debug(error);
            return Promise.reject("An error occured.");
        });
}

export async function updateBBBMeetingCache(): Promise<void> {
    bbbMeetingCache.clear();
    return getBBBMeetings().then(meetings => meetings.forEach(meeting => bbbMeetingCache.set(meeting.meetingID, meeting)));
}

function mapJSONtoBBBMeetings(json: any): [BBBMeeting] {
    return json && json.response && json.response.meetings && json.response.meetings.length > 0 && json.response.meetings[0] &&
        json.response.meetings[0].meeting && json.meeting.length > 0 && json.meeting.map(o => mapJSONtoBBBMeeting(o));
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
        this.meetingName = meetingName
        this.attendeePW = attendeePW;
        this.moderatorPW = moderatorPW;

        this.attendeeUrl = attendeeUrl;
        this.moderatorUrl = moderatorUrl;
    }
}
