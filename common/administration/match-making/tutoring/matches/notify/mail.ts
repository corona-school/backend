import { EntityManager } from "typeorm";
import { Match } from "../../../../../entity/Match";
import { mailjetTemplates, sendTemplateMail } from "../../../../../mails";
import * as Notification from "../../../../../../common/notification";
import { getPupilGradeAsString } from "../../../../../../common/pupil";
import { prisma } from "../../../../../../common/prisma";



async function commonMailParameters(match: Match) {
    const tutee = match.pupil;
    const tutor = match.student;

    const callURL = match.jitsiLink();
    const subjects = await match.overlappingSubjects();
    const subjectsString = subjects.map(s => s.name).join("/");

    return {
        tutee,
        tutor,
        callURL,
        subjectsString
    };
}

export async function mailNotifyTuteeAboutMatch(match: Match, manager: EntityManager, matchHash: string) {
    const { tutee, tutor, callURL, subjectsString } = await commonMailParameters(match);

    const firstMatch = await prisma.match.count({ where: { pupilId: tutee.id } }) === 1;

    const mail = mailjetTemplates.TUTEENEWMATCH({
        pupilFirstname: tutee.firstname,
        studentFirstname: tutor.firstname,
        studentEmail: tutor.email,
        subjects: subjectsString,
        callURL
    });

    await sendTemplateMail(mail, tutee.email);
    await Notification.actionTaken(tutee, "tutee_matching_success", {
        uniqueId: "" + match.id,
        student: tutor,
        subjects: subjectsString,
        callURL,
        firstMatch,
        matchHash
    });
}

export async function mailNotifyTutorAboutMatch(match: Match, manager: EntityManager, matchHash: string) {
    const { tutee, tutor, callURL, subjectsString } = await commonMailParameters(match);

    const firstMatch = await prisma.match.count({ where: { studentId: tutor.id } }) === 1;

    const mail = mailjetTemplates.TUTORNEWMATCH({
        pupilFirstname: tutee.firstname,
        personFirstname: tutor.firstname,
        pupilEmail: tutee.email,
        pupilGrade: `${tutee.gradeAsNumber()}. Klasse`,
        subjects: subjectsString,
        callURL
    });

    await sendTemplateMail(mail, tutor.email);
    await Notification.actionTaken(tutor, "tutor_matching_success", {
        uniqueId: "" + match.id,
        pupil: tutee,
        pupilGrade: getPupilGradeAsString(tutee),
        subjects: subjectsString,
        callURL,
        firstMatch,
        matchHash
    });
}