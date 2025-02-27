import express from 'express';
import http, { IncomingMessage } from 'http';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { connectLogger } from 'log4js';
import cookieParser from 'cookie-parser';
import favicon from 'express-favicon';
import { getLogger } from '../common/logger/logger';
import { startTransaction } from '../common/session';

import { apolloServer } from '../graphql';
import { WebSocketService } from '../common/websocket';

import { fileRouter } from './controllers/fileController';
import { attachmentRouter } from './controllers/attachmentController';
import { certificateRouter } from './controllers/certificateController';
import { convertCertificateLinkToApiLink } from '../common/certificate';
import { chatNotificationRouter } from './controllers/chatNotificationController';
import { WithRawBody } from './controllers/chatNotificationController/types';
import { metricsRouter } from '../common/logger/metrics';

// ------------------ Setup Logging, Common Headers, Routes ----------------

const logger = getLogger('WebServer');

export const server = (async function setupWebserver() {
    logger.info('Starting Webserver');
    const app = express();

    // Log details about every HTTP request:
    if (process.env.LOG_FORMAT !== 'brief') {
        const accessLogger = getLogger('access');
        app.use(connectLogger(accessLogger.getLoggerImpl(), { level: 'auto' }));
    }

    // Set common security HTTP response headers:
    app.use(helmet());

    // Attach a transaction to each request, that is propagated across continuations:
    app.use((req, res, next) => {
        startTransaction();
        next();
    });

    // Parse Cookies and JSON Bodies:
    app.use(
        bodyParser.json({
            // To be able to persist the raw body of the request we use the verify function and extend the request object by the key `rawBody`
            verify: (req: WithRawBody<IncomingMessage>, res, buf) => {
                req.rawBody = buf;
            },
            limit: '10MB',
        })
    );
    app.use(cookieParser());

    // Add a Favicon to the Backend (as we have some URLs that are directly opened on the backend)
    app.use(favicon('./assets/favicon.ico'));

    // Serve static assets:
    app.use('/public', express.static('./assets/public'));

    // -------------------- CORS ------------------------------

    let origins: (string | RegExp)[];

    const allowedSubdomains = ['jufo', 'partnerschule', 'drehtuer', 'codu'];
    if (process.env.ENV == 'dev') {
        origins = [
            'http://localhost:3000',
            ...allowedSubdomains.map((d) => `http://${d}.localhost:3000`),
            'https://lernfair-user-app-dev.herokuapp.com',
            /^https:\/\/user-app-[a-z0-9-]+\.herokuapp\.com$/,
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

    // ------------------------ GraphQL ---------------------------
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/apollo' });

    // ------------------------ HTTP Routes -----------------------
    app.use('/api/attachments', attachmentRouter);
    app.use('/api/certificate', certificateRouter);
    app.use('/api/files', fileRouter);
    app.use('/api/chat', chatNotificationRouter);
    app.use('/metrics', metricsRouter);

    app.get('/:certificateId', (req, res, next) => {
        if (!req.subdomains.includes('verify')) {
            return next();
        }

        res.redirect(convertCertificateLinkToApiLink(req));
    });

    // ------------------------ Serve HTTP & Websocket ------------------------
    const port = process.env.PORT || 5000;

    const server = http.createServer(app);

    const ws = WebSocketService.getInstance(server);
    ws.configure();

    // Start listening
    await new Promise<void>((res) => server.listen(port, res));
    logger.info(`Server listening on port ${port}`);

    return server;
})();
