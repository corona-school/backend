import { randomBytes } from "crypto";
import { GraphQLClient } from "graphql-request";

const APP = "corona-school-backend-dev";
const URL = process.env.INTEGRATION_TARGET ?? `https://${APP}.herokuapp.com/apollo`;
const ADMIN_TOKEN = "ADMIN_TOKEN";

const silent = process.env.INTEGRATION_SILENT === "true";

const blue = (msg: string) => '\u001b[94m' + msg + '\u001b[39m';
const red = (msg: string) => '\u001b[31m' + msg + '\u001b[39m';
const green = (msg: string) => '\u001b[32m' + msg + '\u001b[39m';

function wrapClient(client: GraphQLClient) {
    async function request(query: string) {
        const name = query.match(/(mutation|query) [A-Za-z]+/) ?? "(unnamed)";
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
        const name = query.match(/(mutation|query) [A-Za-z]+/) ?? "(unnamed)";
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

const tests: { name: string, runner: () => Promise<any>, resolve: (value: any) => void, reject: (error: Error) => void }[] = [];

export function test<T>(name: string, runner: () => Promise<T>): Promise<T> {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    tests.push({ name, runner, resolve, reject });

    return promise as Promise<T>;
}

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
    process.exit(1);
}

