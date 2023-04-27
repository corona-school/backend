/* eslint-disable camelcase */
import { GraphQLUser } from '../user/session';
import { getAccessToken } from './zoom-authorization';
import dotenv from 'dotenv';

dotenv.config();

type ZoomUser = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    display_name: string;
    personal_meeting_url: string;
};

const zoomUserApiUrl = 'https://api.zoom.us/v2/users';
const grantType = 'account_credentials';

const createZoomUser = async (user: GraphQLUser): Promise<ZoomUser> => {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);

        const createdUser = await fetch(zoomUserApiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'custCreate',
                user_info: {
                    email: user.email,
                    type: 1,
                    first_name: user.firstname,
                    last_name: user.lastname,
                    display_name: `${user.firstname} ${user.lastname}`,
                },
            }),
        });

        return createdUser.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomUser(user: GraphQLUser): Promise<ZoomUser> {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);
        const response = await fetch(`${zoomUserApiUrl}/${user.email}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json() as unknown as ZoomUser;
    } catch (error) {
        throw new Error(error);
    }
}

async function updateZoomUser(user: GraphQLUser): Promise<ZoomUser> {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);
        const response = await fetch(`${zoomUserApiUrl}/${user.email}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: user.firstname,
                last_name: user.lastname,
                display_name: `${user.firstname} ${user.lastname}`,
            }),
        });

        return response as unknown as ZoomUser;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteZoomUser = async (user: GraphQLUser) => {
    try {
        const { access_token } = await getAccessToken(process.env.ZOOM_API_KEY, process.env.ZOOM_API_SECRET, grantType, process.env.ZOOM_ACCOUNT_ID);
        const constructedUrl = `${zoomUserApiUrl}/${user.userID}?action=delete`;

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

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser };
