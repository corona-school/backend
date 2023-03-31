# Writing Integration Tests

**Goal** of these integration tests is to ensure that no change breaks an important feature, while keeping manual work for writing tests low.

**Non Goals** of the tests is to cover each and every feature and ensure that nothing breaks, also we do not want to reach full coverage / test-driven development. We simply don't have capacity for that.

To run integration tests locally, ensure that the environment variables `ADMIN_AUTH_TOKEN` and `INTEGRATION_TARGET` are set correctly in your `.env` (i.e. take them over from `.env.example`) and `SKIP_NOTIFICATION_IMPORT` is also set. Then start the Backend with `npm run web:nopdf` and run the integration tests with `npm run integration-tests:local`, or copy and paste these into a shell:
```
SKIP_NOTIFICATION_IMPORT=true ADMIN_AUTH_TOKEN=admin npm run web
NTEGRATION_TARGET=http://localhost:5000/apollo ADMIN_AUTH_TOKEN=admin npm run integration-tests
```

To write a new integration test, add a new Typescript file to `/integration-tests` and import it from `index.ts`.
A test consists of the following parts:
- the `test` function gives the test a name and handles errors
- with the clients `defaultClient` (unauthenticated user), `adminClient` and the clients created with `createUserClient` one can send requests to GraphQL via the `.request` and `.requestShallFail` methods
- For validation the [`assert`](https://nodejs.org/api/assert.html) module of NodeJS is used

The result when look like this:

```ts
test("Example Test", async () => {
    const client = createUserClient();
    
    const response = await client.request(`query { ... }`);
    assert.assertEqual(response.value, "expected");
});
```

Tests can also build up on results of previous tests, i.e. one can use the account registered in the registration test in the login test:

```ts
const accountTest = test("RegisterPupil", async () => {
    // ...
    return account;
});

test("LoginPupil", async () => {
    const account = await accountTest;
    // ...
});
```