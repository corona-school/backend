import { EntityManager } from "typeorm";
import { getLogger } from "../../../../../../jobs/utils/logging";
import { Match } from "../../../../../entity/Match";
import { Pupil } from "../../../../../entity/Pupil";
import { Student } from "../../../../../entity/Student";
import { NotificationType, NotificationOptions, MatchNotificationStatus } from "../../types/notifications";
import { mailNotifyTuteeAboutMatch, mailNotifyTutorAboutMatch } from "./mail";

const logger = getLogger();


type NotificationFunction = (match: Match, manager: EntityManager) => Promise<void>;
type NotificationFunctions = {
    [NotificationType.sms]: NotificationFunction;
    [NotificationType.email]: NotificationFunction;
};

const notificationFunctionMapping: {
    tutors: NotificationFunctions;
    tutees: NotificationFunctions;
} = {
    tutors: {
        sms: async () => {throw new Error("NOT YET IMPLEMENTED");}, //TODO
        email: mailNotifyTutorAboutMatch
    },
    tutees: {
        sms: async () => {throw new Error("NOT YET IMPLEMENTED");}, //TODO
        email: mailNotifyTuteeAboutMatch
    }
};

async function notifyMatchThroughNotificationType(match: Match, notificationType: NotificationType, manager: EntityManager): Promise<MatchNotificationStatus> {
    const tuteeNotificationFunctions = notificationFunctionMapping.tutees;
    const tutorNotificationFunctions = notificationFunctionMapping.tutors;

    //notify tutee part
    try {
        await tuteeNotificationFunctions[notificationType](match, manager);
    }
    catch (e) {
        return new MatchNotificationStatus(match, notificationType, {
            affectedTutee: match.pupil,
            affectedTutor: match.student, //also affected, because she won't get notified if the first notification failed (that might change in the future)
            underlyingError: e
        });
    }

    //notify tutors part
    try {
        await tutorNotificationFunctions[notificationType](match, manager);
    }
    catch (e) {
        return new MatchNotificationStatus(match, notificationType, {
            affectedTutor: match.student, //now only the tutor is affected, because tutee notification above was successful
            underlyingError: e
        });
    }

    return new MatchNotificationStatus(match, notificationType); //success
}

async function notifyMatch(match: Match, notificationOptions: NotificationOptions, manager: EntityManager): Promise<MatchNotificationStatus[]> {
    const notificationStates: MatchNotificationStatus[] = [];

    //send all notifications, differentiating the type
    for (let [type, shouldNotify] of Object.entries(notificationOptions) as [keyof typeof notificationOptions, boolean][]) {
        if (shouldNotify) {
            const notificationStatus = await notifyMatchThroughNotificationType(match, type, manager);
            //Don't return im case of a failed notification. Continue trying the other notification ways, reasons:
            // * If sms delivery to tutee failed, it will not try to deliver sms to tutor. So it will continue to try to inform matches via email. If then the email delivery to tutee failed as well, it will not try to deliver email to tutor, so this results in no notifications at all.
            // * If sms delivery to tutee succeeded, but failed for tutee, it will log the sms error for the tutee but try to continue sending email notifications as well, such that the tutee may receive the notification via email.
            notificationStates.push(notificationStatus);
        }
    }

    return notificationStates;
}

export async function notifyMatches(matches: Match[], notificationOptions: NotificationOptions, manager: EntityManager) {
    const notificationStates: MatchNotificationStatus[] = [];
    for (const m of matches) {
        //notify match
        const resultedNotificationStates = await notifyMatch(m, notificationOptions, manager);

        //print possible errors to log
        resultedNotificationStates.filter(ns => !ns.isOK).forEach(ns => {
            const affectedPersons: (Pupil | Student)[] = [ns.error?.affectedTutee, ns.error?.affectedTutor].filter(e => e);
            logger.warn(`Failed match (uuid: ${ns.match.uuid}) notification to ${affectedPersons.map(p => p.email).join(", ")} through ${ns.type} way – ${ns.error?.underlyingError?.message}`);
        });

        notificationStates.push(...resultedNotificationStates);
    }
    return notificationStates;
}