import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as bodyParser from "body-parser";
import * as hpp from "hpp";
import * as helmet from "helmet";
import * as userController from "./controllers/userController";
import * as tokenController from "./controllers/tokenController";
import * as matchController from "./controllers/matchController";
import * as screeningController from "./controllers/screeningController";
import { configure, getLogger, connectLogger } from "log4js";
import { createConnection } from "typeorm";
import {
    authCheck,
    screenerAuthCheck,
    basicTokenCheck,
} from "./middleware/auth";
import { setupDevDB } from "./dev";

// Logger setup
try {
    configure("web/logconfig.json");
} catch (e) {
    console.warn("Couldn't setup logger", e);
}

const logger = getLogger();
const accessLogger = getLogger("access");

logger.info("Webserver backend started");
const app = express();

//allow CORS in dev to simplify frontend development
if (process.env.NODE_ENV == "dev") {
    var cors = require("cors");
    app.use(cors());
}

// Database connection
createConnection().then(() => {
    logger.info("Database connected");
    app.use(connectLogger(accessLogger, { level: "auto" }));

    // Express setup

    app.use(bodyParser.json());

    addSecurityMiddleWare();

    configureBasicAPI();
    configureUserAPI();
    configureTokenAPI();
    configureScreenerAPI();
    deployServer();

    function addSecurityMiddleWare() {
        app.use(hpp());
        app.use(helmet());
    }

    function configureBasicAPI() {
        const apiRouter = express.Router();
        apiRouter.get("/", authCheck, (req, res) => {
            // This route is only available with a valid user.
            res.send(
                "Logged in: " +
                    res.locals.user +
                    " (type: " +
                    res.locals.userType +
                    ")"
            );
        });
        app.use("/api", apiRouter);
    }

    function configureUserAPI() {
        const userApiRouter = express.Router();
        userApiRouter.use(basicTokenCheck, authCheck);
        userApiRouter.get("/", userController.getSelfHandler);
        userApiRouter.get("/:id", userController.getHandler);
        userApiRouter.put("/:id", userController.putHandler);
        userApiRouter.put("/:id/subjects", userController.putSubjectsHandler);
        userApiRouter.put(
            "/:id/active/:active",
            userController.putActiveHandler
        );
        userApiRouter.delete(
            "/:id/matches/:uuid",
            matchController.deleteHandler
        );
        app.use("/api/user", userApiRouter);
    }

    function configureTokenAPI() {
        const tokenApiRouter = express.Router();
        tokenApiRouter.post("/", tokenController.verifyTokenHandler);
        tokenApiRouter.get("/", tokenController.getNewTokenHandler);
        app.use("/api/token", tokenApiRouter);
    }

    function configureScreenerAPI() {
        const screenerApiRouter = express.Router();
        screenerApiRouter.use(basicTokenCheck, screenerAuthCheck);
        screenerApiRouter.get("/student", screeningController.getStudents);
        screenerApiRouter.get(
            "/student/:email",
            screeningController.getStudentByMailHandler
        );
        screenerApiRouter.put(
            "/student/:email",
            screeningController.updateStudentWithScreeningResultHandler
        );
        screenerApiRouter.get(
            "/screener/:email/:includepassword",
            screeningController.getScreenerByMailHandler
        );
        screenerApiRouter.post(
            "/screener/",
            screeningController.addScreenerHandler
        );
        screenerApiRouter.put(
            "/screener/:email",
            screeningController.updateScreenerByMailHandler
        );
        app.use("/api/screening", screenerApiRouter);
        app.use("/api", screenerApiRouter);
    }


    function deployServer() {
        if (process.env.NODE_ENV == "dev") {
            setupDevDB().then(() => {
                // Start listening
                http.createServer(app).listen(5000, () =>
                    logger.info("DEV server listening on port 5000")
                );
            });
        } else {
            // Let's encrypt
            const options = {
                key: fs.readFileSync(
                    "/etc/letsencrypt/live/dashboard.corona-school.de/privkey.pem"
                ),
                cert: fs.readFileSync(
                    "/etc/letsencrypt/live/dashboard.corona-school.de/cert.pem"
                ),
                ca: fs.readFileSync(
                    "/etc/letsencrypt/live/dashboard.corona-school.de/chain.pem"
                ),
            };

            // Start listening
            https.createServer(options, app).listen(443);

            // Redirect on port 80 server
            http.createServer(function (req, res) {
                res.writeHead(301, {
                    Location: "https://" + req.headers["host"] + req.url,
                });
                res.end();
            }).listen(80);
        }
    }
});
