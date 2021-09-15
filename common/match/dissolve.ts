import { match as Match, pupil as Pupil, student as Student } from "@prisma/client";
import { sendTemplateMail, mailjetTemplates } from "../mails";
import { getLogger } from "log4js";
import { prisma } from "../prisma";
import { isStudent, isPupil } from "../user";
import { logTransaction } from "../transactionlog/log";

const logger = getLogger("Match");

export async function dissolveMatch(match: Match, dissolveReason: number, dissolver: Pupil | Student | null) {
    if (match.dissolved) {
        throw new Error("The match was already dissolved");
    }

    await prisma.match.update({
        where: { id: match.id },
        data: {
            dissolved: true,
            dissolveReason
        }
    });

    await logTransaction("matchDissolve", dissolver, {
        matchId: match.id
    });

    logger.info(`Match(${match.id}) was dissolved by ${dissolver?.firstname ?? "an admin"}`);

    try {
        if (dissolver && isStudent(dissolver)) {
            if (dissolver.id !== match.studentId) {
                throw new Error(`The Dissolver(${dissolver.id}) does not match the Student(${match.studentId}) when dissolving the Match`);
            }

            const pupil = await prisma.pupil.findUnique({ where: { id: match.pupilId }});
            await sendTemplateMail(
                mailjetTemplates.PUPILMATCHDISSOLVED({
                    studentFirstname: dissolver.firstname,
                    pupilFirstname: pupil.firstname
                }),
                pupil.email
            );
        } else if (dissolver && isPupil(dissolver)) {
            if (dissolver.id !== match.pupilId) {
                throw new Error(`The Dissolver(${dissolver.id}) does not match the Student(${match.pupilId}) when dissolving the Match`);
            }

            const student = await prisma.pupil.findUnique({ where: { id: match.studentId }});
            await sendTemplateMail(
                mailjetTemplates.STUDENTMATCHDISSOLVED({
                    studentFirstname: student.firstname,
                    pupilFirstname: dissolver.firstname
                }),
                student.email
            );
        } else if (dissolver === null) { // dissolved by an admin
            const student = await prisma.student.findUnique({ where: { id: match.studentId }});
            const pupil = await prisma.pupil.findUnique({ where: { id: match.pupilId }});

            await sendTemplateMail(
                mailjetTemplates.PUPILMATCHDISSOLVED({
                    studentFirstname: student.firstname,
                    pupilFirstname: pupil.firstname
                }),
                pupil.email
            );

            await sendTemplateMail(
                mailjetTemplates.STUDENTMATCHDISSOLVED({
                    studentFirstname: student.firstname,
                    pupilFirstname: pupil.firstname
                }),
                student.email
            );
        } else {
            throw new Error("Dissolver was neither student nor pupil nor admin");
        }
    } catch (error) {
        logger.error("Can't send match dissolved mail: ", error);
    }
}
