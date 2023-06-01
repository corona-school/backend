/* eslint-disable camelcase */
import { prisma } from '../../common/prisma';
import { getAccessToken } from './zoom-authorization';
import dotenv from 'dotenv';
import { student } from '@prisma/client';
import { getLogger } from '../../common/logger/logger';
import zoomRetry from './zoom-retry';
import { isZoomFeatureActive } from '.';

const logger = getLogger();

dotenv.config();

const dummyUser = {
    id: '123456789',
    first_name: 'Max',
    last_name: 'Mustermann',
    email: 'max@mustermann.de',
    display_name: 'Max Mustermann',
    personal_meeting_url: 'https://zoom.us/j/123456789',
};

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
    if (!isZoomFeatureActive()) {
        // return test data if zoom is not active
        return dummyUser;
    }
    const { access_token } = await getAccessToken();

    const response = await zoomRetry(
        () =>
            fetch(zoomUserApiUrl, {
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
            }),
        3,
        1000
    );

    const newUser = (await response.json()) as unknown as ZoomUser;

    if (response.status === 201) {
        logger.info(`Zoom - Created Zoom user ${newUser.id} for student with email ${newUser.email}`);
    } else {
        logger.error(`Zoom - ${response.statusText}`);
    }

    return newUser;
};

async function getZoomUser(email: string): Promise<ZoomUser> {
    if (!isZoomFeatureActive()) {
        // return test data if zoom is not active
        return dummyUser;
    }
    const { access_token } = await getAccessToken();
    const response = await zoomRetry(
        () =>
            fetch(`${zoomUserApiUrl}/${email}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }),
        3,
        1000
    );

    if (response.status === 404) {
        logger.error(`Zoom - No Zoom user found for student with email ${email}`);
        return null;
    } else if (response.status === 200) {
        logger.info(`Zoom - Retrieved Zoom user for student with email ${email}`);
    } else {
        logger.error(`Zoom - ${response.statusText}`);
    }

    const data = response.json() as unknown as ZoomUser;
    return data;
}

async function updateZoomUser(student: Pick<student, 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> {
    if (!isZoomFeatureActive()) {
        return dummyUser;
    }
    const { access_token } = await getAccessToken();
    const response = await zoomRetry(
        () =>
            fetch(`${zoomUserApiUrl}/${student.email}`, {
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
            }),
        3,
        1000
    );

    const data = response.json() as unknown as ZoomUser;

    if (response.status === 204) {
        logger.info(`Zoom - Updated Zoom user ${data.id} for student with email ${data.email}`);
    } else {
        logger.error(`Zoom - ${response.statusText}`);
    }

    return data;
}

// To find out more about the Zoom Access Key (ZAK), visit https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/userZak
async function getUserZAK(userEmail: string): Promise<ZAKResponse> {
    if (!isZoomFeatureActive()) {
        // return test data if zoom is not active
        return {
            token: '123456789',
        };
    }
    const { access_token } = await getAccessToken();
    const response = await zoomRetry(
        () =>
            fetch(`${zoomUserApiUrl}/${userEmail}/token?type=zak`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }),
        3,
        1000
    );
    return response.json();
}

const deleteZoomUser = async (zoomUserId: string) => {
    const { access_token } = await getAccessToken();
    const constructedUrl = `${zoomUserApiUrl}/${zoomUserId}?action=delete`;

    const response = await zoomRetry(
        () =>
            fetch(constructedUrl, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }),
        3,
        1000
    );

    if (response.status === 204) {
        logger.info(`Zoom - Deleted Zoom user ${zoomUserId}`);
    } else {
        logger.error(`Zoom - ${response.statusText}`);
    }

    return response;
};

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser, getUserZAK };
