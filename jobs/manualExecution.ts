import { getManager } from 'typeorm';

import screeningReminderJob from './periodic/screening-reminder';
import courseReminderJob from './periodic/course-reminder';
import redactInactiveAccounts from './periodic/redact-inactive-accounts';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import syncToWebflow from './periodic/sync-to-webflow';
import * as Notification from '../common/notification';
import { runInterestConfirmations } from '../common/match/pool';
import migrateLecturesToAppointment from './migrate-lectures-to-appointment';
import { postStatisticsToSlack } from './slack-statistics';

// Run inside the Web Dyno via GraphQL (mutation _executeJob)
// Run inside the Job Dyno via npm run jobs --execute <jobName
export const executeJob = async (job) => {
    switch (job) {
        case 'screeningReminderJob': {
            await screeningReminderJob(getManager());
            break;
        }
        case 'courseReminderJob': {
            await courseReminderJob(getManager());
            break;
        }
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
        case 'dropOldNotificationContexts': {
            await dropOldNotificationContexts();
            break;
        }
        case 'anonymiseAttendanceLog': {
            await anonymiseAttendanceLog();
            break;
        }
        case 'syncToWebflow':
            await syncToWebflow();
            break;
        case 'migrateLecturesToAppointment': {
            await migrateLecturesToAppointment();
            break;
        }
        case 'sendSlackStatistics': {
            await postStatisticsToSlack();
            break;
        }
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};
