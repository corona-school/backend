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

type ZAKResponse = {
    token: string;
};

enum ZoomLicenseType {
    BASIC = 1,
    LICENSED = 2,
    NONE = 99,
}

const zoomUserApiUrl = 'https://api.zoom.us/v2/users';
const grantType = 'account_credentials';

const createZoomUser = async (studentMail, studentFirstname, studentLastname): Promise<ZoomUser> => {
    try {
        const { access_token } = await getAccessToken();

        const createdUser = await fetch(zoomUserApiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'custCreate',
                user_info: {
                    email: studentMail,
                    type: ZoomLicenseType.LICENSED,
                    first_name: studentFirstname,
                    last_name: studentLastname,
                    display_name: `${studentFirstname} ${studentLastname}`,
                },
            }),
        });

        return createdUser.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomUser(email: string): Promise<ZoomUser> {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch(`${zoomUserApiUrl}/${email}`, {
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

async function updateZoomUser(email: string, firstname?: string, lastname?: string): Promise<ZoomUser> {
    try {
        const { access_token } = await getAccessToken();
        const response = await fetch(`${zoomUserApiUrl}/${email}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstname,
                last_name: lastname,
                display_name: `${firstname} ${lastname}`,
                type: ZoomLicenseType.LICENSED,
            }),
        });

        return response as unknown as ZoomUser;
    } catch (error) {
        throw new Error(error);
    }
}

async function getUserZAK(userEmail: string): Promise<ZAKResponse> {
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
    try {
        const { access_token } = await getAccessToken();
        const constructedUrl = `${zoomUserApiUrl}/${zoomUserId}?action=delete`;

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

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser, ZoomUser, getUserZAK };
