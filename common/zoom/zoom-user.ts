/* eslint-disable camelcase */
import { getUser } from '../user';
import { getAccessToken } from './zoom-authorization';

const zoomUserApiUrl = 'https://api.zoom.us/v2/users';

const createZoomUser = async (email: string, type: number) => {
    const apiKey = 'J1MfvLGeStCTF_uP7DREVg';
    const apiSecret = 'Lp0031nELalGE55LgTqz3yk3wP6oykOC';
    const grantType = 'authorization_code';
    const accountId = 'idsIiH7RTvOcCIii8hrtEA';

    try {
        const accessToken = await getAccessToken(apiKey, apiSecret, grantType, accountId);

        const createdUser = await fetch(zoomUserApiUrl, {
            method: 'POST',
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                type,
            }),
        });

        return createdUser;
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
    createZoomUser(email, 1);
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
