import dotenv from 'dotenv';

dotenv.config();
const grantType = 'account_credentials';

const getAccessToken = async () => {
    const zoomOauthApiUrl = `https://api.zoom.us/oauth/token?grant_type=${grantType}&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

    const response = await fetch(zoomOauthApiUrl, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`).toString('base64')}`,
        },
    });
    const data = await response.json();
    return data;
};

export { getAccessToken };
