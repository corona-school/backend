import dotenv from 'dotenv';

dotenv.config();
const zoomOauthApiUrl = `https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

const getAccessToken = async (apiKey: string, apiSecret: string, grantType: string, accountId: string) => {
    const response = await fetch(zoomOauthApiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
        },
    });
    const data = await response.json();
    return data;
};

export { getAccessToken };
