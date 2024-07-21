# Lern-Fair Backend

Daniel test

Basics:

-   [GraphQL Guidelines](graphql/README.md)
-   [Writing Integration Tests](integration-tests/WRITING_TESTS.md)

Components:

-   [Notification System (Mail & In-App)](common/notification/README.md)
-   [Appointments](common/appointment/README.md)
-   [Chat (TalkJS)](common/chat/README.md)
-   [Video Chat (Zoom)](common/zoom/README.md)

The backend exposes various APIs to other services and runs various background jobs on top of a PostgreSQL database.
It is deployed in two Heroku Dynos, one answering API requests and one running jobs.

```
                                  +-[ Backend Web Dyno ]--------------------------------------------------------+
web-user-app ----[ GraphQL ]----> | (Express) /web/controllers                                                  |
                                  |                             (Prisma)  /prisma/*                             | ----- SQL ----> PostgreSQL
                                  |                                                                             |
   ReTool    ----[ GraphQL ]----> | (Apollo)  /graphql          (Mailjet) /common/notification/channels/mailjet | ----- REST ----> Mailjet
                                  |                             (WebSocket) /common/notification/channels/inapp | ----- WebSocket ----> User App
                                  |                                                                             |
                                  |                             (TalkJS) /common/chat/*                         | ----- REST ----> TalkJS
                                  |                             (Zoom) /common/zoom/*                           | ----- REST ----> Zoom
                                  |                             (S3) /common/file-bucket/*                      | ----- REST ----> S3 Provider
                                  |                             (Datadog) /common/logger/*                      | ----- REST ----> Datadog
                                  +-[ Backend Job Dyno ]--------------------------------------------------------+
                                  |  /jobs                                                                      |
                                  +-----------------------------------------------------------------------------+
```

### Build & Run

To run the backend, compile it first using `npm run build`. Make sure to have all dependencies installed before building by using `npm ci`.
You also need to set your environment accordingly in the `.env` file (for further details see [.env.example](.env.example)) and set up a local PostgreSQL database server.

You can either use docker or setup the database locally.

#### Using Docker:

```bash
docker-compose up -d
```

The database and user will automatically setup with all needed permissions. You can use the following `DATABASE_URL` in your .env file:

```bash
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/lernfair_dev
```

Then run `npm run db:reset` to apply the Prisma Schema to the Database. You can additionally use `npm run db:seed` to fill the database with some test content.

#### Installed on host

To set up the database, create a database and user and set the `DATABASE_URL` in your .env file. Grant the user the rights to create databases:

```psql

CREATE USER lernfair_dev WITH PASSWORD 'lernfair_dev';
CREATE DATABASE lernfair_dev;
/* Allow Prisma to add tables to the database */
\connect lernfair_dev
GRANT ALL ON DATABASE lernfair_dev TO lernfair_dev;
GRANT ALL ON SCHEMA public TO lernfair_dev;
/* Prisma creates a 'shadow database' to detect schema drifts, thus it needs the permission to create new databases */
ALTER USER lernfair_dev CREATEDB;
```

Then run `npm run db:reset` to apply the Prisma Schema to the Database. You can additionally use `npm run db:seed` to fill the database with some test content.

#### Development

To run the development configuration of the web server handling the API requests run `npm run web:dev`.
The development version of the jobs can be run using `npm run jobs:dev`.

The backend has some very exotic dependencies (namely Chromium for rendering PDFs and our C++ Matching Algorithm) that require quite some effort to install on non-Linux environments. With `npm ci --omit=optional` one can skip installing these dependencies, then the Backend can be run with a limited feature set (no matching and no certificate rendering), also running the integration tests will fail. This should still be enough for the majority of development tasks though.

The `/assets` folder contains development versions of various files. During Heroku builds, the folder is replaced by a secret version that is maintained in a [separate private repository](https://github.com/corona-school/coronaschool-certificate). The commit id of the version pulled is
stored in `.certificate-version`.

#### Watcher & automatic restarts

For easier development, it is possible to run the web backend with automatic recompilations and restarts.
To do this, first follow the instructions in the Build & Run section above.

Afterward, start the backend in watch mode by executing `npm run web:watch`.
This will automatically recompile the TypeScript code after every change and restart the server after the compilation is complete.

Additionally, you can pass any other supported arguments.

#### Configuration

The following configuration can be done via ENV variables:

| Name       | Value   | Description                                                               |
| ---------- | ------- | ------------------------------------------------------------------------- |
| LOG_FORMAT | (unset) | Every log prefixed by session and transaction id, also log HTTP requests  |
|            | json    | Log as JSON, used in deployed environments to pass rich info to Datadog   |
|            | brief   | Only log category and message (omitting session prefix and HTTP requests) |

#### Command line arguments

The following command line arguments are available (i.e. run `npm run web -- --debug`):

| Argument | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| \--debug | Sets the log level to debug which prints out tons of information |

### Changes to the Data-Model

We use the [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema) to describe our data model.
When changing the data model, we have potentially differing states:

-   The _schema_ as described in `prisma.schema`, this is the one we modify manually and from which we setup local and staging databases
-   The _migrations_ found in /prisma/migrations, these are used to migrate the productive database
-   The state in the _local database_
-   The state in the _productive database_
-   The state in the _local typescript types_ derived from Prisma, which we use to validate the backend code during build time
    We usually want to keep them all in sync.

To start changing the data model, ensure that they all are in sync:

1. Check out a recent state of the master branch to fetch the latest schema and migrations
2. Run `npm run db:reset` to ensure the local database and typescript is in the state described by the migrations

Then modify `prisma.schema` to your needs. Afterwards run `npm run db:create-migration`, which shows the difference between the schema and the migrations, creates a new migration and rebuilds the local database and typescript based on that. Make sure to commit both the schema change and the migration in the same commit to simplify a potential revert. You probably also need to adapt `graphql/authorizations.ts` for the build to work again, as we enforce that all GraphQL entities have proper permissions assigned. Now you can make further changes to the code till the feature is ready. When opening a pull request, a Github Action ensures that the migrations are in sync with the schema. When we merge the pull request to master and trigger a productive deployment, the migration will be run on the productive database, bringing all states back into sync.

### Deployment

Apart from local environments, the backend is deployed in the following ways:

-   Inside _Github Actions_ we start the backend to run unit tests, integration tests and verify the Prisma Schema
-   _Review Apps_ are created for each Pull Request, where the database is seeded with test content, external connections (Mailjet etc.) are disabled by default
-   The _Staging Environment_ is automatically deployed from pushes to master, where the database is seeded with test content, some external connections are enabled to end-to-end test features
-   The _Productive Environment_ is manually promoted from the staging environment, database migrations are applied on promotions

### Contributing

We're always happy and open about contributions, please [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our
team of volunteers.

### Security Issues

We follow the guidelines for responsible disclosure:
If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it.
We take security very seriously and these issues are automatically highest priority for us.

Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program.
Currently we can only offer you to be mentioned in our contributor list and the feeling to have successfully supported a non-profit open-source project.
