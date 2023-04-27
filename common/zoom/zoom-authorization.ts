import dotenv from 'dotenv';

dotenv.config();

const getAccessToken = async (apiKey: string, apiSecret: string, grantType: string, accountId: string) => {
    const zoomOauthApiUrl = `https://api.zoom.us/oauth/token?grant_type=${grantType}&account_id=${accountId}`;

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
