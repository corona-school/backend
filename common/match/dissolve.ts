import { match as Match, pupil as Pupil, student as Student } from "@prisma/client";
import { sendTemplateMail, mailjetTemplates } from "../mails";
import { TemplateMail } from "../mails/templates";
import { getLogger } from "log4js";
import { prisma } from "../prisma";

const logger = getLogger("Match");

export async function dissolveMatch(match: Match, dissolveReason: number, dissolver: Pupil | Student) {
    await prisma.match.update({
        where: { id: match.id },
        data: {
            dissolved: true,
            dissolveReason
        }
    });

    // Send notification mail to partner
    try {
        if ((dissolver as Student).isStudent) {
            const pupil = await prisma.pupil.findUnique({ where: { id: match.pupilId }});
            await sendTemplateMail(
                mailjetTemplates.PUPILMATCHDISSOLVED({
                    studentFirstname: dissolver.firstname,
                    pupilFirstname: pupil.firstname
                }),
                pupil.email
            );
        } else {
            const student = await prisma.pupil.findUnique({ where: { id: match.studentId }});
            await sendTemplateMail(
                mailjetTemplates.STUDENTMATCHDISSOLVED({
                    studentFirstname: student.firstname,
                    pupilFirstname: dissolver.firstname
                }),
                student.email
            );
        }
    } catch (e) {
        logger.error("Can't send match dissolved mail: ", e);
    }
}
