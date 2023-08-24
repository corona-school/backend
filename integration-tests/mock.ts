import assert from 'assert';
import { blue, red } from './base';
import wcmatch from 'wildcard-match';

interface MockedFetch {
    // The fetch request:
    method: 'GET' | 'POST' | 'PUT' | 'PATCH';
    // Use * as a wildcard (or any other 'glob' pattern)
    url: string;
    // If the body is not set, it is not tested
    // Use * as a wildcard (or any other 'glob' pattern)
    body?: string;

    // The then returned response:
    responseStatus: number;
    // If an object is passed, the response is JSON
    response?: string | object;
}

// A FIFO queue of expected calls:
let expectedCalls: MockedFetch[] = [];

export function expectFetch(mocked: MockedFetch) {
    expectedCalls.push(mocked);
}

export function expectNoFetchMockLeft() {
    assert.strictEqual(expectedCalls.length, 0, 'Mocks were not reached');
}

export function setupFetchMock() {
    const originalFetch = global.fetch;

    // eslint-disable-next-line require-await
    async function mockedFetch(resource: RequestInfo, options: RequestInit) {
        const url = '' + resource;

        // We expect all mocks to be in order:
        const mock = expectedCalls.shift();

        const urlMatches = mock && (mock.url === url || wcmatch(mock.url)(url));

        if (!urlMatches) {
            console.log(red(`Request to ${url} not mocked (net mock is for ${mock?.url ?? '-'}). The integration tests must be self containing. Mock with:\n`));
            console.log(
                blue(`expectFetch(${JSON.stringify({ url, method: options.method, body: options.body, responseStatus: 200, response: '?' }, null, 2)})`)
            );
            process.exit(1);
        }

        const methodMatches = mock && mock.method === (options.method ?? 'GET');
        if (!methodMatches) {
            console.log(red(`Expected request to ${url} to be ${mock.method}, but it was ${options.method ?? 'GET'}`));
            process.exit(1);
        }

        const bodyMatches = !mock.body || wcmatch(mock.body)(options.body.toString());
        if (!bodyMatches) {
            // We are inside of the Webserver, throwing an error might raise weird exceptions in the end
            console.log(red(`Wrong body of mocked call to ${mock.method} ${mock.url}:`));
            console.log(`expected: ${mock.body}`);
            console.log(`actual:   ${options.body}`);
            process.exit(1);
        }

        console.log(`     request to ${mock.method} ${url} mocked`);
        return new Response(mock.response ? (typeof mock.response === 'string' ? mock.response : JSON.stringify(mock.response)) : 'mocked response', {
            status: mock.responseStatus,
        });
        // return originalFetch(resource, options);
    }

    global.fetch = mockedFetch;
}

setupFetchMock();
