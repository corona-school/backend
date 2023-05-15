import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import * as userController from './controllers/userController';
import * as matchController from './controllers/matchController';
import * as projectMatchController from './controllers/projectMatchController';
import * as certificateController from './controllers/certificateController';
import * as registrationController from './controllers/registrationController';
import * as mentoringController from './controllers/mentoringController';
import { connectLogger } from 'log4js';
import { getLogger } from '../common/logger/logger';
import { createConnection, getConnection } from 'typeorm';
import { authCheckFactory } from './middleware/auth';
import { setupDevDB } from './dev';
import favicon from 'express-favicon';
import { allStateCooperationSubdomains } from '../common/entity/State';
import multer from 'multer';
import moment from 'moment-timezone';
import { closeBrowser, setupBrowser } from 'html-pppdf';
import { performCleanupActions } from '../common/util/cleanup';
import 'reflect-metadata'; //leave it here...
import { apolloServer } from '../graphql';
import rateLimit from 'express-rate-limit';
import { getAttachmentUrlEndpoint } from './controllers/attachmentController';
import { isDev } from '../common/util/environment';
import { isCommandArg } from '../common/util/basic';
import { fileRouter } from './controllers/fileController';
import cookieParser from 'cookie-parser';
import { WebSocketService } from '../common/websocket';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';

// Logger setup
const logger = getLogger();
const accessLogger = getLogger('access');
logger.debug('Debug logging enabled');

//SETUP: moment
moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

logger.info('Webserver backend started');
const app = express();

//SETUP PDF generation environment
async function setupPDFGenerationEnvironment() {
    if (isCommandArg('--noPDF')) {
        logger.info('Skipping browser initialization due to supplied --noPDF arg');
        return;
    }
    await setupBrowser({
        args: ['--no-sandbox'], //don't run in a sandbox, cause we have only trusted content and our server do not support a sandbox
        handleSIGTERM: false, //don't close chrome on sigterm, which heroku sends to all processes
    });
}

// Database connection
void createConnection()
    .then(setupPDFGenerationEnvironment)
    .then(async () => {
        logger.info('Database connected');
        app.use(connectLogger(accessLogger.getLoggerImpl(), { level: 'auto' }));

        // Express setup
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(favicon('./assets/favicon.ico'));
        app.use('/public', express.static('./assets/public'));

        addCorsMiddleware();
        addSecurityMiddleware();

        configureAttachmentAPI();

        if (!isCommandArg('--noPDF')) {
            configureParticipationCertificateAPI();
            configureCertificateAPI();
        }
        configureUserAPI();
        configureRegistrationAPI();
        configureMentoringAPI();
        await configureApolloServer();
        configureFileAPI();
        const server = await deployServer();
        configureGracefulShutdown(server);

        function addCorsMiddleware() {
            let origins;

            const allowedSubdomains = [...allStateCooperationSubdomains, 'jufo', 'partnerschule', 'drehtuer', 'codu'];
            if (process.env.ENV == 'dev') {
                origins = [
                    'http://localhost:3000',
                    ...allowedSubdomains.map((d) => `http://${d}.localhost:3000`),
                    'https://user-app-dev.herokuapp.com',
                    /^https:\/\/lernfair-user-app-[\-a-z0-9]+.herokuapp.com$/,
                    'https://lern.retool.com',
                ];
            } else {
                origins = [
                    'https://dashboard.corona-school.de',
                    'https://my.corona-school.de',
                    ...allowedSubdomains.map((d) => `https://${d}.corona-school.de`),
                    'https://dashboard.lern-fair.de',
                    'https://my.lern-fair.de',
                    'https://app.lern-fair.de',
                    ...allowedSubdomains.map((d) => `https://${d}.lern-fair.de`),
                    'https://lern.retool.com',
                ];
            }

            const options = {
                origin: origins,
                methods: ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'],
            };

            app.use(cors(options));
        }

        function addSecurityMiddleware() {
            app.use(hpp());
            app.use(helmet());
        }

        function configureAttachmentAPI() {
            const attachmentApiRouter = express.Router();
            attachmentApiRouter.get('/:attachmentId/:filename', getAttachmentUrlEndpoint);
            app.use('/api/attachments', attachmentApiRouter);
        }

        function configureUserAPI() {
            const userApiRouter = express.Router();
            userApiRouter.use(authCheckFactory(false, false, true, [], ['tutoringInterestConfirmationRequest']));
            userApiRouter.get('/', userController.getSelfHandler);
            userApiRouter.get('/:id', userController.getHandler);
            userApiRouter.put('/:id', userController.putHandler);
            userApiRouter.put('/:id/subjects', userController.putSubjectsHandler);
            userApiRouter.put('/:id/projectFields', userController.putProjectFieldsHandler);
            userApiRouter.put('/:id/active/:active', userController.putActiveHandler);
            userApiRouter.delete('/:id/matches/:uuid', matchController.deleteHandler);
            userApiRouter.delete('/:id/projectMatches/:uuid', projectMatchController.deleteHandler);
            userApiRouter.post('/:id/role/instructor', userController.postUserRoleInstructorHandler);
            userApiRouter.post('/:id/role/tutor', userController.postUserRoleTutorHandler);
            userApiRouter.post('/:id/role/projectCoach', userController.postUserRoleProjectCoachHandler);
            userApiRouter.post('/:id/role/projectCoachee', userController.postUserRoleProjectCoacheeHandler);
            app.use('/api/user', userApiRouter);
        }

        function configureCertificateAPI() {
            const certificateRouter = express.Router();
            certificateRouter.get('/:certificateId/confirmation', /* NO AUTH REQUIRED */ certificateController.getCertificateConfirmationEndpoint);

            app.use('/api/certificate', certificateRouter);

            // TODO Find better solution
            app.use('/api/certificate/:certificateId/public', express.static('./assets/public'));
        }

        function configureRegistrationAPI() {
            const checkEmailRateLimit = rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 5,
            });

            const registrationRouter = express.Router();
            registrationRouter.post('/tutee', registrationController.postTuteeHandler);
            registrationRouter.post('/tutee/state', registrationController.postStateTuteeHandler);
            registrationRouter.post('/tutor', registrationController.postTutorHandler);
            registrationRouter.post('/mentor', registrationController.postMentorHandler);
            registrationRouter.post('/checkEmail', checkEmailRateLimit, registrationController.checkEmail);
            registrationRouter.get('/schools/:state?', registrationController.getSchoolsHandler);
            app.use('/api/register', registrationRouter);
        }

        function configureParticipationCertificateAPI() {
            const participationCertificateRouter = express.Router();
            participationCertificateRouter.get('/:certificateId', (req, res, next) => {
                if (!req.subdomains.includes('verify')) {
                    return next();
                }
                void certificateController.getCertificateConfirmationEndpoint(req, res);
            });
            participationCertificateRouter.use((req, res, next) => {
                if (req.subdomains.includes('verify')) {
                    return res.redirect(`${req.protocol}://${req.hostname.split('.').slice(req.subdomains.length).join('.')}`);
                }
                next();
            });
            app.use(participationCertificateRouter);
        }

        function configureMentoringAPI() {
            const mentoringRouter = express.Router();
            mentoringRouter.use(authCheckFactory());
            mentoringRouter.post('/contact', mentoringController.postContactMentorHandler);
            mentoringRouter.get('/material', mentoringController.getMaterial);
            mentoringRouter.get('/feedbackCall', mentoringController.getFeedbackCallData);

            app.use('/api/mentoring', mentoringRouter);
        }

        function configureFileAPI() {
            app.use('/api/files', fileRouter);
        }

        async function configureApolloServer() {
            await apolloServer.start();
            apolloServer.applyMiddleware({ app, path: '/apollo' });
        }

        async function deployServer() {
            const port = process.env.PORT || 5000;
            if (isDev && !isCommandArg('--keepDB')) {
                await setupDevDB();
            }

            const server = http.createServer(app);

            const ws = WebSocketService.getInstance(server);
            ws.configure();

            // Start listening
            return server.listen(port, () => logger.info(`${isDev ? 'DEV-' : ''}Server listening on port ${port}`)); //return server such that it can be used afterwards
        }

        function configureGracefulShutdown(server: http.Server) {
            //NOTE: use this to cleanup node's event loop
            process.on('SIGTERM', async () => {
                logger.debug('SIGTERM signal received: Starting graceful shutdown procedures...');
                //Close Server
                await new Promise<void>((resolve) =>
                    server.close(() => {
                        resolve();
                    })
                );
                logger.debug('✅ HTTP server closed!');

                //remove intervals to cleanup, and anything else that have registered as cleanup actions
                performCleanupActions();
                logger.debug('✅ All other custom graceful shutdown actions completed!');

                //close puppeteer (because if all connections are finished, it is no longer needed at the moment)
                //even though this is not the cleanest solution (because it could still lead to some queued callbacks on node's event loop that uses puppeteer for pdf generation), it is called here, because for now all pdf generation is awaited for until a server-route's response was delivered.
                if (!isCommandArg('--noPDF')) {
                    await closeBrowser();
                    logger.debug('✅ Puppeteer gracefully shut down!');
                }
                //now, the process will automatically exit if node has no more async operations to perform (i.e. finished sending out all open mails that weren't awaited for etc.)
            });

            //NOTE: Use the following to perform async actions before exiting. This is called if node's event loop is empty and thus it will only add async operations that, when completed lead to an empty event loop, such that node can exit then.
            process.on('beforeExit', async () => {
                console.log('BEFORE EXIT TRIGGERED....');
                //Close database connection
                await getConnection()?.close();
                logger.debug('✅ Default database connection successfully closed!');
                //Finish...
                logger.debug('Graceful Shutdown completed 🎉'); //event loop now fully cleaned up
            });
        }
    });
