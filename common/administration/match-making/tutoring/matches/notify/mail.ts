import { EntityManager } from "typeorm";
import { Match } from "../../../../../entity/Match";
import { mailjetTemplates, sendTemplateMail } from "../../../../../mails";
import * as Notification from "../../../../../../common/notification";
import { getPupilGradeAsString } from "../../../../../../common/pupil";



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

export async function mailNotifyTuteeAboutMatch(match: Match, manager: EntityManager) {
    const { tutee, tutor, callURL, subjectsString } = await commonMailParameters(match);

    const mail = mailjetTemplates.TUTEENEWMATCH({
        pupilFirstname: tutee.firstname,
        studentFirstname: tutor.firstname,
        studentEmail: tutor.email,
        subjects: subjectsString,
        callURL: callURL
    });

    await sendTemplateMail(mail, tutee.email);
    await Notification.actionTaken(tutee, "tutee_matching_success", {
        uniqueId: `${tutor.id}`,
        student: tutor,
        subjects: subjectsString,
        callURL: callURL
    });
}

export async function mailNotifyTutorAboutMatch(match: Match, manager: EntityManager) {
    const { tutee, tutor, callURL, subjectsString } = await commonMailParameters(match);

    const mail = mailjetTemplates.TUTORNEWMATCH({
        pupilFirstname: tutee.firstname,
        personFirstname: tutor.firstname,
        pupilEmail: tutee.email,
        pupilGrade: `${tutee.gradeAsNumber()}. Klasse`,
        subjects: subjectsString,
        callURL: callURL
    });

    await sendTemplateMail(mail, tutor.email);
    await Notification.actionTaken(tutor, "tutor_matching_success", {
        uniqueId: `${tutee.id}`,
        pupil: tutee,
        pupilGrade: getPupilGradeAsString(tutee),
        subjects: subjectsString,
        callURL: callURL
    });
}