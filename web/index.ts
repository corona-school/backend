import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as bodyParser from "body-parser";
import * as hpp from "hpp";
import * as helmet from "helmet";
import * as cors from "cors";
import * as userController from "./controllers/userController";
import * as tokenController from "./controllers/tokenController";
import * as matchController from "./controllers/matchController";
import * as screeningController from "./controllers/screeningController";
import * as certificateController from "./controllers/certificateController";
import * as courseController from "./controllers/courseController";
import * as registrationController from "./controllers/registrationController";
import { configure, connectLogger, getLogger } from "log4js";
import { createConnection } from "typeorm";
import { screenerAuthCheck, authCheckFactory } from "./middleware/auth";
import { setupDevDB } from "./dev";
import * as tls from "tls";

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

// Database connection
createConnection().then(() => {
    logger.info("Database connected");
    app.use(connectLogger(accessLogger, { level: "auto" }));

    // Express setup
    app.use(bodyParser.json());

    addCorsMiddleware();
    addSecurityMiddleware();

    configureUserAPI();
    configureCertificateAPI();
    configureTokenAPI();
    configureCourseAPI();
    configureScreenerAPI();
    configureCoursesAPI();
    configureRegistrationAPI();
    deployServer();

    function addCorsMiddleware() {

        let origins;

        if (process.env.NODE_ENV == "dev") {
            origins = [
                "http://localhost:3000",
                "https://web-user-app-live.herokuapp.com",
                "https://web-user-app-dev.herokuapp.com"
            ];
        } else {
            origins = [
                "https://dashboard.corona-school.de",
                "https://my.corona-school.de"
            ];
        }

        const options = {
            "origin": origins,
            "methods": ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH"]
        };

        app.use(cors(options));
    }

    function addSecurityMiddleware() {
        app.use(hpp());
        app.use(helmet());
    }

    function configureUserAPI() {
        const userApiRouter = express.Router();
        userApiRouter.use(authCheckFactory());
        userApiRouter.get("/", userController.getSelfHandler);
        userApiRouter.get("/:id", userController.getHandler);
        userApiRouter.put("/:id", userController.putHandler);
        userApiRouter.put("/:id/subjects", userController.putSubjectsHandler);
        userApiRouter.put("/:id/active/:active", userController.putActiveHandler);
        userApiRouter.delete("/:id/matches/:uuid", matchController.deleteHandler);
        userApiRouter.post("/:id/role/instructor", userController.postUserRoleInstructorHandler);
        userApiRouter.post("/:id/role/tutor", userController.postUserRoleTutorHandler);
        app.use("/api/user", userApiRouter);
    }

    function configureTokenAPI() {
        const tokenApiRouter = express.Router();
        tokenApiRouter.post("/", tokenController.verifyTokenHandler);
        tokenApiRouter.get("/", tokenController.getNewTokenHandler);
        app.use("/api/token", tokenApiRouter);
    }

    function configureCertificateAPI() {
        const certificateRouter = express.Router();
        certificateRouter.use(authCheckFactory());
        certificateRouter.get("/:student/:pupil", certificateController.certificateHandler);
        app.use("/api/certificate", certificateRouter);
    }

    function configureCourseAPI() {
        const coursesRouter = express.Router();
        //public routes
        coursesRouter.use(authCheckFactory(true));
        coursesRouter.get("/:id", courseController.getCourseHandler);
        //private routes
        coursesRouter.use(authCheckFactory());
        coursesRouter.post("/", courseController.postCourseHandler);
        coursesRouter.put("/:id", courseController.putCourseHandler);
        coursesRouter.delete("/:id", courseController.deleteCourseHandler);

        coursesRouter.post("/:id/subcourse", courseController.postSubcourseHandler);
        coursesRouter.put("/:id/subcourse/:subid", courseController.putSubcourseHandler);
        coursesRouter.delete("/:id/subcourse/:subid", courseController.deleteSubcourseHandler);

        coursesRouter.post("/:id/subcourse/:subid/participants/:userid", courseController.joinSubcourseHandler);
        coursesRouter.delete("/:id/subcourse/:subid/participants/:userid", courseController.leaveSubcourseHandler);

        coursesRouter.post("/:id/subcourse/:subid/lecture", courseController.postLectureHandler);
        coursesRouter.post("/:id/subcourse/:subid/groupmail", courseController.groupMailHandler);
        coursesRouter.put("/:id/subcourse/:subid/lecture/:lecid", courseController.putLectureHandler);
        coursesRouter.delete("/:id/subcourse/:subid/lecture/:lecid", courseController.deleteLectureHandler);

        coursesRouter.get("/:id/meeting", courseController.getCourseMeetingHandler);
        coursesRouter.get("/:id/meeting/join", courseController.joinCourseMeetingHandler);

        app.use("/api/course", coursesRouter);
    }

    function configureCoursesAPI() {
        const coursesRouter = express.Router();
        coursesRouter.use(authCheckFactory(true));
        coursesRouter.get("/", courseController.getCoursesHandler);
        app.use("/api/courses", coursesRouter);
    }

    function configureRegistrationAPI() {
        const registrationRouter = express.Router();
        registrationRouter.post("/tutee", registrationController.postTuteeHandler);
        registrationRouter.post("/tutor", registrationController.postTutorHandler);
        app.use("/api/register", registrationRouter);
    }

    function configureScreenerAPI() {
        const screenerApiRouter = express.Router();
        screenerApiRouter.use(screenerAuthCheck);
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
        screenerApiRouter.get(
            "/courses",
            screeningController.getCourses
        );
        screenerApiRouter.post(
            "/course/:id/update",
            screeningController.updateCourse
        );
        screenerApiRouter.get(
            "/instructors",
            screeningController.getInstructors
        );
        screenerApiRouter.post(
            "/instructor/:id/update",
            screeningController.updateInstructor
        );

        app.use("/api/screening", screenerApiRouter);
    }

    function deployHTTPServer() {
        const staticFolder = process.env.STATIC_HTTP_FILE_PATH;

        const staticHTTPServer = express();

        staticHTTPServer.use( (req, res, next) => {
            const c = req.path.split("/").slice(0,3).join("/");
            if (!staticFolder || c !== '/.well-known/acme-challenge') { //if no static folder, redirect as usual (but have no acme challenge support)
                res.redirect(301, 'https://' + req.headers.host + req.url);
            }
            else {
                next(); //otherwise static files
            }
        });

        if (staticFolder) {
            staticHTTPServer.use(express.static(staticFolder, {dotfiles: 'allow'}));
        }
        else {
            logger.warn("Have no STATIC_HTTP_FILE_PATH set, thus no ACME challenge support. Only redirecting all HTTP to HTTPS...");
        }

        http.createServer(staticHTTPServer).listen(80);
    }

    function deployHTTPSServer() {
        // Let's encrypt
        const apiSSLFiles = { //API-Domain (necessary)
            key: fs.readFileSync(
                "/etc/letsencrypt/live/api.corona-school.de/privkey.pem"
            ),
            cert: fs.readFileSync(
                "/etc/letsencrypt/live/api.corona-school.de/cert.pem"
            ),
            ca: fs.readFileSync(
                "/etc/letsencrypt/live/api.corona-school.de/chain.pem"
            )
        };


        let verifyContext: tls.SecureContext;

        try {
            const verifySSLFiles = { //Certificate Verification Domain (recommended for a more beautiful certificate URL)
                key: fs.readFileSync(
                    "/etc/letsencrypt/live/verify.corona-school.de/privkey.pem"
                ),
                cert: fs.readFileSync(
                    "/etc/letsencrypt/live/verify.corona-school.de/cert.pem"
                ),
                ca: fs.readFileSync(
                    "/etc/letsencrypt/live/verify.corona-school.de/chain.pem"
                )
            };

            //also have a second domain used for certificate verification on this server
            verifyContext = tls.createSecureContext(verifySSLFiles);
        }
        catch (e) {
            logger.warn("The SSL files for Certificate Verfication/Validation domain are missing: ", e);
        }

        const options = {
            ...apiSSLFiles,
            SNICallback: function (domain, cb) {
                if (verifyContext && (domain === 'verify.corona-school.de' || domain === 'www.verify.corona-school.de')) {
                    cb(null, verifyContext);
                }
                else {
                    cb();
                }
            }
        };

        // Start listening
        https.createServer(options, app).listen(443);
    }

    function deployServer() {
        if (process.env.NODE_ENV == "dev") {
            setupDevDB().then(() => {
                // Start listening
                http.createServer(app).listen(process.env.PORT || 5000, () =>
                    logger.info("DEV server listening on port " + (process.env.PORT || 5000))
                );
            });
        } else {
            // ---> HTTP
            deployHTTPServer();

            // ---> HTTPS
            try {
                deployHTTPSServer();
            }
            catch (e) {
                logger.error("Cannot setup HTTPS Server, because an error occurred (most likely some certificates are missing). Please add the certificates and restart the server!", e);
            }
        }
    }
});
