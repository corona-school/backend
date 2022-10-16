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
import * as Notification from "../common/notification";
import deactivateMissingCoc from "./periodic/deactivate-missing-coc";

export const executeJob = async (job) => {
    switch (job) {
        case 'initialInterestConfirmationRequests': {
            initialInterestConfirmationRequests(getManager());
            break;
        }
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
        case 'interestConfirmationRequestReminders': {
            interestConfirmationRequestReminders(getManager());
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
        default: {
            throw new Error(`Did not find job ${job}`);
        }
    }
};