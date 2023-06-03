import assert from "assert";
import { blue, red } from "./base";
import wcmatch from "wildcard-match";

interface MockedFetch {
    method: "GET" | "POST" | "PUT" | "PATCH";
    url: string; // use some/path/* as a wildcard
    body?: string; // Use * as a wildcard
    responseStatus: number;
    response?: string | object;
}

let expectedCalls: MockedFetch[] = [];

export function expectFetch(mocked: MockedFetch) {
    expectedCalls.push(mocked);
}

export function setupFetchMock() {
    const originalFetch = global.fetch;

    async function mockedFetch(resource: RequestInfo, options: RequestInit) {
        const url = "" + resource;

        const mock = expectedCalls.find(it => (it.url === url || wcmatch(it.url)(url)) && it.method === (options.method ?? "GET"));

        if (mock) {
            expectedCalls = expectedCalls.filter(it => it !== mock);
            if (mock.body && !wcmatch(mock.body)(options.body.toString())) {
                // We are inside of the Webserver, throwing an error might raise weird exceptions in the end
                console.log(red(`Wrong body of mocked call to ${mock.method} ${mock.url}:`));
                console.log(`expected: ${mock.body}`);
                console.log(`actual:   ${options.body}`);
                process.exit(1);
            }

            console.log(`Request to ${url} mocked`);
            return new Response(mock.response ? (typeof mock.response === "string" ? mock.response : JSON.stringify(mock.response)) : "mocked response", { status: mock.responseStatus });
        }

        console.log(red(`Request to ${url} not mocked! The integration tests must be self containing. Mock with:\n`));
        console.log(blue(`expectFetch(${JSON.stringify({ url, method: options.method, body: options.body, responseStatus: 200, response: "?" }, null, 2)})`));
        process.exit(1);

        // return originalFetch(resource, options);
    }

    global.fetch = mockedFetch;
}

setupFetchMock();