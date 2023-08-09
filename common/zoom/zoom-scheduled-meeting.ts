import { getAccessToken } from './zoom-authorization';
import { ZoomUser } from './zoom-user';
import { getLogger } from '../../common/logger/logger';
import zoomRetry from './zoom-retry';
import { assureZoomFeatureActive, isZoomFeatureActive } from '.';
import { lecture as Appointment } from '@prisma/client';
import { prisma } from '../prisma';
import moment from 'moment';

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

const createZoomMeeting = async (zoomUsers: ZoomUser[], startTime: Date, duration: number, isCourse: boolean, endDateTime?: Date): Promise<ZoomMeeting> => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();

    const altHosts: string[] = [];
    zoomUsers.forEach((user, index) => {
        if (index !== 0) {
            altHosts.push(user.email);
        }
    });
    const combinedAlternativeHosts = altHosts.join(';');

    const tz = 'Europe/Berlin';
    const start = moment(startTime).tz(tz).format('YYYY-MM-DDTHH:mm:ss');
    logger.info(start);

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
                    duration: duration,
                    start_time: start,
                    timezone: tz,
                    type: RecurrenceMeetingTypes.WEEKLY,
                    mute_upon_entry: true,
                    join_before_host: true,
                    waiting_room: isCourse ? true : false,
                    breakout_room: isCourse ? true : false,
                    recurrence: endDateTime && {
                        end_date_time: moment(endDateTime).tz(tz).format('YYYY-MM-DDTHH:mm:ss'),
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

    if (!response.ok && response.status !== 404) {
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

const updateZoomMeeting = async (meetingId: string, startTime?: Date, duration?: number, endTime?: Date): Promise<void> => {
    assureZoomFeatureActive();

    const { access_token } = await getAccessToken();
    const tz = 'Europe/Berlin';
    const start = moment(startTime).tz(tz).format('YYYY-MM-DDTHH:mm:ss');
    const end = moment(endTime).tz(tz).format('YYYY-MM-DDTHH:mm:ss');

    const body = JSON.stringify({
        start_time: start,
        duration: duration,
        timezone: tz,
        recurrence: {
            end_date_time: end,
            type: RecurrenceMeetingTypes.WEEKLY,
        },
    });

    const response = await zoomRetry(
        () =>
            fetch(`${zoomMeetingUrl}/${meetingId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            }),
        3,
        1000
    );

    if (!response.ok && response.status !== 404) {
        throw new Error(`Zoom - failed to update meeting with ${response.status} ${await response.text()}`);
    }

    logger.info(`Zoom - The Zoom Meeting was updated.`);
};

export { getZoomMeeting, getUsersZoomMeetings, createZoomMeeting, deleteZoomMeeting, getZoomMeetingReport, updateZoomMeeting };
