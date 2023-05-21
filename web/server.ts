import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { connectLogger } from 'log4js';
import cookieParser from 'cookie-parser';
import favicon from 'express-favicon';
import { getLogger } from '../common/logger/logger';
import { startTransaction } from '../common/session';
import { allStateCooperationSubdomains } from '../common/entity/State';

import { apolloServer } from '../graphql';
import { WebSocketService } from '../common/websocket';

import { fileRouter } from './controllers/fileController';
import { attachmentRouter } from './controllers/attachmentController';
import { certificateRouter } from './controllers/certificateController';

// ------------------ Setup Logging, Common Headers, Routes ----------------

const logger = getLogger('WebServer');

logger.info('Starting Webserver');
const app = express();

// Log details about every HTTP request:
const accessLogger = getLogger('access');
app.use(connectLogger(accessLogger.getLoggerImpl(), { level: 'auto' }));

// Set common security HTTP response headers:
app.use(helmet());

// Attach a transaction to each request, that is propagated across continuations:
app.use((req, res, next) => {
    startTransaction();
    next();
});

// Parse Cookies and JSON Bodies:
app.use(bodyParser.json());
app.use(cookieParser());

// Add a Favicon to the Backend (as we have some URLs that are directly opened on the backend)
app.use(favicon('./assets/favicon.ico'));

// Serve static assets:
app.use('/public', express.static('./assets/public'));

// -------------------- CORS ------------------------------

let origins: (string | RegExp)[];

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


// ------------------------ GraphQL ---------------------------
void (async function () {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/apollo' });
})();

// ------------------------ HTTP Routes -----------------------
app.use('/api/attachments', attachmentRouter);
app.use('/api/certificate', certificateRouter);
app.use('/api/files', fileRouter);

app.get('/:certificateId', (req, res, next) => {
    if (!req.subdomains.includes('verify')) {
        return next();
    }

    res.redirect(`https://api.lern-fair.de/api/certificate/${req.params.certificateId}/confirm`);
});

// ------------------------ Serve HTTP & Websocket ------------------------
const port = process.env.PORT || 5000;

const server = http.createServer(app);

const ws = WebSocketService.getInstance(server);
ws.configure();

// Start listening
server.listen(port, () => logger.info(`Server listening on port ${port}`));
