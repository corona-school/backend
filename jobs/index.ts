import * as moment from "moment";
import { setup as setupLogging, getLogger } from "./utils/logging";
import { scheduleJobs } from "./scheduler";
import { allJobs } from "./list";

//SETUP: logger
setupLogging();
getLogger().info("Backend started");

//SETUP: moment
moment.locale("de"); //set global moment date format

//SETUP: schedule jobs
scheduleJobs(allJobs);