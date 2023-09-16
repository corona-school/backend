import { randomBytes } from 'crypto';
import { GraphQLClient } from 'graphql-request';

import './mock';

import * as WebServer from '../../web';
// eslint-disable-next-line import/no-cycle
import { clearFetchMocks, expectNoFetchMockLeft } from './mock';
import { cleanupMockedNotifications } from './notifications';
import { getLogger } from '../../common/logger/logger';

export const logger = getLogger("TEST");

/* -------------- Configuration ------------------- */

const APP = 'lernfair-backend-dev';
const URL = process.env.INTEGRATION_TARGET ?? `http://localhost:${process.env.PORT ?? 5000}/apollo`;
const ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN;

const silent = process.env.INTEGRATION_SILENT === 'true';

/* -------------- Utils --------------------------- */

logger.mark(`Backend Integration Tests\n` + ` testing ${URL}\n\n`);

/* -------------- GraphQL Client Wrapper ------------------ */

// This wrapper provides assertions and logging around a GraphQLClient of the graphql-request package
function wrapClient(client: GraphQLClient) {
    async function request(query: string) {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? '(unnamed)';
        logger.mark(`+ ${name}`);
        if (!silent) {
            logger.info(`request: ` + query.trim());
        }
        const response = await client.request(query);
        if (!silent) {
            logger.info(`response: ` + JSON.stringify(response, null, 2));
        }
        return response;
    }

    async function requestShallFail(query: string): Promise<never> {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? '(unnamed)';
        logger.mark(`+ ${name}`);

        if (!silent) {
            logger.info(`  request (should fail):` + query.trim());
        }

        try {
            await client.request(query);
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

/* -------------- Test Runner ------------------- */
const tests: { name: string; runner: () => Promise<any>; resolve: (value: any) => void; reject: (error: Error) => void }[] = [];

/* test(...) has the following guarantees:
   - Runners are executed in order of definition
   - Runners are always run sequentially (at least for now)
   - throwing any error results in FAILURE state

   To use something from within a test (e.g. a user client) in another test, it can be returned:
   const exposureTest = test("exposure", { ... return { exposed }; });
   Then other tests can use it with
   const { exposed } = await exposureTest;
   To avoid deadlocks, tests exposing something should be defined first (c.f. index.ts)
*/
export function test<T>(name: string, runner: () => Promise<T>): PromiseLike<T> {
    let result: Promise<T> | null = null;

    tests.push({
        name,
        runner,
        resolve: (it) => {
            result = Promise.resolve(it);
        },
        reject: (error) => {
            result = Promise.reject(error);
            // Prevent unhandled rejections:
            result.catch(() => {});
        }
    });

    return {
        // Whenever a tests awaits a previous test, this implicitly calls then(...) on this Thenable
        // At that point we can detect cycles, or chain the promise exposed by the test
        then(onfulfilled, onrejected) {
            if (result === null) {
                throw new Error(`Tests depends on test ${name} which did not run yet! This creates a deadlock. Tests must be ordered sequentially`);
            }

            return result.then(onfulfilled, onrejected);
        },
    };
}

// This one actually runs all tests that were defined
export async function finalizeTests() {
    logger.headline('SETUP');

    await WebServer.started;

    logger.headline('TESTING');

    const startAll = Date.now();
    let failedTests: string[] = [];
    for (const test of tests) {
        logger.headline(`TEST ${test.name}`);
        try {
            const start = Date.now();
            const result = await test.runner();
            const duration = Date.now() - start;
            logger.success(`= SUCCESS in ${duration}ms\n\n\n`);
            test.resolve(result);
            expectNoFetchMockLeft();
        } catch (error) {
            logger.failure(error.message, error);
            logger.failure(`= FAILURE\n\n\n`);
            failedTests.push(test.name);
            test.reject(new Error(`Dependency ${test.name} failed`));
            clearFetchMocks();
        }
    }

    const durationAll = Date.now() - startAll;

    logger.headline('TEARDOWN');
    await cleanupMockedNotifications();
    await WebServer.shutdown();
    logger.mark(`Regular shut down done, stop pending tasks by aborting process\n\n\n`);

    if (failedTests.length === 0) {
        logger.success(`All tests SUCCEEDED in ${durationAll}ms`);
        process.exit(0);
        return;
    }

    logger.failure(`${failedTests.length} tests FAILED:\n${failedTests.map(it => "  - " + it).join('\n')}\n\n`);
    logger.success('To debug the tests, run "npm run integration-tests:debug" then have a look at integration-tests.log');
    process.exit(1); // A non-zero return code indicates a failure to the pipeline
}
