# Writing Integration Tests

**Goal** of these integration tests is to ensure that no change breaks an important feature, while keeping manual work for writing tests low.

**Non Goals** of the tests is to cover each and every feature and ensure that nothing breaks, also we do not want to reach full coverage / test-driven development. We simply don't have capacity for that.


To write a new integration test, add a new Typescript file to `/integration-tests` and import it from `index.ts`.
A test consists of the following parts:
- the `test` function gives the test a name and handles errors
- with the clients `defaultClient` (unauthenticated user), `adminClient` and `createUserClient` one can send requests to GraphQL via the `.request` and `.requestShallFail`
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