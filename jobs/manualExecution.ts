import { getManager } from 'typeorm';

import screeningReminderJob from './periodic/screening-reminder';
import courseReminderJob from './periodic/course-reminder';
import feedbackRequestJob from './periodic/feedback-request';
import matchFollowUpJob from './periodic/match-follow-up';
import jufoVerificationInfo from './periodic/jufo-verification-info';
import projectMatchMaking from './periodic/project-match-making';
import tutoringMatchMaking from './periodic/tutoring-match-making';
import redactInactiveAccounts from './periodic/redact-inactive-accounts';
import dropOldNotificationContexts from './periodic/drop-old-notification-contexts';
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import syncToWebflow from './periodic/sync-to-webflow';
import * as Notification from '../common/notification';
import { runInterestConfirmations } from '../common/match/pool';

// Run inside the Web Dyno via GraphQL (mutation _executeJob)
// Run inside the Job Dyno via npm run jobs --execute <jobName
export const executeJob = async (job) => {
    switch (job) {
        case 'screeningReminderJob': {
            void screeningReminderJob(getManager());
            break;
        }
        case 'courseReminderJob': {
            void courseReminderJob(getManager());
            break;
        }
        case 'feedbackRequestJob': {
            void feedbackRequestJob(getManager());
            break;
        }
        case 'matchFollowUpJob': {
            void matchFollowUpJob(getManager());
            break;
        }
        case 'jufoVerificationInfo': {
            void jufoVerificationInfo(getManager());
            break;
        }
        case 'projectMatchMaking': {
            void projectMatchMaking(getManager());
            break;
        }
        case 'tutoringMatchMaking': {
            void tutoringMatchMaking(getManager());
            break;
        }
        case 'InterestConfirmation': {
            void runInterestConfirmations();
            break;
        }
        case 'Notification': {
            void Notification.checkReminders();
            break;
        }
        case 'redactInactiveAccounts': {
            void redactInactiveAccounts();
            break;
        }
        case 'dropOldNotificationContexts': {
            void dropOldNotificationContexts();
            break;
        }
        case 'anonymiseAttendanceLog': {
            void anonymiseAttendanceLog();
            break;
        }
        case 'syncToWebflow':
            void syncToWebflow();
            break;
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};
