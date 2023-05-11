import { getAccessToken } from './zoom-authorization';

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
const grantType = 'account_credentials';

const createZoomMeeting = async (zoomUserId: string, startTime: Date, endDateTime?: Date) => {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(`${zoomUsersUrl}/${zoomUserId}/meetings`, {
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
                type: 2,
                muteUpponEntry: true,
                waitingRoom: true,
                recurrence: endDateTime && {
                    end_date_time: new Date(endDateTime.setHours(24, 0, 0, 0)),
                    type: 2,
                },
            }),
        });

        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomMeeting(meetingId: string) {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch(`${zoomMeetingUrl}/${meetingId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json() as unknown as ZoomMeeting;
    } catch (error) {
        throw new Error(error);
    }
}

async function getUsersZoomMeetings(email: string) {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch(`${zoomUsersUrl}/${email}/meetings`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json() as unknown as ZoomMeeting;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteZoomMeeting = async (meetingId: string) => {
    try {
        const { access_token } = await getAccessToken();
        const constructedUrl = `${zoomMeetingUrl}/${meetingId}?action=delete`;

        const response = await fetch(constructedUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

const getZoomMeetingReport = async (meetingId: string) => {
    try {
        const { access_token } = await getAccessToken('report:read:admin');
        const constructedUrl = `${zoomMeetingReportUrl}/${meetingId}`;

        const response = await fetch(constructedUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

export { getZoomMeeting, getUsersZoomMeetings, createZoomMeeting, deleteZoomMeeting, getZoomMeetingReport };
