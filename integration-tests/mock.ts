import assert from "assert";
import { red } from "./base";

interface MockedFetch {
    url: string;
    body: string;
    responseStatus: number;
    response: string;
}

// A FIFO queue of mocked calls, thus expectFetch(...) must be called in order
const expectedCalls: MockedFetch[] = [];

export function expectFetch(mocked: MockedFetch) {
    expectedCalls.push(mocked);
}

export function setupFetchMock() {
    const originalFetch = global.fetch;

    async function mockedFetch(resource: RequestInfo, options: RequestInit) {
        const url = "" + resource;
        if (expectedCalls.length > 0 && expectedCalls[0].url === url) {
            const expectedCall = expectedCalls.shift();
            assert.strictEqual(options.body, expectedCall.body, `Wrong Body of request to ${url}`);
            console.log(`Request to ${url} mocked`);
            return new Response(expectedCall.response, { status: expectedCall.responseStatus });
        }

        console.log(red(`Request to ${url} not mocked! The integration tests must be self containing `));
        process.exit(1);

        // return originalFetch(resource, options);
    }

    global.fetch = mockedFetch;
}

setupFetchMock();