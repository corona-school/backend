import '../common/logger/tracing';
// This is needed for prisma in combination with type graphql
// https://typegraphql.com/docs/installation.html
import 'reflect-metadata';
import moment from 'moment-timezone';
import { getLogger } from '../common/logger/logger';
import { scheduleJobs } from './scheduler';
import * as scheduler from './scheduler';
import { configureGracefulShutdown } from './shutdown';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';
import { jobExists, regularJobs } from './list';
import { runJob } from './execute';

//SETUP: logger
const log = getLogger();
log.info('Backend started');

//SETUP: moment
moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: Add a graceful shutdown to the scheduler used
configureGracefulShutdown(scheduler);

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
