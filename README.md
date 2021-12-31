# LernFair Backend

- [GraphQL Guidelines](graphql/README.md)
- [The Notification System](common/notification/README.md)
- [Guide for writing automated tests](TESTING_GUIDE.md)
- [How-to migrate db with TypeORM](common/migration/HOW-TO-MIGRATE-README.md)
- [Administration stuff / business logic](common/administration/README.md)

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
You also need to set your environment accordingly (for further details see [.env.example](.env.example)) and set up a local database server.

To run the development configuration of the web server handling the API requests run `npm run web:dev`.
The development version of the jobs can be run using `npm run jobs:dev`.

The `/assets` folder contains development versions of various files. During Heroku builds, the folder is replaced by a secret version that is maintained in a [separate private repository](https://github.com/corona-school/coronaschool-certificate). The commit id of the version pulled is 
stored in `.certificate-version`. 


#### Command line arguments

The following command line arguments are available:

| Argument | Description                                                                        |
|----------|------------------------------------------------------------------------------------|
| \--noPDF | Skips Puppeteer and PDF initialization, which is handy for speeding up development |

### Docs

For building the API Docs you need [apidoc](https://apidocjs.com/) in your PATH. 
If you use the reference from the development dependencies, you will probably have to add `node_modules/.bin` manually to your PATH. 
If you don't mind you can also install it globally using `npm install -g apidoc`.
The build process is initiated using `npm run web:docs` and outputs the static html to `web/public/docs`. 
You can either open the `index.html` manually or start the web server for serving.

### Contributing

We're always happy and open about contributions, please  [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our 
 team of volunteers. 
### Security Issues

We follow the guidelines for responsible disclosure:
If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it.
We take security very seriously and these issues are automatically highest priority for us.

Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program.
Currently we can only offer you to be mentioned in our contributor list and the feeling to have successfully supported a non-profit open-source project.

