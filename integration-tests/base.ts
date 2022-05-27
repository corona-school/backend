import { randomBytes } from "crypto";
import { GraphQLClient } from "graphql-request";

const APP = "corona-school-backend-dev";
const URL = `https://${APP}.herokuapp.com/apollo`;
const ADMIN_TOKEN = "ADMIN_TOKEN";

function wrapClient(client: GraphQLClient) {
    async function request(query: string) {
        console.log(`\nRequest:`, query.trim());
        const response = await client.request(query);
        console.log(`Response:`, response);
        return response;
    }

    async function requestShallFail(query: string): Promise<never> {
        console.log(`\nRequest (should fail):`, query.trim());
        try {
            await client.request(query);
            console.log(`But it succeeded?`);
        } catch (error) {
            console.log(`Successfully failed with ${error.message.split(":")[0]}`);
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
        console.log(`\n\n*-------------- Test ${test.name} --------------*`);
        try {
            const start = Date.now();
            const result = await test.runner();
            const duration = Date.now() - start;
            console.log(`SUCCESS in ${duration}ms`);
            test.resolve(result);
        } catch (error) {
            console.log(error);
            console.log(`FAILURE`);
            failureCount += 1;
            test.reject(new Error(`Dependency ${test.name} failed`));
        }
    }

    console.log(`\n\n*-------------- Summary --------------*`);

    const durationAll = Date.now() - startAll;

    if (failureCount === 0) {
        console.log(`ALL TESTS SUCCEEDED in ${durationAll}ms`);
        return;
    }

    console.error(`${failureCount} TESTS FAILED`);
    process.exit(1);
}

