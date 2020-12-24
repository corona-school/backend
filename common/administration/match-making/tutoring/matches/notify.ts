import { EntityManager } from "typeorm";
import { Match } from "../../../../entity/Match";
import { mailjetTemplates, sendTemplateMail } from "../../../../mails";


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

async function notifyTuteeAboutMatch(match: Match, manager: EntityManager) {
    const { tutee, tutor, callURL, subjectsString } = await commonMailParameters(match);

    const mail = mailjetTemplates.TUTEENEWMATCH({
        pupilFirstname: tutee.firstname,
        studentFirstname: tutor.firstname,
        studentEmail: tutor.email,
        subjects: subjectsString,
        callURL: callURL
    });

    await sendTemplateMail(mail, tutee.email);
}
async function notifyTutorAboutMatch(match: Match, manager: EntityManager) {
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
}

async function notifyMatch(match: Match, manager: EntityManager) {
    //notify tutee part
    await notifyTuteeAboutMatch(match, manager);

    //notify tutors part
    await notifyTutorAboutMatch(match, manager);
}

export async function notifyMatches(matches: Match[], manager: EntityManager) {
    await Promise.all(matches.map(m => notifyMatch(m, manager)));
}