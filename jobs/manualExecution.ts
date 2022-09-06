import { createConnection } from "typeorm";

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
import * as Notification from "../common/notification";
import deactivateMissingCoc from "./periodic/deactivate-missing-coc";
import { setup as setupLogging } from "./utils/logging";
import { Mutex } from "async-mutex";

const job = process.argv[2];

setupLogging();

const executeJob = async (job) => {
    const activeConnectionMutex = new Mutex();
    const release = await activeConnectionMutex.acquire();
    const jobConnection = await createConnection();
    release();

    switch (job) {
        case 'initialInterestConfirmationRequests': {
            initialInterestConfirmationRequests(jobConnection.manager);
            break;
        }
        case 'screeningReminderJob': {
            screeningReminderJob(jobConnection.manager);
            break;
        }
        case 'courseReminderJob': {
            courseReminderJob(jobConnection.manager);
            break;
        }
        case 'feedbackRequestJob': {
            feedbackRequestJob(jobConnection.manager);
            break;
        }
        case 'matchFollowUpJob': {
            matchFollowUpJob(jobConnection.manager);
            break;
        }
        case 'jufoVerificationInfo': {
            jufoVerificationInfo(jobConnection.manager);
            break;
        }
        case 'projectMatchMaking': {
            projectMatchMaking(jobConnection.manager);
            break;
        }
        case 'tutoringMatchMaking': {
            tutoringMatchMaking(jobConnection.manager);
            break;
        }
        case 'interestConfirmationRequestReminders': {
            interestConfirmationRequestReminders(jobConnection.manager);
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
            redactInactiveAccounts(jobConnection.manager);
            break;
        }
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};

executeJob(job);