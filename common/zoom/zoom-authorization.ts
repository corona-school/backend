import assert from 'assert';
import dotenv from 'dotenv';
import { assureZoomFeatureActive, isZoomFeatureActive } from '.';
import { getLogger } from '../../common/logger/logger';
import zoomRetry from './zoom-retry';

const logger = getLogger('Zoom Authorization');

dotenv.config();

const apiKey = process.env.ZOOM_API_KEY;
const apiSecret = process.env.ZOOM_API_SECRET;
const grantType = 'account_credentials';
const accountId = process.env.ZOOM_ACCOUNT_ID;

if (isZoomFeatureActive()) {
    assert(apiKey, 'Missing ZOOM_API_KEY in ENV');
    assert(apiSecret, 'Missing ZOOM_API_SECRET in ENV');
    assert(accountId, 'Missing ZOOM_ACCOUNT_ID in ENV');
}

let accessToken: string | null = null;

const getAccessToken = async (scope?: string) => {
    assureZoomFeatureActive();

    if (accessToken && !scope) {
        logger.debug('Using cached access token');
        return { access_token: accessToken };
    }
    try {
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

        logger.debug('Got access token');
        logger.debug(`Response status: ${response.status}`);
        logger.debug(`Response status text: ${await response.text()}}`);

        if (data.access_token && !scope) {
            logger.info('Caching access token');
            accessToken = data.access_token;
            setTimeout(() => (accessToken = null), data.expires_in * 1000);
        }

        return { access_token: data.access_token };
    } catch (error) {
        const message = 'Error while getting access token';
        logger.error(message, error);
        throw new Error(message);
    }
};

export { getAccessToken };
