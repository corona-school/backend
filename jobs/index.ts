import '../common/logger/tracing';
// This is needed for prisma in combination with type graphql
// https://typegraphql.com/docs/installation.html
import 'reflect-metadata';
import moment from 'moment-timezone';
import { getLogger } from '../common/logger/logger';
import { scheduleJobs } from './scheduler';
import * as scheduler from './scheduler';
import { configureGracefulShutdown } from './shutdown';
import { jobExists, regularJobs } from './list';
import { runJob } from './execute';
import express from 'express';
import { metricsRouter } from '../common/logger/metrics';
import http from 'http';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';
import { registerAchievementMetrics } from '../common/achievement/metric';

//SETUP: logger
const log = getLogger();
log.info('Backend started');

//SETUP: moment
moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: Add a graceful shutdown to the scheduler used
configureGracefulShutdown(scheduler);
registerAchievementMetrics();

// Add Metrics Server to Jobs Dyno
async function startMetricsServer() {
    const app = express();
    app.use('/metrics', metricsRouter);

    const port = process.env.PORT || 5100;

    const server = http.createServer(app);

    // Start listening
    await new Promise<void>((res) => server.listen(port, res));
    log.info(`Server listening on port ${port}`);
}

if (process.env.METRICS_SERVER_ENABLED === 'true') {
    startMetricsServer().catch((e) => log.error('Failed to setup metrics server', e));
}

// Manual job execution via npm run jobs -- --execute <name>
if (process.argv.length >= 4 && process.argv[2] === '--execute') {
    const job = process.argv[3];
    if (!jobExists(job)) {
        throw new Error(`No Job named '${job}'`);
    }

    log.info(`Manually executing ${job}, creating DB connection`);

    void runJob(job);
} else {
    log.info('To directly run one of the jobs, use --execute <name>, we now schedule Cron Jobs to run in the future');
    scheduleJobs(regularJobs);
}
