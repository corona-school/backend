import { CSCronJob } from "./types";

//import the jobs
import fetchJob from "./periodic/fetch";
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every 30 seconds
    { cronTime: "*/30 * * * * *", jobFunction: fetchJob},
    // every morning
    { cronTime: "00 15 08 * * *", jobFunction: screeningReminderJob},
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob}
];