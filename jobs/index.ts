import * as moment from "moment-timezone";
import { setup as setupLogging, getLogger } from "./utils/logging";
import { scheduleJobs } from "./scheduler";
import { allJobs } from "./list";

//SETUP: logger
setupLogging();
getLogger().info("Backend started");

//SETUP: moment
moment.locale("de"); //set global moment date format
moment.tz.setDefault("Europe/Berlin"); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

//SETUP: schedule jobs
scheduleJobs(allJobs);