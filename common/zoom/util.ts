import assert from 'assert';
import jwt from 'jsonwebtoken';
import { getIntervalOverlapInSeconds } from '../util/basic';
import type { ZoomMeetingParticipant } from './scheduled-meeting';

export enum MeetingRole {
    PARTICIPANT = 0,
    HOST = 1,
}

type JWTPayload = {
    appKey: string;
    sdkKey: string;
    mn: number;
    role: MeetingRole;
    iat: number;
    exp: number;
    tokenExp: number;
};

const sdkKey = process.env.ZOOM_MEETING_SDK_CLIENT_ID;
const secret = process.env.ZOOM_MEETING_SDK_CLIENT_SECRET;

if (isZoomFeatureActive()) {
    assert(sdkKey, 'Missing ZOOM_MEETING_SDK_CLIENT_ID in ENV');
    assert(secret, 'Missing ZOOM_MEETING_SDK_CLIENT_SECRET in ENV');
}

const generateMeetingSDKJWT = (meetingNumber: number, role: MeetingRole) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const payload: JWTPayload = {
        sdkKey,
        appKey: sdkKey,
        mn: meetingNumber,
        role,
        iat,
        exp,
        tokenExp: exp,
    };

    const jwtToken = jwt.sign(payload, secret);
    return jwtToken;
};

function isZoomFeatureActive(): boolean {
    return JSON.parse(process.env.ZOOM_ACTIVE || 'false');
}

function assureZoomFeatureActive() {
    if (!isZoomFeatureActive()) {
        throw new Error(`Zoom is deactivated`);
    }
}

function removeHost(existingHosts: string, hostToRemove: string): string {
    const hostsArray = existingHosts.split(';');
    const indexToRemove = hostsArray.indexOf(hostToRemove);

    if (indexToRemove !== -1) {
        hostsArray.splice(indexToRemove, 1);
        return hostsArray.join(';');
    } else {
        return existingHosts;
    }
}

function addHost(existingHosts: string, newHost: string): string {
    if (existingHosts === '') {
        return newHost;
    } else {
        return existingHosts + (existingHosts.endsWith(';') ? '' : ';') + newHost;
    }
}

function getSharedMeetingTimeInSeconds(participants: ZoomMeetingParticipant[]): number {
    // Only students have a zoom account
    const hostFragments = participants.filter((e) => !!e.id);
    const guestFragments = participants.filter((e) => !e.id);

    if (!hostFragments.length || !guestFragments.length) {
        return 0;
    }

    // Users can have internet issues or other reason to reconnect and so have multiple join/leave times.
    const hostIntervals = hostFragments
        .filter((r) => r.status === 'in_meeting')
        .map((r) => ({
            start: new Date(r.join_time),
            end: new Date(r.leave_time),
        }));

    const guestIntervals = guestFragments
        .filter((r) => r.status === 'in_meeting')
        .map((r) => ({
            start: new Date(r.join_time),
            end: new Date(r.leave_time),
        }));
    return getIntervalOverlapInSeconds(hostIntervals, guestIntervals);
}

export { generateMeetingSDKJWT, isZoomFeatureActive, assureZoomFeatureActive, addHost, removeHost, getSharedMeetingTimeInSeconds };
