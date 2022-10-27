import { CSCronJob } from "./types";

//import the jobs
import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import feedbackRequestJob from "./periodic/feedback-request";
import matchFollowUpJob from "./periodic/match-follow-up";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import projectMatchMaking from "./periodic/project-match-making";
import tutoringMatchMaking from "./periodic/tutoring-match-making";
import initialInterestConfirmationRequests from "./periodic/interest-confirmation-requests";
import interestConfirmationRequestReminders from "./periodic/interest-confirmation-request-reminders";
import * as Notification from "../common/notification";
import deactivateMissingCoc from "./periodic/deactivate-missing-coc";
import { cleanupSecrets } from "../common/secret";
import redactInactiveAccounts from "./periodic/redact-inactive-accounts";
import dropOldNotificationContexts from "./periodic/drop-old-notification-contexts";
import { runInterestConfirmations } from "../common/match/pool";

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every morning, quite early (but only on Monday and Thursday)
    // { cronTime: "00 55 07 * * 1,4", jobFunction: initialInterestConfirmationRequests},
    { cronTime: "00 55 07 * * 1,4", jobFunction: runInterestConfirmations },
    // every morning
    { cronTime: "00 00 09 * * *", jobFunction: screeningReminderJob},
    { cronTime: "00 34 08 * * *", jobFunction: projectMatchMaking},
    // { cronTime: "00 56 08 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // every morning, but a little later
    { cronTime: "00 15 09 * * *", jobFunction: courseReminderJob},
    // every morning, but a little bit later
    // { cronTime: "00 15 10 * * *", jobFunction: feedbackRequestJob},  // disabled for now, because at the moment it is not used in production
    // { cronTime: "00 15 11 * * *", jobFunction: matchFollowUpJob},    // disabled for now, because at the moment it is not used in production
    // every afternoon
    { cronTime: "00 35 15 * * *", jobFunction: projectMatchMaking},
    // { cronTime: "00 47 14 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // { cronTime: "00 30 16 * * *", jobFunction: interestConfirmationRequestReminders},
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
