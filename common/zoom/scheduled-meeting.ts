import { getAccessToken } from './authorization';
import { ZoomUser } from './user';
import { getLogger } from '../logger/logger';
import zoomRetry from './retry';
import { assureZoomFeatureActive, isZoomFeatureActive } from './util';
import { lecture as Appointment } from '@prisma/client';
import { prisma } from '../prisma';

const logger = getLogger('Zoom Meeting');

enum RecurrenceMeetingTypes {
    DAILY = 1,
    WEEKLY = 2,
    MONTHLY = 3,
}

export type ZoomMeeting = {
    agenda: string;
    created_at: string;
    duration: number;
    host_id: string;
    id: number;
    join_url: string;
    pmi: string;
    start_time: string;
    timezone: string;
    topic: string;
    type: number;
    uuid: string;
};

export type ZoomMeetings = {
    next_page_token: string;
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
    meetings: ZoomMeeting[];
};

const zoomUsersUrl = 'https://api.zoom.us/v2/users';
const zoomMeetingUrl = 'https://api.zoom.us/v2/meetings';
const zoomMeetingReportUrl = 'https://api.zoom.us/v2/report/meetings';

const createZoomMeeting = async (zoomUsers: ZoomUser[], startTime: Date, isCourse: boolean, endDateTime?: Date): Promise<ZoomMeeting> => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();

    const altHosts: string[] = [];
    zoomUsers.forEach((user, index) => {
        if (index !== 0) {
            altHosts.push(user.email);
        }
    });
    const combinedAlternativeHosts = altHosts.join(';');

    const response = await zoomRetry(
        () =>
            fetch(`${zoomUsersUrl}/${zoomUsers[0].id}/meetings`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agenda: 'My Meeting',
                    default_password: false,
                    duration: 60,
                    start_time: startTime,
                    timezone: 'Europe/Berlin',
                    type: RecurrenceMeetingTypes.WEEKLY,
                    mute_upon_entry: true,
                    waiting_room: isCourse ? true : false,
                    breakout_room: isCourse ? true : false,
                    recurrence: endDateTime && {
                        end_date_time: new Date(endDateTime.setHours(24, 0, 0, 0)),
                        type: RecurrenceMeetingTypes.WEEKLY,
                    },
                    settings: {
                        alternative_hosts: combinedAlternativeHosts,
                        alternative_hosts_email_notification: false,
                    },
                }),
            }),
        3,
        1000
    );

    if (!response.ok) {
        throw new Error(`Zoom - failed to create meeting with ${response.status} ${await response.text()}`);
    }
    const data = await response.json();

    if (response.status === 201) {
        logger.info(`Zoom - The Zoom Meeting ${data.id} was created.`);
    }

    return data;
};

async function getZoomMeeting(appointment: Appointment): Promise<ZoomMeeting> {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();
    const response = await zoomRetry(
        () =>
            fetch(`${zoomMeetingUrl}/${appointment.zoomMeetingId}`, {
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
        throw new Error(`Zoom - failed to get meeting with ${response.status} ${await response.text()}`);
    }

    return (await response.json()) as ZoomMeeting;
}

async function getUsersZoomMeetings(email: string): Promise<ZoomMeetings> {
    const { access_token } = await getAccessToken();
    const response = await zoomRetry(
        () =>
            fetch(`${zoomUsersUrl}/${email}/meetings`, {
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
        throw new Error(`Zoom - failed to get meetings with ${response.status} ${await response.text()}`);
    }

    return (await response.json()) as ZoomMeetings;
}

const deleteZoomMeeting = async (appointment: Appointment): Promise<void> => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();
    const constructedUrl = `${zoomMeetingUrl}/${appointment.zoomMeetingId}?action=delete`;

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

    if (!response.ok) {
        throw new Error(`Zoom - Failed to delete meeting with ${response.status} ${await response.text()}`);
    }

    await prisma.lecture.update({ where: { id: appointment.id }, data: { zoomMeetingId: null } });
    logger.info(`Zoom - The Zoom Meeting ${appointment.zoomMeetingId} was deleted.`);
};

const getZoomMeetingReport = async (meetingId: string) => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken('report:read:admin');
    const constructedUrl = `${zoomMeetingReportUrl}/${meetingId}/participants`;

    const response = await zoomRetry(
        () =>
            fetch(constructedUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }),
        3,
        1000
    );

    if (response.status === 200) {
        logger.info(`Zoom - The Zoom Meeting ${meetingId} report was received.`);
    } else if (!response.ok) {
        throw new Error(`Failed to retrieve Zoom Meeting Report ${await response.text()}`);
    }

    return response.json();
};

export { getZoomMeeting, getUsersZoomMeetings, createZoomMeeting, deleteZoomMeeting, getZoomMeetingReport };
