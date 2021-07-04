import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as hpp from "hpp";
import * as helmet from "helmet";
import * as cors from "cors";
import * as userController from "./controllers/userController";
import * as tokenController from "./controllers/tokenController";
import * as matchController from "./controllers/matchController";
import * as projectMatchController from "./controllers/projectMatchController";
import * as screeningController from "./controllers/screeningController";
import * as matchingController from "./controllers/matchingController";
import * as certificateController from "./controllers/certificateController";
import * as courseController from "./controllers/courseController";
import * as registrationController from "./controllers/registrationController";
import * as mentoringController from "./controllers/mentoringController";
import * as expertController from "./controllers/expertController";
import * as interestConfirmationController from "./controllers/interestConfirmationController";
import { configure, connectLogger, getLogger } from "log4js";
import { createConnection, getConnection } from "typeorm";
import { authCheckFactory, screenerAuthCheck } from "./middleware/auth";
import { setupDevDB } from "./dev";
import * as favicon from "express-favicon";
import { allStateCooperationSubdomains } from "../common/entity/State";
import * as multer from "multer";
import * as moment from "moment-timezone";
import { closeBrowser, setupBrowser } from "html-pppdf";
import { performCleanupActions } from "../common/util/cleanup";
import "reflect-metadata"; //leave it here...
import * as rateLimit from "express-rate-limit";
import * as notificationController from "./controllers/notifiationController";

// Logger setup
try {
    configure("web/logconfig.json");
} catch (e) {
    console.warn("Couldn't setup logger", e);
}

const logger = getLogger();
const accessLogger = getLogger("access");

//SETUP: moment
moment.locale("de"); //set global moment date format
moment.tz.setDefault("Europe/Berlin"); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

logger.info("Webserver backend started");
const app = express();

//SETUP PDF generation environment
async function setupPDFGenerationEnvironment() {
    await setupBrowser({
        args: ["--no-sandbox"], //don't run in a sandbox, cause we have only trusted content and our server do not support a sandbox
        handleSIGTERM: false //don't close chrome on sigterm, which heroku sends to all processes
    });
}

// Database connection
createConnection().then(setupPDFGenerationEnvironment)
    .then(async () => {
        logger.info("Database connected");
        app.use(connectLogger(accessLogger, { level: "auto" }));

        // Express setup
        app.use(bodyParser.json());
        app.use(favicon('./assets/favicon.ico'));

        addCorsMiddleware();
        addSecurityMiddleware();

        configureParticipationCertificateAPI();
        configureUserAPI();
        configureCertificateAPI();
        configureTokenAPI();
        configureCourseAPI();
        configureScreenerAPI();
        configureCoursesAPI();
        configureRegistrationAPI();
        configureMentoringAPI();
        configureExpertAPI();
        configurePupilInterestConfirmationAPI();
        configureNotificationAPI();
        const server = await deployServer();
        configureGracefulShutdown(server);

        function addCorsMiddleware() {

            let origins;

            const allowedSubdomains = [
                ...allStateCooperationSubdomains,
                "jufo",
                "partnerschule",
                "drehtuer"
            ];
            if (process.env.NODE_ENV == "dev") {
                origins = [
                    "http://localhost:3000",
                    ...allowedSubdomains.map(d => `http://${d}.localhost:3000`),
                    "https://web-user-app-live.herokuapp.com",
                    "https://web-user-app-dev.herokuapp.com",
                    /^https:\/\/cs-web-user-app-(pr-[0-9]+|br-[\-a-z0-9]+).herokuapp.com$/,
                    ...allowedSubdomains.map(d => `https://${d}.dev.corona-school.de`)
                ];
            } else {
                origins = [
                    "https://dashboard.corona-school.de",
                    "https://my.corona-school.de",
                    ...allowedSubdomains.map(d => `https://${d}.corona-school.de`),
                    "https://dashboard.lern-fair.de",
                    "https://my.lern-fair.de",
                    ...allowedSubdomains.map(d => `https://${d}.lern-fair.de`)
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
            userApiRouter.use(authCheckFactory(false, false, true, [], ["tutoringInterestConfirmationRequest"]));
            userApiRouter.get("/", userController.getSelfHandler);
            userApiRouter.get("/:id", userController.getHandler);
            userApiRouter.put("/:id", userController.putHandler);
            userApiRouter.put("/:id/subjects", userController.putSubjectsHandler);
            userApiRouter.put("/:id/projectFields", userController.putProjectFieldsHandler);
            userApiRouter.put("/:id/active/:active", userController.putActiveHandler);
            userApiRouter.delete("/:id/matches/:uuid", matchController.deleteHandler);
            userApiRouter.delete("/:id/projectMatches/:uuid", projectMatchController.deleteHandler);
            userApiRouter.post("/:id/role/instructor", userController.postUserRoleInstructorHandler);
            userApiRouter.post("/:id/role/tutor", userController.postUserRoleTutorHandler);
            userApiRouter.post("/:id/role/projectCoach", userController.postUserRoleProjectCoachHandler);
            userApiRouter.post("/:id/role/projectCoachee", userController.postUserRoleProjectCoacheeHandler);
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
            certificateRouter.post("/create", authCheckFactory(), certificateController.createCertificateEndpoint);
            certificateRouter.get("/:certificateId", authCheckFactory(), certificateController.getCertificateEndpoint);
            certificateRouter.get("/:certificateId/confirmation", /* NO AUTH REQUIRED */ certificateController.getCertificateConfirmationEndpoint);
            certificateRouter.post("/:certificateId/sign", authCheckFactory(), certificateController.signCertificateEndpoint);

            app.use("/api/certificate", certificateRouter);
            app.get("/api/certificates", authCheckFactory(), certificateController.getCertificatesEndpoint);
        }

        function configureCourseAPI() {
            const coursesRouter = express.Router();
            //no default mounted middleware at all... (primarily for performance)
            coursesRouter.post("/:id/subcourse/:subid/certificate", authCheckFactory(false, false, false, []), courseController.issueCourseCertificateHandler);
            //public routes
            coursesRouter.use(authCheckFactory(true));
            coursesRouter.get("/:id", courseController.getCourseHandler);
            coursesRouter.get("/test/meeting/join", authCheckFactory(true, true), courseController.testJoinCourseMeetingHandler);
            coursesRouter.get("/meeting/external/join/:token", courseController.joinCourseMeetingExternalHandler);
            //private routes
            coursesRouter.use(authCheckFactory());
            coursesRouter.post("/", courseController.postCourseHandler);
            coursesRouter.put("/:id", courseController.putCourseHandler);
            coursesRouter.delete("/:id", courseController.deleteCourseHandler);

            coursesRouter.post("/:id/instructor", courseController.postAddCourseInstructorHandler);

            const courseImageUpload = multer({
                limits: {
                    fileSize: 5 * (10 ** 6) //5mb
                },
                storage: multer.memoryStorage(), //store in memory.....
                fileFilter: (req, file, cb) => {
                    cb(null, ["image/png", "image/jpeg", "image/gif"].includes(file.mimetype));
                }
            });
            coursesRouter.put("/:id/image", courseImageUpload.single("cover"), courseController.putCourseImageHandler);
            coursesRouter.delete("/:id/image", courseController.deleteCourseImageHandler);

            coursesRouter.post("/:id/subcourse", courseController.postSubcourseHandler);
            coursesRouter.put("/:id/subcourse/:subid", courseController.putSubcourseHandler);
            coursesRouter.delete("/:id/subcourse/:subid", courseController.deleteSubcourseHandler);

            coursesRouter.post("/:id/subcourse/:subid/participants/:userid", courseController.joinSubcourseHandler);
            coursesRouter.delete("/:id/subcourse/:subid/participants/:userid", courseController.leaveSubcourseHandler);

            coursesRouter.post("/:id/subcourse/:subid/waitinglist/:userid", courseController.joinWaitingListHandler);
            coursesRouter.delete("/:id/subcourse/:subid/waitinglist/:userid", courseController.leaveWaitingListHandler);

            coursesRouter.post("/:id/subcourse/:subid/lecture", courseController.postLectureHandler);
            coursesRouter.post("/:id/subcourse/:subid/groupmail", courseController.groupMailHandler);
            coursesRouter.post("/:id/subcourse/:subid/instructormail", courseController.instructorMailHandler);
            coursesRouter.put("/:id/subcourse/:subid/lecture/:lecid", courseController.putLectureHandler);
            coursesRouter.delete("/:id/subcourse/:subid/lecture/:lecid", courseController.deleteLectureHandler);

            coursesRouter.get("/:id/subcourse/:subid/meeting/join", courseController.joinCourseMeetingHandler);

            coursesRouter.post("/:id/inviteexternal", courseController.inviteExternalHandler);

            app.use("/api/course", coursesRouter);
        }

        function configureCoursesAPI() {
            const coursesRouter = express.Router();

            coursesRouter.use(authCheckFactory(true));
            coursesRouter.get("/", courseController.getCoursesHandler);
            coursesRouter.get("/tags", courseController.getCourseTagsHandler);

            app.use("/api/courses", coursesRouter);
        }

        function configureRegistrationAPI() {
            const checkEmailRateLimit = rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 5
            });

            const registrationRouter = express.Router();
            registrationRouter.post("/tutee", registrationController.postTuteeHandler);
            registrationRouter.post("/tutee/state", registrationController.postStateTuteeHandler);
            registrationRouter.post("/tutor", registrationController.postTutorHandler);
            registrationRouter.post("/mentor", registrationController.postMentorHandler);
            registrationRouter.post("/checkEmail", checkEmailRateLimit, registrationController.checkEmail);
            registrationRouter.get("/schools/:state?", registrationController.getSchoolsHandler);
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
                screeningController.updateStudentByMailHandler
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
            screenerApiRouter.get(
                "/courses/tags",
                screeningController.getCourseTags
            );
            screenerApiRouter.post(
                "/courses/tags/create",
                screeningController.postCreateCourseTag
            );
            screenerApiRouter.post(
                "/course/:id/update",
                screeningController.updateCourse
            );
            screenerApiRouter.get(
                "/instructors",
                screeningController.getInstructors
            );

            const matchingApiRouter = express.Router();
            matchingApiRouter.post(
                "/match",
                matchingController.matchPeopleMiddleware
            );
            screenerApiRouter.use("/matching", matchingApiRouter);

            app.use("/api/screening", screenerApiRouter);
        }

        function configureParticipationCertificateAPI() {
            const participationCertificateRouter = express.Router();
            participationCertificateRouter.get("/:certificateId", (req, res, next) => {
                if (!req.subdomains.includes("verify")) {
                    return next();
                }
                certificateController.getCertificateConfirmationEndpoint(req, res);
            });
            participationCertificateRouter.use((req, res, next) => {
                if (req.subdomains.includes("verify")) {
                    return res.redirect(`${req.protocol}://${req.hostname.split(".").slice(req.subdomains.length)
                        .join(".")}`);
                }
                next();
            });
            app.use(participationCertificateRouter);
        }

        function configureMentoringAPI() {
            const mentoringRouter = express.Router();
            mentoringRouter.use(authCheckFactory());
            mentoringRouter.post("/contact", mentoringController.postContactMentorHandler);
            mentoringRouter.get("/material", mentoringController.getMaterial);
            mentoringRouter.get("/feedbackCall", mentoringController.getFeedbackCallData);

            app.use("/api/mentoring", mentoringRouter);
        }

        function configureExpertAPI() {
            const expertRouter = express.Router();
            expertRouter.use(authCheckFactory());
            expertRouter.get("/", expertController.getExpertsHandler);
            expertRouter.post("/:id/contact", expertController.postContactExpertHandler);
            expertRouter.put("/:id", expertController.putExpertHandler);
            expertRouter.get("/tags", expertController.getUsedTagsHandler);

            app.use("/api/expert", expertRouter);
        }

        function configurePupilInterestConfirmationAPI() {
            const router = express.Router();
            router.post("/status", interestConfirmationController.postInterestConfirmationRequestStatus);

            app.use("/api/interest-confirmation", router);
        }

        function configureNotificationAPI() {
            const router = express.Router();

            // DEV only:
            router.post("/trigger-action", notificationController.triggerActionHandler);

            app.use("/api/notification", authCheckFactory(), router);
        }

        async function deployServer() {
            const isDev = process.env.NODE_ENV === "dev";
            const port = process.env.PORT || 5000;
            if (isDev) {
                await setupDevDB();
            }

            // Start listening
            return http.createServer(app).listen(port, () =>
                logger.info(`${isDev ? "DEV-": ""}Server listening on port ${port}`)
            ); //return server such that it can be used afterwards
        }

        function configureGracefulShutdown(server: http.Server) {
        //NOTE: use this to cleanup node's event loop
            process.on("SIGTERM", async () => {
                logger.debug("SIGTERM signal received: Starting graceful shutdown procedures...");
                //Close Server
                await new Promise<void>((resolve, reject) => server.close(() => {
                    resolve();
                }));
                logger.debug("✅ HTTP server closed!");

                //remove intervals to cleanup, and anything else that have registered as cleanup actions
                performCleanupActions();
                logger.debug("✅ All other custom graceful shutdown actions completed!");

                //close puppeteer (because if all connections are finished, it is no longer needed at the moment)
                //even though this is not the cleanest solution (because it could still lead to some queued callbacks on node's event loop that uses puppeteer for pdf generation), it is called here, because for now all pdf generation is awaited for until a server-route's response was delivered.
                await closeBrowser();
                logger.debug("✅ Puppeteer gracefully shut down!");

            //now, the process will automatically exit if node has no more async operations to perform (i.e. finished sending out all open mails that weren't awaited for etc.)
            });

            //NOTE: Use the following to perform async actions before exiting. This is called if node's event loop is empty and thus it will only add async operations that, when completed lead to an empty event loop, such that node can exit then.
            process.on("beforeExit", async () => {
                console.log("BEFORE EXIT TRIGGERED....");
                //Close database connection
                await getConnection()?.close();
                logger.debug("✅ Default database connection successfully closed!");
                //Finish...
                logger.debug("Graceful Shutdown completed 🎉"); //event loop now fully cleaned up
            });
        }
    });