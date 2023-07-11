import { CSCronJob } from './types';

//import the jobs
import screeningReminderJob from './periodic/screening-reminder';
import courseReminderJob from './periodic/course-reminder';
import * as Notification from '../common/notification';
import { cleanupSecrets } from '../common/secret';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import { runInterestConfirmations } from '../common/match/pool';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import syncToWebflow from './periodic/sync-to-webflow';

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every morning, quite early (but only on Monday and Thursday)
    // { cronTime: "00 55 07 * * 1,4", jobFunction: initialInterestConfirmationRequests},
    { cronTime: '00 55 07 * * 1,4', jobFunction: runInterestConfirmations },
    // every morning
    { cronTime: '00 00 09 * * *', jobFunction: screeningReminderJob },
    // { cronTime: "00 56 08 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // every morning, but a little later
    { cronTime: '00 15 09 * * *', jobFunction: courseReminderJob },
    // every morning, but a little bit later
    // every 10 minutes during the day (to distribute load and send out notifications faster)
    { cronTime: '00 */10 * * * *', jobFunction: Notification.checkReminders },
    // each night - database cleanups
    { cronTime: '00 00 05 * * *', jobFunction: anonymiseAttendanceLog },
    { cronTime: '00 00 04 * * *', jobFunction: cleanupSecrets },
    // TODO: Reenable once we have fixed accounts being redacted too early
    // { cronTime: '00 00 02 * * *', jobFunction: redactInactiveAccounts },
    { cronTime: '00 00 01 * * *', jobFunction: dropOldNotificationContexts },
    // Synch DB data to webflow CMS
    { cronTime: '00 */15 * * * *', jobFunction: syncToWebflow },
];
