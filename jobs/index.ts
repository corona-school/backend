import moment from "moment-timezone";
import { getLogger } from "./../common/util/logs";
import { scheduleJobs } from "./scheduler";
import * as scheduler from "./scheduler";
import { allJobs } from "./list";
import { configureGracefulShutdown } from "./shutdown";

getLogger().info("Backend started");

//SETUP: moment
moment.locale("de"); //set global moment date format
moment.tz.setDefault("Europe/Berlin"); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: schedule jobs
scheduleJobs(allJobs);

//SETUP: Add a graceful shutdown to the scheduler used
configureGracefulShutdown(scheduler);