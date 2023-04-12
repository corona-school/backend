import moment from "moment-timezone";
import { getLogger } from "../common/logger/logger";
import { scheduleJobs } from "./scheduler";
import * as scheduler from "./scheduler";
import { allJobs } from "./list";
import { configureGracefulShutdown } from "./shutdown";
import { executeJob } from "./manualExecution";
import { createConnection } from "typeorm";

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';

//SETUP: logger
const log = getLogger();
log.info("Backend started");

//SETUP: moment
moment.locale("de"); //set global moment date format
moment.tz.setDefault("Europe/Berlin"); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: schedule jobs

//SETUP: Add a graceful shutdown to the scheduler used
configureGracefulShutdown(scheduler);

// Manual job execution via npm run jobs -- --execute <name>
if (process.argv.length >= 4 && process.argv[2] === "--execute") {
    const job = process.argv[3];
    log.info(`Manually executing ${job}, creating DB connection`);
    createConnection().then(() => {
        log.info(`DB connection created, running job`);
        executeJob(job);
    });
} else {
    log.info("To directly run one of the jobs, use --execute <name>, we now schedule Cron Jobs to run in the future");
    scheduleJobs(allJobs);
}
