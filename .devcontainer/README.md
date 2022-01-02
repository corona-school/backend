# Docker Setup

## Requirements

Before the setup make sure that you have the following things ready:

- Docker installed (download it [here](https://www.docker.com/products/docker-desktop))
- “Remote - Containers” Visual Studio Code extension installed (find it [here](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers))
- GitHub Repository cloned

## Setup

<aside>
☝🏼 This setup is **only** for local development!

</aside>

1. Create a `.env` file in the root directory, which includes at least the database URL and the node environment.
    
    ```
    # Run webserver in dev mode on port 5000 (http only)
    ENV=dev
    
    # PostgreSQL database url: postgres://<user>:<pass>@<host>:<port>/(<database>)
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/coronaschool-dev
    ```
    
2. Open the *command palette* in vs code (under *view,* *command + shift + p* or *ctrl + shift + p*).
3. Enter in the *command palette* “>reopen in Container” and select the command which is offered by the Remote - Containers extension. This may take a moment but should install all dependencies. If the *node_modules* are not installed after this, run `npm ci` once.
4. Test if everything works. To do this, open a terminal in vs code and enter the following commands:
    - `npm run build` this should simply build the project and converts all the typescript files into javascript files.
    - `npm test` this runs all the tests.
    - `npm run web:dev` this starts the development server, which runs on [localhost:5000](http://localhost:5000)

## Troubleshooting

- `npm run web:dev` Throws an error. If you are using a Mac with MacOS version Monterey (12.x.x) or later, port 5000 is blocked by default by another application. There are two solutions for this:
    1. Change the port on which the server is running.
    2. Stop the program that is blocking the port (AirPlay Receiver).
        1. Open system settings
        2. Go to *sharing*
        3. Deactivate *AirPlay Receiver* in the left-hand column