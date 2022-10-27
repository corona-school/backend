import { CSCronJob } from "./types";

//import the jobs
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import * as Notification from "../common/notification";
import deactivateMissingCoc from "./periodic/deactivate-missing-coc";
import { cleanupSecrets } from "../common/secret";
import { runInterestConfirmations } from "../common/match/pool";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every morning, quite early (but only on Monday and Thursday)
    { cronTime: "00 55 07 * * 1,4", jobFunction: runInterestConfirmations },
    // every morning
    { cronTime: "00 00 09 * * *", jobFunction: screeningReminderJob},
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob},
    // every day at midnight/beginning
    { cronTime: "00 00 00 * * *", jobFunction: jufoVerificationInfo},
    { cronTime: "00 30 00 * * 0", jobFunction: deactivateMissingCoc},
    // every 10 minutes during the day (to distribute load and send out notifications faster)
    { cronTime: "00 */10 * * * *", jobFunction: Notification.checkReminders },
    // each night - database cleanups
    { cronTime: "00 00 04 * * *", jobFunction: cleanupSecrets }
    // TODO: Enable
    // { cronTime: "00 00 02 * * *", jobFunction: redactInactiveAccounts },
    // { cronTime: "00 00 01 * * *", jobFunction: dropOldNotificationContexts }
];
