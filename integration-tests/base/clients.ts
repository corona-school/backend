import { randomBytes } from 'crypto';
import { GraphQLClient } from 'graphql-request';

import { getLogger } from '../../common/logger/logger';

export const logger = getLogger('TEST');

/* -------------- Configuration ------------------- */

const ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN;
const silent = process.env.INTEGRATION_SILENT === 'true';
const URL = process.env.INTEGRATION_TARGET ?? `http://localhost:${process.env.PORT ?? 5000}/apollo`;

/* -------------- Utils --------------------------- */

logger.mark(`Backend Integration Tests\n` + ` testing ${URL}\n\n`);

/* -------------- GraphQL Client Wrapper ------------------ */

// This wrapper provides assertions and logging around a GraphQLClient of the graphql-request package
function wrapClient(client: GraphQLClient) {
    async function request(query: string, variables: object = {}) {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? '(unnamed)';
        logger.mark(`+ ${name}`);
        if (!silent) {
            logger.info(`request: ` + query.trim());
        }
        const response = await client.request(query, variables);
        if (!silent) {
            logger.info(`response: ` + JSON.stringify(response, null, 2));
        }
        return response;
    }

    async function requestShallFail(query: string, variables: object = {}): Promise<never> {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? '(unnamed)';
        logger.mark(`+ ${name}`);

        if (!silent) {
            logger.info(`  request (should fail):` + query.trim());
        }

        try {
            await client.request(query, variables);
        } catch (error) {
            if (!silent) {
                logger.info(`  successfully failed with ${error.message.split(':')[0]}`);
            }
            return;
        }

        throw new Error(`Request shall fail`);
    }

    return { request, requestShallFail };
}

/* ----------------- Clients --------------------
  There are different clients for running GraphQL requests:
   - defaultClient performs unauthenticated requests
   - adminClient performs requests with the Role ADMIN (using Basic auth)
   - createUserClient can be used to create a session with a Bearer token
     Using a mutation { login...() } one can then associate a user with the session
     (see auth.ts for examples)
*/
export const defaultClient = wrapClient(new GraphQLClient(URL));

const adminAuthorization = `Basic ${Buffer.from('admin:' + ADMIN_TOKEN).toString('base64')}`;

export const adminClient = wrapClient(
    new GraphQLClient(URL, {
        headers: {
            authorization: adminAuthorization,
        },
    })
);

export function createUserClient() {
    return wrapClient(
        new GraphQLClient(URL, {
            headers: {
                authorization: `Bearer ${randomBytes(36).toString('base64')}`,
            },
        })
    );
}
