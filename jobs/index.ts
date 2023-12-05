import '../common/logger/tracing';
// This is needed for prisma in combination with type graphql
// https://typegraphql.com/docs/installation.html
import 'reflect-metadata';
import moment from 'moment-timezone';
import { getLogger } from '../common/logger/logger';
import { scheduleJobs } from './scheduler';
import * as scheduler from './scheduler';
import { allJobs } from './list';
import { configureGracefulShutdown } from './shutdown';
import { executeJob } from './manualExecution';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';
import { registerAchievementMetrics } from '../common/achievement/metric';

//SETUP: logger
const log = getLogger();
log.info('Backend started');

//SETUP: moment
moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: schedule jobs

//SETUP: Add a graceful shutdown to the scheduler used
configureGracefulShutdown(scheduler);
registerAchievementMetrics();

// Manual job execution via npm run jobs -- --execute <name>
if (process.argv.length >= 4 && process.argv[2] === '--execute') {
    const job = process.argv[3];
    log.info(`Manually executing ${job}, creating DB connection`);
    void executeJob(job);
} else {
    log.info('To directly run one of the jobs, use --execute <name>, we now schedule Cron Jobs to run in the future');
    void scheduleJobs(allJobs);
}
