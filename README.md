# Corona School Backend

### About

This is the repository containing the backend of the Corona School.
It has the following functionalities:
- Direct communication with the database
- REST API for the user dashboard and the screening tool
- Multiple jobs, that eg. import new users from Wix
- Multiple scripts handling eg. import and export for the matching algorithm

### Usage

If you want to run the backend you have to compile it first using `npm run build`.
You also need to set your environment accordingly (for further details see [.env.example](.env.example)) and set up a local database server.

#### Web server

To run the development configuration of the web server handling the API requests run
```
npm run web:dev
```

#### Docs

For building the API Docs you need [apidoc](https://apidocjs.com/) in your PATH. 
If you use the reference from the development dependencies, you will probably have to add `node_modules/.bin` manually to your PATH. 
If you don't mind you can also install it globally using `npm install -g apidoc`.
The build process is initiated using
```
npm run web:docs
```
and outputs the static html to `web/public/docs`. 
You can either open the `index.html` manually or start the web server for serving.

#### Jobs

The development version of the jobs can be run using
```
npm run jobs:dev
```

### Contributing

We're always happy and open about contributions.
You will find further information on how to contribute in the following paragraphs.

#### What can be contributed?

##### Issues

While we are always happy about the contribution of issues, but our own roadmap doesn't allow us too much room to tackle requests for new features.

##### Code

If you want to contribute code containing fixes or new features, feel free to send us a pull request AFTER reading the information below.

##### Security Issues

We follow the guidelines for responsible disclosure:
If you find a vulnerability, we would encourage you inform us and gives us some time to tackle the issues, before publishing it.
We take security very seriously and these issues are automatically highest priority for us.

Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program.
Currently we can only offer you to be mentioned in our contributor list and the feeling to have successfully supported a non-profit open-source project.

#### Who can contribute?

We're open to contributions from everybody, however we currently will only accept code from our development team.
This means you will have to join us (message us for further information) to gain access.
Under special circumstances we might also accept pull requests from external developers.

#### What do you need to take care of?

We have some coding style guidelines you will need to follow when contributing.
1. Preserve existing coding style. If your IDE reformats the whole file, commits will be extremely hard to review and will break existing formatting.
2. Follow the general coding style. This includes
  - 4 spaces as indentation
  - camelCase for functions and PascalCase for classes
  - Semicolon at the end of statements
  - No trailing comma in objects, imports etc.
  - Preserve single and double quotes
  - Use space (eg. in form of newlines), where it helps with readability, but don't overdo it
3. Make your code readable. This includes
  - Use self-explaining function names
  - Use self-explaining variable names
  - Comment your code where necessary. No one needs comments for trivial things. However if you have a clever idea, write it down, so others can see how intelligent you are.


