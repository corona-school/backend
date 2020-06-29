import { EntityManager } from "typeorm";
import { getLogger, Logger } from "log4js";
import mailjet from "../../../common/mails/mailjet";
import { Match } from "../../../common/entity/Match";
import { sendMatchFollowUpStudent, sendMatchFollowUpPupil } from "../../../common/mails/match-follow-up";
import * as moment from "moment";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("Follow-Up job: looking for matches that were created 7 days ago");
    await sendMatchFollowUps(manager);
}

async function sendMatchFollowUps(manager: EntityManager) {
    const studentsToSendTo = await getStudentsForFollowUps(manager);

    if (studentsToSendTo.length == 0) {
        logger.info("No match follow-ups to send to students today");
    } else {
        await sendFollowUpsToStudents(manager, studentsToSendTo);
    }

    const pupilsToSendTo = await getPupilsForFollowUps(manager);

    if (pupilsToSendTo.length == 0) {
        logger.info("No match follow-ups to send to pupils today");
    } else {
        await sendFollowUpsToPupils(manager, pupilsToSendTo);
    }
}

async function getStudentsForFollowUps(manager: EntityManager): Promise<Match[]> {
    const preselectedMatches = await manager
        .createQueryBuilder()
        .select("m")
        .from(Match, "m")
        .innerJoinAndSelect("m.student", "student")
        .innerJoinAndSelect("m.pupil", "pupil")
        .where("m.dissolved IS FALSE AND m.followUpToStudentMail IS FALSE")
        .getMany();
    return filterMatches(preselectedMatches);
}

async function getPupilsForFollowUps(manager: EntityManager): Promise<Match[]> {
    const preselectedMatches = await manager
        .createQueryBuilder()
        .select("m")
        .from(Match, "m")
        .innerJoinAndSelect("m.student", "student")
        .innerJoinAndSelect("m.pupil", "pupil")
        .where("m.dissolved IS FALSE and m.followUpToPupilMail IS FALSE")
        .getMany();
    return filterMatches(preselectedMatches);
}

function filterMatches(matches: Match[]): Match[] {
    const now = new Date();
    const sevenDaysAgo = moment(now).subtract(7, "days").toDate();
    return matches.filter(m => {
        return m.createdAt <= sevenDaysAgo;
    });
}

async function sendFollowUpsToStudents(manager: EntityManager, matches: Match[]) {
    try {
        for (const m of matches) {
            sendMatchFollowUpStudent(m.student, m.pupil);
            m.followUpToStudentMail = true;
            await manager.save(Match, m);
        }
    }
    catch (e) {
        if (e.statusCode === mailjet.ErrorCodes.RATE_LIMIT) { //handle rate limit errors in mailjet
            logger.info("Hit rate limit while sending follow-ups to students -> the missing mails will be sent tomorrow...");
            return;
        }
        throw e;
    }
}

async function sendFollowUpsToPupils(manager: EntityManager, matches: Match[]) {
    try {
        for (const m of matches) {
            sendMatchFollowUpPupil(m.student, m.pupil);
            m.followUpToPupilMail = true;
            await manager.save(Match, m);
        }
    }
    catch (e) {
        if (e.statusCode === mailjet.ErrorCodes.RATE_LIMIT) { //handle rate limit errors in mailjet
            logger.info("Hit rate limit while sending follow-ups to pupils -> the missing mails will be sent tomorrow...");
            return;
        }
        throw e;
    }
}