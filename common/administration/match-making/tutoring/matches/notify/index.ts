import { EntityManager } from "typeorm";
import { getLogger } from "../../../../../../common/util/logs";
import { Match } from "../../../../../entity/Match";
import { Pupil } from "../../../../../entity/Pupil";
import { Student } from "../../../../../entity/Student";
import { MatchNotificationStatus } from "../../types/notifications";
import { mailNotifyTuteeAboutMatch, mailNotifyTutorAboutMatch } from "./mail";

const logger = getLogger();


async function notifyMatch(match: Match, manager: EntityManager): Promise<MatchNotificationStatus> {
    try {
        await mailNotifyTuteeAboutMatch(match, manager);
    } catch (e) {
        return new MatchNotificationStatus(match, {
            affectedTutee: match.pupil,
            affectedTutor: match.student, //also affected, because she won't get notified if the first notification failed (that might change in the future)
            underlyingError: e
        });
    }

    //notify tutors part
    try {
        await mailNotifyTutorAboutMatch(match, manager);
    } catch (e) {
        return new MatchNotificationStatus(match, {
            affectedTutor: match.student, //now only the tutor is affected, because tutee notification above was successful
            underlyingError: e
        });
    }

    return new MatchNotificationStatus(match); //success
}


export async function notifyMatches(matches: Match[], manager: EntityManager) {
    const notificationStates: MatchNotificationStatus[] = [];
    for (const m of matches) {
        const state = await notifyMatch(m, manager);

        if (!state.isOK) {
            const affectedPersons: (Pupil | Student)[] = [state.error?.affectedTutee, state.error?.affectedTutor].filter(e => e);
            logger.warn(`Failed match (uuid: ${state.match.uuid}) notification to ${affectedPersons.map(p => p.email).join(", ")} through mail – ${state.error?.underlyingError?.message}`);
        }

        notificationStates.push(state);
    }
    return notificationStates;
}