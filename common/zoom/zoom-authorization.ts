import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ZOOM_API_KEY;
const apiSecret = process.env.ZOOM_API_SECRET;
const grantType = 'account_credentials';
const accountId = process.env.ZOOM_ACCOUNT_ID;

const getAccessToken = async (scope?: string) => {
    const zoomOauthApiUrl = `https://api.zoom.us/oauth/token?grant_type=${grantType}&account_id=${accountId}`;

    const response = await fetch(zoomOauthApiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
        },
        ...(scope ? { body: JSON.stringify({ scope: [scope] }) } : {}),
    });
    const data = await response.json();
    return data;
};

export { getAccessToken };
