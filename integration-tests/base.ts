import { randomBytes } from "crypto";
import { GraphQLClient } from "graphql-request";

/* -------------- Configuration ------------------- */

const APP = "corona-school-backend-dev";
const URL = process.env.INTEGRATION_TARGET ?? `https://${APP}.herokuapp.com/apollo`;
const ADMIN_TOKEN = "ADMIN_TOKEN";

const silent = process.env.INTEGRATION_SILENT === "true";

/* -------------- Utils --------------------------- */

const blue = (msg: string) => '\u001b[94m' + msg + '\u001b[39m';
const red = (msg: string) => '\u001b[31m' + msg + '\u001b[39m';
const green = (msg: string) => '\u001b[32m' + msg + '\u001b[39m';

/* -------------- GraphQL Client Wrapper ------------------ */

// This wrapper provides assertions and logging around a GraphQLClient of the graphql-request package
function wrapClient(client: GraphQLClient) {
    async function request(query: string) {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? "(unnamed)";
        console.log(blue(`+ ${name}`));
        if (!silent) {
            console.log(`   request:`, query.trim());
        }
        const response = await client.request(query);
        if (!silent) {
            console.log(`   response:`, response);
        }
        return response;
    }

    async function requestShallFail(query: string): Promise<never> {
        const name = query.match(/(mutation|query) [A-Za-z]+/)?.[0] ?? "(unnamed)";
        console.log(blue(`+ ${name}`));

        if (!silent) {
            console.log(`  request (should fail):`, query.trim());
        }

        try {
            await client.request(query);
        } catch (error) {
            if (!silent) {
                console.log(`  successfully failed with ${error.message.split(":")[0]}`);
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

export const adminClient = wrapClient(new GraphQLClient(URL, {
    headers: {
        authorization: `Basic ${Buffer.from("admin:" + ADMIN_TOKEN).toString("base64")}`
    }
}));

export function createUserClient() {
    return wrapClient(new GraphQLClient(URL, {
        headers: {
            authorization: `Bearer ${randomBytes(36).toString("base64")}`
        }
    }));
}

/* -------------- Test Runner ------------------- */
const tests: { name: string, runner: () => Promise<any>, resolve: (value: any) => void, reject: (error: Error) => void }[] = [];

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
export function test<T>(name: string, runner: () => Promise<T>): Promise<T> {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    tests.push({ name, runner, resolve, reject });

    return promise as Promise<T>;
}

// This one actually runs all tests that were defined
export async function finalizeTests() {
    const startAll = Date.now();
    let failureCount = 0;
    for (const test of tests) {
        console.log(`test ${test.name}:`);
        try {
            const start = Date.now();
            const result = await test.runner();
            const duration = Date.now() - start;
            console.log(green(`= SUCCESS in ${duration}ms\n`));
            test.resolve(result);
        } catch (error) {
            console.log('\n\n', error, '\n\n');
            console.log(red(`= FAILURE\n`));
            failureCount += 1;
            test.reject(new Error(`Dependency ${test.name} failed`));
        }
    }

    console.log(`\n\nsummary:`);

    const durationAll = Date.now() - startAll;

    if (failureCount === 0) {
        console.log(green(`  all tests SUCCEEDED in ${durationAll}ms`));
        return;
    }

    console.error(red(`  ${failureCount} tests FAILED`));

    process.exit(1); // A non-zero return code indicates a failure to the pipeline
}

