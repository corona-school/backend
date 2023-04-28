/* eslint-disable camelcase */
import { String } from 'lodash';
import { GraphQLUser } from '../user/session';
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

const zoomUserUrl = 'https://api.zoom.us/v2/users';

const createZoomMeeting = async (user: GraphQLUser) => {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(`${zoomUserUrl}/${user.userID}/meetings`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agenda: 'My Meeting',
                default_password: false,
                duration: 60,
                start_time: '2023-06-25T07:32:55Z',
                timezone: 'Europe/Berlin',
                type: 2,
                topic: 'LF Zoom Meeting',
            }),
        });

        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomMeeting(user: GraphQLUser) {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch(`${zoomUserUrl}/${user.email}/meetings`, {
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

const getOneZoomMeeting = async (meetingId: string) => {
    try {
        const { access_token } = await getAccessToken();
        const constructedUrl = `https://api.zoom.us/v2/meetings/${meetingId}`;

        const response = await fetch(constructedUrl, {
            method: 'GET',
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

// ADMIN, higher plan
const getMeetingDetailReport = async (meetingId: string) => {
    try {
        const { access_token } = await getAccessToken();
        const constructedUrl = `https://api.zoom.us/v2/report/meetings/${meetingId}`;

        const response = await fetch(constructedUrl, {
            method: 'GET',
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

const deleteZoomMeeting = async (meetingId: string) => {
    try {
        const { access_token } = await getAccessToken();
        const constructedUrl = `https://api.zoom.us/v2/meetings/${meetingId}`;

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

export { getZoomMeeting, getOneZoomMeeting, getMeetingDetailReport, createZoomMeeting, deleteZoomMeeting };
