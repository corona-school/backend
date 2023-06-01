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

const generateMeetingSDKJWT = async (meetingNumber: number, role: MeetingRole) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const payload: JWTPayload = {
        sdkKey: process.env.ZOOM_MEETING_SDK_CLIENT_ID,
        appKey: process.env.ZOOM_MEETING_SDK_CLIENT_ID,
        mn: meetingNumber,
        role,
        iat,
        exp,
        tokenExp: exp,
    };

    const jwtToken = jwt.sign(payload, process.env.ZOOM_MEETING_SDK_CLIENT_SECRET);
    return jwtToken;
};

function isZoomFeatureActive(): boolean {
    return JSON.parse(process.env.ZOOM_ACTIVE || 'false');
}

export { generateMeetingSDKJWT, isZoomFeatureActive };
