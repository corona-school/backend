import { EntityManager } from "typeorm";
import { getLogger, Logger } from "log4js";
import mailjet from "../../../common/mails/mailjet";
import { Match } from "../../../common/entity/Match";
import { sendFeedbackRequestStudent, sendFeedbackRequestPupil } from "../../../common/mails/feedback-request";
import moment from "moment-timezone";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("FeedbackRequest job: looking for matches that were created 30 days ago");
    await sendFeedbackRequests(manager);
}

async function sendFeedbackRequests(manager: EntityManager) {
    const studentsToSendTo = await getStudentsForFeedbackRequest(manager);

    if (studentsToSendTo.length == 0) {
        logger.info("No feedback requests to send to students today");
    } else {
        await sendFeedbackRequestsToStudents(manager, studentsToSendTo);
    }

    const pupilsToSendTo = await getPupilsForFeedbackRequest(manager);

    if (pupilsToSendTo.length == 0) {
        logger.info("No feedback requests to send to pupils today");
    } else {
        await sendFeedbackRequestsToPupils(manager, pupilsToSendTo);
    }
}

async function getStudentsForFeedbackRequest(manager: EntityManager): Promise<Match[]> {
    const preselectedMatches = await manager
        .createQueryBuilder()
        .select("m")
        .from(Match, "m")
        .innerJoinAndSelect("m.student", "student")
        .innerJoinAndSelect("m.pupil", "pupil")
        .where("m.dissolved IS FALSE AND m.feedbackToStudentMail IS FALSE")
        .getMany();
    return filterMatches(preselectedMatches);
}

async function getPupilsForFeedbackRequest(manager: EntityManager): Promise<Match[]> {
    const preselectedMatches = await manager
        .createQueryBuilder()
        .select("m")
        .from(Match, "m")
        .innerJoinAndSelect("m.student", "student")
        .innerJoinAndSelect("m.pupil", "pupil")
        .where("m.dissolved IS FALSE and m.feedbackToPupilMail IS FALSE")
        .getMany();
    return filterMatches(preselectedMatches);
}

function filterMatches(matches: Match[]): Match[] {
    const now = new Date();
    const thirtyDaysAgo = moment(now).subtract(30, "days")
        .toDate();
    return matches.filter(m => {
        return m.createdAt <= thirtyDaysAgo;
    });
}

async function sendFeedbackRequestsToStudents(manager: EntityManager, matches: Match[]) {
    try {
        for (const m of matches) {
            await sendFeedbackRequestStudent(m.student, m.pupil);
            m.feedbackToStudentMail = true;
            await manager.save(Match, m);
        }
    } catch (e) {
        if (e.statusCode === mailjet.ErrorCodes.RATE_LIMIT) { //handle rate limit errors in mailjet
            logger.info("Hit rate limit while sending feedback requests to students -> the missing mails will be sent tomorrow...");
            return;
        }
        throw e;
    }
}

async function sendFeedbackRequestsToPupils(manager: EntityManager, matches: Match[]) {
    try {
        for (const m of matches) {
            await sendFeedbackRequestPupil(m.student, m.pupil);
            m.feedbackToPupilMail = true;
            await manager.save(Match, m);
        }
    } catch (e) {
        if (e.statusCode === mailjet.ErrorCodes.RATE_LIMIT) { //handle rate limit errors in mailjet
            logger.info("Hit rate limit while sending feedback requests to pupils -> the missing mails will be sent tomorrow...");
            return;
        }
        throw e;
    }
}