/* eslint-disable camelcase */
import { getUser } from '../user';
import { getAccessToken } from './zoom-authorization';

const zoomUserApiUrl = 'https://api.zoom.us/v2/users/';

const createZoomUser = async (email: string, type: number, firstname: string, lastname: string) => {
    const grantType = 'account_credentials';

    try {
        const { access_token } = await getAccessToken('apiKey', 'apiSecret', grantType, 'accountId');

        const createdUser = await fetch(zoomUserApiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'custCreate',
                user_info: {
                    email,
                    type,
                    first_name: firstname,
                    last_name: lastname,
                    display_name: `${firstname} ${lastname}`,
                },
            }),
        });

        return createdUser.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getZoomUser(userId, apiKey, apiSecret, email) {
    if (userId) {
        const response = await fetch(`${zoomUserApiUrl}/${userId}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        return data;
    }
    const loggedInUser = await getUser(userId);
    createZoomUser(email, 1, loggedInUser.firstname, loggedInUser.lastname);
}

async function updateZoomUser(userId, apiKey, apiSecret, updateData) {
    const response = await fetch(`${zoomUserApiUrl}/${userId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });

    const data = await response.json();

    return data;
}

async function deleteZoomUser(userId, apiKey, apiSecret) {
    const response = await fetch(`${zoomUserApiUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete Zoom user');
    }
}

export { createZoomUser, getZoomUser, updateZoomUser, deleteZoomUser };
