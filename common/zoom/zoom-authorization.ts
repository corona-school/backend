import dotenv from 'dotenv';
import { access } from 'fs';
import { getLogger } from '../../common/logger/logger';
import zoomRetry from './zoom-retry';

const logger = getLogger();

dotenv.config();

const apiKey = process.env.ZOOM_API_KEY;
const apiSecret = process.env.ZOOM_API_SECRET;
const grantType = 'account_credentials';
const accountId = process.env.ZOOM_ACCOUNT_ID;

let accessToken: string | null = null;

const getAccessToken = async (scope?: string) => {
    if (accessToken && !scope) {
        return { access_token: accessToken };
    }
    const zoomOauthApiUrl = `https://api.zoom.us/oauth/token?grant_type=${grantType}&account_id=${accountId}`;
    const zoomAuthHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

    const response = await zoomRetry(
        () =>
            fetch(zoomOauthApiUrl, {
                method: 'POST',
                headers: {
                    Authorization: zoomAuthHeader,
                },
                ...(scope ? { body: JSON.stringify({ scope: [scope] }) } : {}),
            }),
        3,
        1000
    );
    const data = await response.json();

    if (data.access_token) {
        accessToken = data.access_token;
        setTimeout(() => (accessToken = null), data.expires_in * 1000);
    }

    return { access_token: data.access_token };
};

export { getAccessToken };
