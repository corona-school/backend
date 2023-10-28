import assert from 'assert';
import dotenv from 'dotenv';
import { assureZoomFeatureActive, isZoomFeatureActive } from './util';
import { getLogger } from '../logger/logger';
import zoomRetry from './retry';

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

const accessTokenPerScope = new Map<string, string>();

let currentFetch: Promise<any> = Promise.resolve();
function getAccessToken(scope?: string) {
    // This synchronizes all access token fetches to be sequential,
    // so that we only fetch an access token once, and then potentially reuse it
    return (currentFetch = currentFetch
        .catch(() => {
            /* ignore */
        })
        .then(() => fetchAccessToken(scope)));
}

const fetchAccessToken = async (scope?: string) => {
    assureZoomFeatureActive();

    const cachedToken = accessTokenPerScope.get(scope ?? '');
    if (cachedToken) {
        logger.info(`Using cached access token for scope ${scope ?? '-'}`);
        return { access_token: cachedToken };
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

        if (!response.ok) {
            throw new Error(`Failed to get access token with ${response.status} ${await response.text()}`);
        }

        const data = await response.json();

        logger.debug('Got access token');
        logger.debug(`Response status: ${response.status}`);
        logger.debug(`Response status text: ${response.statusText}`);

        if (data.access_token && !scope) {
            logger.info('Caching access token');
            accessTokenPerScope.set(scope ?? '', data.access_token);
            setTimeout(() => {
                accessTokenPerScope.delete(scope ?? '');
            }, data.expires_in * 1000);
        }

        return { access_token: data.access_token };
    } catch (error) {
        const message = 'Error while getting access token';
        logger.error(message, error);
        throw new Error(message);
    }
};

export { getAccessToken };
