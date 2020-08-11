# Guide for writing automated tests
### Overview
1. [Technology](#technology)
2. [Structure](#test-structure)
3. [Unit tests](#unit-tests)
4. [Integration tests](#integration-tests)
    1. [Testing the API endpoints](#testing-api-endpoints)
    2. [Using the test database](#using-the-test-database)
5. [Running the tests](#running-the-tests)

### Technology
Testing frameworks and their uses:
- Tests: [Mocha](https://mochajs.org/)
- Assertions: [Chai](https://www.chaijs.com/)
- Creating mocks, spies and stubs: [Sinon](https://sinonjs.org/)

All these frameworks are well documented.
A guide on writing mocha tests can be found on the [getting started](https://mochajs.org/#getting-started) section.

### Test structure
All tests are placed in the "tests" folder and have the file ending `.test.ts`.
This folder is split into unit and integration tests.
Within the unit test folder the original project structure is mirrored.

This means, when creating a test for the file `common/mails/screening/index.ts`,
the test file has to be named `tests/unit/common/mails/screening/screening.test.ts`.

These rules do not apply for integration tests since they often access several files in different directories.
Integration tests are placed in the `tests/integration` folder.
The file ending of integration tests is `.int.test.ts`.

### Unit tests
Unit tests are testing one function only.
It is important to stub or mock all functions that are called within the function that is tested.
To do this, the [sinon framework](https://sinonjs.org/) is used.

When writing unit tests, make sure to cover as many branches as possible.
This can be done by writing a new test for each input variation of a function.

### Integration tests
Integration tests are testing a set feature which can include several functions, files and even database interactions.
It is often required to mock test data. This is done within the `beforeEach` function of a test module.
An example for an integration test is testing an API endpoint by giving it the required parameters and checking if the result is correct.

#### Testing API endpoints
Coming soon.

#### Using the test database
To be able to write tests which use the test database, a local installation of the Postgres database is required.
The database credentials can be found in the `tests/ormconfig.test.js` file.
To get access to the test database within a mocha test, following setup is required:
```ts
import {Connection} from "typeorm";
import databaseHelper from "./tests/utils/databaseHelper";

describe("some test module which requires the test database", function() {
    let connection: Connection;

    //The before function is executed once before the first test starts
    before(() => {
        return databaseHelper.createConnection().then(response => {
            connection = response;
        });
    });

    //The after function is executed once the last test was finished
    after(() => {
        return databaseHelper.closeConnection(connection);
    });
    
    it("uses the database within a test", function() {
        //Here the connection object can be used to interact with the database.
    });
});
```

A guide on using the connection object can be found in the [typeorm documentation](https://typeorm.io/).

### Running the tests
Only tests which are located within the `/tests` directory and have the file ending `.test.ts` are executed.
All these tests are automatically executed using Github Actions when pushing to a remote branch.
The tests can also be executed locally using `npm run test`.
