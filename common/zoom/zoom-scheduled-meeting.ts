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

const zoomMeetingUrl = 'https://api.zoom.us/v2/users';
const grantType = 'account_credentials';

const createZoomMeeting = async (user: GraphQLUser) => {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);

        const response = await fetch(`${zoomMeetingUrl}/${user.userID}/meetings`, {
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
            }),
        });

        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomMeeting(user: GraphQLUser) {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);
        const response = await fetch(`${zoomMeetingUrl}/${user.email}/meetings`, {
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
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);
        const constructedUrl = `https://api.zoom.us/v2/${meetingId}?action=delete`;

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

export { getZoomMeeting, createZoomMeeting, deleteZoomMeeting };
