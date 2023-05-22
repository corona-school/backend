/* eslint-disable camelcase */
import { prisma } from '../../common/prisma';
import { getAccessToken } from './zoom-authorization';
import dotenv from 'dotenv';
import { student } from '@prisma/client';
import { getLogger } from '../../common/logger/logger';

const logger = getLogger();

dotenv.config();

type ZoomUser = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    display_name: string;
    personal_meeting_url: string;
};

type ZAKResponse = {
    token: string;
};

enum ZoomLicenseType {
    BASIC = 1,
    LICENSED = 2,
    NONE = 99,
}

const zoomUserApiUrl = 'https://api.zoom.us/v2/users';

const createZoomUser = async (student: Pick<student, 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> => {
    const { access_token } = await getAccessToken();

    const createdUser = await fetch(zoomUserApiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'custCreate',
            user_info: {
                email: student.email,
                type: ZoomLicenseType.LICENSED,
                first_name: student.firstname,
                last_name: student.lastname,
                display_name: `${student.firstname} ${student.lastname}`,
            },
        }),
    });

    const newUser = (await createdUser.json()) as unknown as ZoomUser;
    logger.info(`Zoom - Created Zoom user ${newUser.id} for student with email ${newUser.email}`);

    return newUser;
};

async function getZoomUser(email: string): Promise<ZoomUser> {
    const { access_token } = await getAccessToken();
    const response = await fetch(`${zoomUserApiUrl}/${email}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    const data = response.json() as unknown as ZoomUser;

    return data;
}

async function updateZoomUser(student: Pick<student, 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> {
    const { access_token } = await getAccessToken();
    const response = await fetch(`${zoomUserApiUrl}/${student.email}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: student.firstname,
            last_name: student.lastname,
            display_name: `${student.firstname} ${student.lastname}`,
            type: ZoomLicenseType.LICENSED,
        }),
    });

    const data = response.json() as unknown as ZoomUser;
    logger.info(`Zoom - Updated Zoom user ${data.id} for student with email ${data.email}`);

    return data;
}

async function getUserZAK(userEmail: string): Promise<ZAKResponse> {
    // To find out more about the Zoom Access Key (ZAK), visit https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/userZak
    const { access_token } = await getAccessToken();
    const response = await fetch(`${zoomUserApiUrl}/${userEmail}/token?type=zak`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

const deleteZoomUser = async (zoomUserId: string) => {
    const { access_token } = await getAccessToken();
    const constructedUrl = `${zoomUserApiUrl}/${zoomUserId}?action=delete`;

    const response = await fetch(constructedUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    logger.info(`Zoom - Deleted Zoom user ${zoomUserId}`);

    return response.json();
};

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser, getUserZAK };
