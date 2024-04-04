import { runInterestConfirmations } from '../common/match/pool';
import { checkReminders } from '../common/notification';
import { cleanupSecrets } from '../common/secret';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import flagInactiveConversationsAsReadonly from './periodic/flag-old-conversations';
import redactInactiveAccounts from './periodic/redact-inactive-accounts';
import { deactivateInactiveAccounts } from './periodic/redact-inactive-accounts/deactivate-inactive-accounts';
import { sendInactivityNotification } from './periodic/redact-inactive-accounts/send-inactivity-notification';
import syncToWebflow from './periodic/sync-to-webflow';
import { postStatisticsToSlack } from './slack-statistics';
import notificationsEndedYesterday from './periodic/notification-courses-ended-yesterday';
import { assignOriginalAchievement } from './manual/assign_original_achievement';
import migrateDissolveReasonEnum from './migrate-dissolve-reason-enum';
export const allJobs = {
    cleanupSecrets,
    dropOldNotificationContexts,
    runInterestConfirmations,
    anonymiseAttendanceLog,
    syncToWebflow,
    postStatisticsToSlack,
    redactInactiveAccounts,
    sendInactivityNotification,
    deactivateInactiveAccounts,
    flagInactiveConversationsAsReadonly,
    notificationsEndedYesterday,
    checkReminders,
    migrateDissolveReasonEnum,

    assignOriginalAchievement,

    // For Integration Tests only:
    NOTHING_DO_NOT_USE: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    },
} as const;

export type JobName = keyof typeof allJobs;
export const jobExists = (name: string): name is JobName => name in allJobs;

// A list of all jobs that should be scheduled at the moment
export type ScheduledJob = { cronTime: string; name: JobName };
export const regularJobs: ScheduledJob[] = [
    // every morning, quite early
    { cronTime: '00 55 07 * * *', name: 'runInterestConfirmations' },
    // every morning, but a little bit later
    // every 10 minutes during the day (to distribute load and send out notifications faster)
    { cronTime: '00 */10 * * * *', name: 'checkReminders' },
    // each night - database cleanups
    { cronTime: '00 00 05 * * *', name: 'anonymiseAttendanceLog' },
    { cronTime: '00 00 04 * * *', name: 'cleanupSecrets' },
    { cronTime: '00 00 01 * * *', name: 'dropOldNotificationContexts' },
    // Account redaction
    { cronTime: '00 00 01 * * *', name: 'deactivateInactiveAccounts' },
    { cronTime: '00 00 02 * * *', name: 'redactInactiveAccounts' },
    { cronTime: '00 00 02 * * *', name: 'sendInactivityNotification' },
    // Synch DB data to webflow CMS
    { cronTime: '00 */15 * * * *', name: 'syncToWebflow' },
    // Send Slack Messages monthly:
    { cronTime: '00 00 10 01 * *', name: 'postStatisticsToSlack' },
    // Disable old chats on a daily basis:
    { cronTime: '00 00 10 * * *', name: 'flagInactiveConversationsAsReadonly' },
    // Every night, trigger actions for courses that ended yesterday
    { cronTime: '00 00 10 * * *', name: 'notificationsEndedYesterday' },
];
