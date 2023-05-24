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

enum ChatPrivileges {
    WITH_NOONE = 1,
    WITH_HOST_AND_COHOST_ONLY = 2,
    WITH_EVERYONE_PUBLIC = 3,
    WITH_EVERYONE_PUBLIC_AND_PRIVATE = 4,
}

const zoomUserApiUrl = 'https://api.zoom.us/v2/users';

const createZoomUser = async (student: Pick<student, 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> => {
    const { access_token } = await getAccessToken();

    const response = await fetch(zoomUserApiUrl, {
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
            settings: {
                email_notification: {
                    cloud_recording_available_reminder: false,
                    recording_available_reminder_alternative_hosts: false,
                    recording_available_reminder_schedulers: false,
                },
                in_meeting: {
                    allow_participants_chat_with: ChatPrivileges.WITH_EVERYONE_PUBLIC,
                },
                recording: {
                    local_recording: false,
                    cloud_recording: false,
                },
            },
        }),
    });

    const newUser = (await response.json()) as unknown as ZoomUser;

    if (response.status === 201) {
        logger.info(`Zoom - Created Zoom user ${newUser.id} for student with email ${newUser.email}`);
    } else {
        logger.error(response.statusText);
    }

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

    if (response.status === 404) {
        return null;
    }

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

    if (response.status === 204) {
        logger.info(`Zoom - Updated Zoom user ${data.id} for student with email ${data.email}`);
    }

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

    if (response.status === 204) {
        logger.info(`Zoom - Deleted Zoom user ${zoomUserId}`);
    } else {
        logger.error(response.statusText);
    }

    return response;
};

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser, getUserZAK };
