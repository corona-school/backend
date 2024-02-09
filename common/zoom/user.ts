/* eslint-disable camelcase */
import { prisma } from '../prisma';
import { getAccessToken } from './authorization';
import dotenv from 'dotenv';
import { student } from '@prisma/client';
import { getLogger } from '../logger/logger';
import zoomRetry from './retry';
import { assureZoomFeatureActive } from './util';
import { ZoomUserResponse, ZoomUserType } from './type';
import { User } from '../user';
import { Lecture as Appointment } from '../../graphql/generated';

const logger = getLogger('Zoom User');

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

const createZoomUser = async (student: Pick<student, 'id' | 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> => {
    assureZoomFeatureActive();

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

    if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status} ${await response.text()}`);
    }

    const newUser = (await response.json()) as unknown as ZoomUser;

    if (response.status === 201) {
        logger.info(`Zoom - Created Zoom user ${newUser.id} for student with email ${newUser.email}`);
    }

    await prisma.student.update({ where: { id: student.id }, data: { zoomUserId: newUser.id } });
    logger.info(`Zoom - added licence to Student(${student.id})`);

    return newUser;
};

async function getZoomUser(email: string): Promise<ZoomUser | null> {
    assureZoomFeatureActive();

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
        logger.info(`Zoom - No Zoom user found for student with email ${email}`);
        return null;
    } else if (!response.ok) {
        throw new Error(`Zoom failed to get user: ${response.status} ${await response.text()}`);
    }

    logger.info(`Zoom - Retrieved Zoom user for student with email ${email}`);
    const data = response.json() as unknown as ZoomUser;
    return data;
}

export async function getOrCreateZoomUser(student: Pick<student, 'id' | 'firstname' | 'lastname' | 'email'>) {
    const existing = await getZoomUser(student.email);
    if (existing) {
        return existing;
    }

    return await createZoomUser(student);
}

async function updateZoomUser(student: Pick<student, 'firstname' | 'lastname' | 'email'>): Promise<ZoomUser> {
    assureZoomFeatureActive();

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

    if (!response.ok) {
        throw new Error(`Zoom failed to update user: ${response.status} ${await response.text()}`);
    }

    const data = response.json() as unknown as ZoomUser;

    if (response.status === 204) {
        logger.info(`Zoom - Updated Zoom user ${data.id} with email ${data.email}`);
    }

    return data;
}

// To find out more about the Zoom Access Key (ZAK), visit https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/userZak
async function getUserZAK(userEmail: string): Promise<ZAKResponse> {
    assureZoomFeatureActive();

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

    if (!response.ok) {
        throw new Error(`Zoom failed to get ZAK: ${response.status} ${await response.text()}`);
    }

    const data = response.json();

    return data;
}

const deleteZoomUser = async (student: Pick<student, 'id' | 'zoomUserId'>): Promise<void> => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();
    const constructedUrl = `${zoomUserApiUrl}/${student.zoomUserId}?action=delete`;

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

    if (!response.ok && response.status !== 404) {
        throw new Error(`Zoom failed to delete user for Student(${student.id}): ${await response.text()}`);
    }

    await prisma.student.update({ where: { id: student.id }, data: { zoomUserId: null } });
    logger.info(`Zoom - Deleted Zoom user ${student.zoomUserId} of Student(${student.id})`);
};

async function getZoomUserInfos(): Promise<ZoomUserType[] | null> {
    assureZoomFeatureActive();
    const scope = 'user:read:admin';
    const { access_token } = await getAccessToken(scope);

    try {
        const response = await zoomRetry(
            () =>
                fetch(`${zoomUserApiUrl}`, {
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
            logger.info(`Zoom - No Zoom users found`);
            return null;
        } else if (!response.ok) {
            throw new Error(`Zoom failed to get users: ${response.status} ${await response.text()}`);
        }
        const data = (await response.json()) as ZoomUserResponse;
        const usersSubset = data.users.map((user) => {
            const { id, first_name, last_name, email, type, status, role_id } = user;
            return { id, first_name, last_name, email, type, status, role_id };
        });

        return usersSubset;
    } catch (error) {
        logger.error(`ERROR to get user infos with error ${error}`, error);
        return null;
    }
}

async function getZoomUrl(user: User, appointment: Appointment) {
    if (!appointment.zoomMeetingId) {
        throw new Error(`No zoom meeting ID found for appointment ID: ${appointment.id}`);
    }
    const basicStartUrl = 'https://lern-fair.zoom.us/s';
    const basicJoinUrl = 'https://lern-fair.zoom.us/j';
    const isAppointmentOrganizer = appointment.organizerIds.includes(user.userID);
    const isAppointmentParticipant = appointment.participantIds.includes(user.userID);

    // The start_url always includes the ZAK from the host, who created the meeting and so every host and alternativHost would use the same identity
    // The workaround with creating own start_urls with the ZAK is an undocumented feature of zoom
    if (isAppointmentOrganizer) {
        const zoomOrganizerZak = (await getUserZAK(user.email)).token;
        return `${basicStartUrl}/${appointment.zoomMeetingId}?zak=${zoomOrganizerZak}`;
    } else if (isAppointmentParticipant) {
        // participants have to manually set their name for the zoom meeting
        return `${basicJoinUrl}/${appointment.zoomMeetingId}`;
    } else {
        throw new Error(`User with the ID ${user.userID} is no appointment organizer or participant `);
    }
}
export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser, getUserZAK, getZoomUrl, getZoomUserInfos as getZoomUsers };
