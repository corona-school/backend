import assert from 'assert';
import jwt from 'jsonwebtoken';

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

export { generateMeetingSDKJWT, isZoomFeatureActive, assureZoomFeatureActive };
