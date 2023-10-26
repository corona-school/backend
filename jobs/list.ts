import { CSCronJob } from './types';

//import the jobs
import * as Notification from '../common/notification';
import { cleanupSecrets } from '../common/secret';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import { runInterestConfirmations } from '../common/match/pool';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import syncToWebflow from './periodic/sync-to-webflow';
import { postStatisticsToSlack } from './slack-statistics';
import redactInactiveAccounts from './periodic/redact-inactive-accounts';
import { sendInactivityNotification } from './periodic/redact-inactive-accounts/send-inactivity-notification';
import { deactivateInactiveAccounts } from './periodic/redact-inactive-accounts/deactivate-inactive-accounts';
import notificationsEndedYesterday from './periodic/notification-courses-ended-yesterday';

// A list of all jobs that should be scheduled at the moment
export const allJobs: CSCronJob[] = [
    // every morning, quite early (but only on Monday and Thursday)
    // { cronTime: "00 55 07 * * 1,4", jobFunction: initialInterestConfirmationRequests},
    { cronTime: '00 55 07 * * 1,4', jobFunction: runInterestConfirmations, name: 'runInterestConfirmations' },
    // { cronTime: "00 56 08 * * *", jobFunction: tutoringMatchMaking}, // only scheduled manually, at the moment
    // every morning, but a little bit later
    // every 10 minutes during the day (to distribute load and send out notifications faster)
    { cronTime: '00 */10 * * * *', jobFunction: Notification.checkReminders, name: 'checkReminders' },
    // each night - database cleanups
    { cronTime: '00 00 05 * * *', jobFunction: anonymiseAttendanceLog, name: 'anonymiseAttendanceLog' },
    { cronTime: '00 00 04 * * *', jobFunction: cleanupSecrets, name: 'cleanupSecrets' },
    { cronTime: '00 00 01 * * *', jobFunction: dropOldNotificationContexts, name: 'dropOldNotificationContexts' },
    // Account redaction
    { cronTime: '00 00 01 * * *', jobFunction: deactivateInactiveAccounts, name: 'deactivateInactiveAccounts' },
    { cronTime: '00 00 02 * * *', jobFunction: redactInactiveAccounts, name: 'redactInactiveAccounts' },
    { cronTime: '00 00 02 * * *', jobFunction: sendInactivityNotification, name: 'sendInactivityNotification' },
    // Synch DB data to webflow CMS
    { cronTime: '00 */15 * * * *', jobFunction: syncToWebflow, name: 'syncToWebflow' },
    // Send Slack Messages monthly:
    { cronTime: '00 00 10 01 * *', jobFunction: postStatisticsToSlack, name: 'postStatisticsToSlack' },
    // Every night, trigger actions for courses that ended yesterday
    { cronTime: '00 00 10 * * *', jobFunction: notificationsEndedYesterday, name: 'notificationsEndedYesterday' },
];
