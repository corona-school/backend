import redactInactiveAccounts from './periodic/redact-inactive-accounts';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import syncToWebflow from './periodic/sync-to-webflow';
import notificationCoursesEndedYesterday from './periodic/notification-courses-ended-yesterday';
import * as Notification from '../common/notification';
import { runInterestConfirmations } from '../common/match/pool';
import migrateDissolveReasonEnum from './migrate-dissolve-reason-enum';
import flagInactiveConversationsAsReadonly from './periodic/flag-old-conversations';
import { postStatisticsToSlack } from './slack-statistics';
import { sendInactivityNotification } from './periodic/redact-inactive-accounts/send-inactivity-notification';
import { deactivateInactiveAccounts } from './periodic/redact-inactive-accounts/deactivate-inactive-accounts';

// Run inside the Web Dyno via GraphQL (mutation _executeJob)
// Run inside the Job Dyno via npm run jobs --execute <jobName
export const executeJob = async (job) => {
    switch (job) {
        case 'InterestConfirmation': {
            await runInterestConfirmations();
            break;
        }
        case 'Notification': {
            await Notification.checkReminders();
            break;
        }
        case 'redactInactiveAccounts': {
            await redactInactiveAccounts();
            break;
        }
        case 'sendInactivityNotification': {
            await sendInactivityNotification();
            break;
        }
        case 'deactivateInactiveAccounts': {
            await deactivateInactiveAccounts();
            break;
        }
        case 'dropOldNotificationContexts': {
            await dropOldNotificationContexts();
            break;
        }
        case 'anonymiseAttendanceLog': {
            await anonymiseAttendanceLog();
            break;
        }
        case 'syncToWebflow': {
            await syncToWebflow();
            break;
        }
        case 'flagOldConversations': {
            await flagInactiveConversationsAsReadonly();
            break;
        }
        case 'sendSlackStatistics': {
            await postStatisticsToSlack();
            break;
        }
        case 'notificationCoursesEndedYesterday': {
            await notificationCoursesEndedYesterday();
            break;
        }
        case 'migrateDissolveReasonEnum': {
            await migrateDissolveReasonEnum();
            break;
        }
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};
