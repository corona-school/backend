import { getManager } from "typeorm";

import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import feedbackRequestJob from "./periodic/feedback-request";
import matchFollowUpJob from "./periodic/match-follow-up";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import projectMatchMaking from "./periodic/project-match-making";
import tutoringMatchMaking from "./periodic/tutoring-match-making";
import initialInterestConfirmationRequests from "./periodic/interest-confirmation-requests";
import interestConfirmationRequestReminders from "./periodic/interest-confirmation-request-reminders";
import redactInactiveAccounts from "./periodic/redact-inactive-accounts";
import dropOldNotificationContexts from "./periodic/drop-old-notification-contexts";
import anonymiseAttendanceLog from './periodic/anonymise-attendance-log';
import * as Notification from "../common/notification";
import { runInterestConfirmations } from "../common/match/pool";

// Run inside the Web Dyno via GraphQL (mutation _executeJob)
// Run inside the Job Dyno via npm run jobs -- --execute <jobName>
export const executeJob = async (job) => {
    switch (job) {
        case 'screeningReminderJob': {
            screeningReminderJob(getManager());
            break;
        }
        case 'courseReminderJob': {
            courseReminderJob(getManager());
            break;
        }
        case 'feedbackRequestJob': {
            feedbackRequestJob(getManager());
            break;
        }
        case 'matchFollowUpJob': {
            matchFollowUpJob(getManager());
            break;
        }
        case 'jufoVerificationInfo': {
            jufoVerificationInfo(getManager());
            break;
        }
        case 'projectMatchMaking': {
            projectMatchMaking(getManager());
            break;
        }
        case 'tutoringMatchMaking': {
            tutoringMatchMaking(getManager());
            break;
        }
        case 'InterestConfirmation': {
            runInterestConfirmations();
            break;
        }
        case 'Notification': {
            Notification.checkReminders();
            break;
        }
        case 'redactInactiveAccounts': {
            redactInactiveAccounts();
            break;
        }
        case 'dropOldNotificationContexts': {
            dropOldNotificationContexts();
            break;
        }
        case 'anonymiseAttendanceLog': {
            anonymiseAttendanceLog();
            break;
        }
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};
