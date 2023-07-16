# LernFair Backend

- [GraphQL Guidelines](graphql/README.md)
- [The Notification System](common/notification/README.md)
- [Writing Integration Tests](integration-tests/WRITING_TESTS.md)

The backend exposes various APIs to other services and runs various background jobs on top of a PostgreSQL database. 
It is deployed in two Heroku Dynos, one answering API requests and one running jobs. 

```
                                       +-[ Backend Web Dyno ]-----------------------------------------------------------+
web-user-app      ----[ REST    ]----> | (Express) /web/controllers                                                     |
                                       |                                                  (TypeORM) /common/entity/*    |
backend-screening ----[ REST    ]----> | (Express) /web/controllers/screeningController   (Prisma)  /prisma/*           | ----- SQL ----> PostgreSQL 
                                       |                                                                                |
   ReTool         ----[ GraphQL ]----> | (Apollo)  /graphql                             (Mailjet) /common/mails/*       | ----- REST ----> Mailjet        
                                       |                                                (Mailjet) /common/notification/*|
                                       +-[ Backend Job Dyno ]--------------------                                       +
                                       |  /jobs                                                                         |
                                       +--------------------------------------------------------------------------------+
```

### Build & Run

To run the backend, compile it first using `npm run build`. Make sure to have all dependencies installed before building by using `npm ci`. 
You also need to set your environment accordingly (for further details see [.env.example](.env.example)) and set up a local PostgreSQL database server.
To set up the database, create a database and user and set the `DATABASE_URL` in your .env file.
Then run `npm run db:reset` to apply the Prisma Schema to the Database. You can additionally use `npm run db:seed` to fill the database with some test content.

To run the development configuration of the web server handling the API requests run `npm run web:dev`.
The development version of the jobs can be run using `npm run jobs:dev`.

The `/assets` folder contains development versions of various files. During Heroku builds, the folder is replaced by a secret version that is maintained in a [separate private repository](https://github.com/corona-school/coronaschool-certificate). The commit id of the version pulled is 
stored in `.certificate-version`. 

#### Configuration

The following configuration can be done via ENV variables:

| Name            | Value            | Description                                                                    |
|-----------------|------------------|--------------------------------------------------------------------------------|
| LOG_FORMAT      | (unset)          | Every log prefixed by session and transaction id, also log HTTP requests       |
|                 | json             | Log as JSON, used in deployed environemnts to pass rich info to Datadog        |
|                 | brief            | Only log category and message (omitting session prefix and HTTP requests)      |


#### Command line arguments

The following command line arguments are available (i.e. run `npm run web -- --debug`):

| Argument | Description                                                                        |
|----------|------------------------------------------------------------------------------------|
| \--debug | Sets the log level to debug which prints out tons of information                   |

### Changes to the Data-Model

We use the [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema) to describe our data model.
When changing the data model, we have potentially differing states:
- The *schema* as described in `prisma.schema`, this is the one we modify manually
- The *migrations* found in /prisma/migrations, these are used to setup local / test databases with `npm run db:reset` and migrate the productive database
- The state in the *local database*
- The state in the *productive database*
- The state in the *local typescript types* derived from Prisma, which we use to validate the backend code during build time
We usually want to keep them all in sync.

To start changing the data model, ensure that they all are in sync:
1. Check out a recent state of the master branch to fetch the latest schema and migrations
2. Run `npm run db:reset` to ensure the local database and typescript is in the state described by the migrations

Then modify `prisma.schema` to your needs. Afterwards run `npm run db:create-migration`, which shows the difference between the schema and the migrations, creates a new migration and rebuilds the local database and typescript based on that. Make sure to commit both the schema change and the migration in the same commit to simplify a potential revert. Now you can make further changes to the code till the feature is ready. When opening a pull request, a Github Action ensures that the migrations are in sync with the schema. When we merge the pull request to master and trigger a productive deployment, the migration will be run on the productive database, bringing all states back into sync. 



### Deployment

Apart from local environments, the backend is deployed in the following ways:
- Inside *Github Actions* we start the backend to run unit tests, integration tests and verify the Prisma Schema
- *Review Apps* are created for each Pull Request, where the database is seeded with test content, external connections (Mailjet etc.) are disabled by default
- The *Staging Environment* is automatically deployed from pushes to master, where the database is seeded with test content, some external connections are enabled to end-to-end test features
- The *Productive Environment* is manually promoted from the staging environment, database migrations are applied on promotions


### Contributing

We're always happy and open about contributions, please  [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our 
 team of volunteers. 
### Security Issues

We follow the guidelines for responsible disclosure:
If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it.
We take security very seriously and these issues are automatically highest priority for us.

Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program.
Currently we can only offer you to be mentioned in our contributor list and the feeling to have successfully supported a non-profit open-source project.

