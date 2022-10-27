import { getManager } from "typeorm";

import screeningReminderJob from "./periodic/screening-reminder";
import courseReminderJob from "./periodic/course-reminder";
import jufoVerificationInfo from "./periodic/jufo-verification-info";
import redactInactiveAccounts from "./periodic/redact-inactive-accounts";
import dropOldNotificationContexts from "./periodic/drop-old-notification-contexts";
import * as Notification from "../common/notification";
import deactivateMissingCoc from "./periodic/deactivate-missing-coc";
import { runInterestConfirmations } from "../common/match/pool";

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
        case 'jufoVerificationInfo': {
            jufoVerificationInfo(getManager());
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
        case 'deactivateMissingCoc': {
            deactivateMissingCoc();
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
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};