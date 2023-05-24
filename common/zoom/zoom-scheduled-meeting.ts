import { getAccessToken } from './zoom-authorization';
import { ZoomUser } from './zoom-user';
import { getLogger } from '../../common/logger/logger';

const logger = getLogger();

enum RecurrenceMeetingTypes {
    DAILY = 1,
    WEEKLY = 2,
    MONTHLY = 3,
}

type ZoomMeeting = {
    next_page_token: string;
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
    meetings: [
        {
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
        }
    ];
};

const zoomUsersUrl = 'https://api.zoom.us/v2/users';
const zoomMeetingUrl = 'https://api.zoom.us/v2/meetings';
const zoomMeetingReportUrl = 'https://api.zoom.us/v2/report/meetings';

const createZoomMeeting = async (zoomUsers: ZoomUser[], startTime: Date, isCourse: boolean, endDateTime?: Date) => {
    const { access_token } = await getAccessToken();

    const altHosts: string[] = [];
    zoomUsers.forEach((user, index) => {
        if (index !== 0) {
            altHosts.push(user.email);
        }
    });
    const combinedAlternativeHosts = altHosts.join(';');

    const response = await fetch(`${zoomUsersUrl}/${zoomUsers[0].id}/meetings`, {
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
    });

    const data = await response.json();
    if (response.status === 201) {
        logger.info(`Zoom - The Zoom Meeting ${data.id} was created. The user with email "${data.host_email}" is assigned as host.`);
    } else {
        logger.error(`Zoom - ${response.statusText}`);
    }

    return data;
};

async function getZoomMeeting(meetingId: string) {
    const { access_token } = await getAccessToken();
    const response = await fetch(`${zoomMeetingUrl}/${meetingId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json() as unknown as ZoomMeeting;
}

async function getUsersZoomMeetings(email: string) {
    const { access_token } = await getAccessToken();
    const response = await fetch(`${zoomUsersUrl}/${email}/meetings`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json() as unknown as ZoomMeeting;
}

const deleteZoomMeeting = async (meetingId: string) => {
    if (!meetingId) {
        return;
    }
    const { access_token } = await getAccessToken();
    const constructedUrl = `${zoomMeetingUrl}/${meetingId}?action=delete`;

    const response = await fetch(constructedUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 204) {
        logger.info(`Zoom - The Zoom Meeting ${meetingId} was deleted.`);
    } else {
        logger.error(response.statusText);
    }

    return response.json();
};

const getZoomMeetingReport = async (meetingId: string) => {
    const { access_token } = await getAccessToken('report:read:admin');
    const constructedUrl = `${zoomMeetingReportUrl}/${meetingId}/participants`;

    const response = await fetch(constructedUrl, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 200) {
        logger.info(`Zoom - The Zoom Meeting ${meetingId} report was received.`);
    } else {
        logger.error(response.statusText);
    }

    return response.json();
};

export { getZoomMeeting, getUsersZoomMeetings, createZoomMeeting, deleteZoomMeeting, getZoomMeetingReport };
