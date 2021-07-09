import { EntityManager } from "typeorm";
import { ProjectMatch } from "../../../../entity/ProjectMatch";
import { getOfficialProjectFieldName } from "../../../../jufo/projectFields";
import { mailjetTemplates, sendTemplateMail } from "../../../../mails";
import * as Notification from "../../../../../common/notification";
import { getPupilGradeAsString } from "../../../../../common/pupil";



async function commonMailParameters(projectMatch: ProjectMatch) {
    const coachee = projectMatch.pupil;
    const coach = projectMatch.student;

    const callURL = projectMatch.jitsiLink();
    const projectFields = await projectMatch.overlappingProjectFields();
    const projectFieldsString = projectFields.map(getOfficialProjectFieldName).join("/");

    return {
        coachee,
        coach,
        callURL,
        projectFieldsString
    };
}

async function notifyCoacheeAboutMatch(projectMatch: ProjectMatch, manager: EntityManager) {
    const { coachee, coach, callURL, projectFieldsString } = await commonMailParameters(projectMatch);

    const mail = mailjetTemplates.COACHEENEWMATCH({
        coacheeFirstname: coachee.firstname,
        coachFirstname: coach.firstname,
        coachEmail: coach.email,
        subjects: projectFieldsString,
        callURL: callURL
    });

    await sendTemplateMail(mail, coachee.email);
    await Notification.actionTaken(coachee, "coachee_project_match_success", {
        uniqueId: `${coach.id}`,
        coach: coach,
        subjects: projectFieldsString,
        callURL: callURL
    });
}
async function notifyCoachAboutMatch(projectMatch: ProjectMatch, manager: EntityManager) {
    const { coachee, coach, callURL, projectFieldsString } = await commonMailParameters(projectMatch);

    const mail = mailjetTemplates.COACHNEWMATCH({
        coacheeFirstname: coachee.firstname,
        coachFirstname: coach.firstname,
        coacheeEmail: coachee.email,
        coacheeGrade: getPupilGradeAsString(coachee),
        subjects: projectFieldsString,
        callURL: callURL
    });

    await sendTemplateMail(mail, coach.email);
    await Notification.actionTaken(coach, "coach_project_match_success", {
        uniqueId: `${coachee.id}`,
        coachee: coachee,
        coacheeGrade: getPupilGradeAsString(coachee),
        subjects: projectFieldsString,
        callURL: callURL
    });
}

async function notifyMatch(projectMatch: ProjectMatch, manager: EntityManager) {
    //notify coachee part
    await notifyCoacheeAboutMatch(projectMatch, manager);

    //notify coaches part
    await notifyCoachAboutMatch(projectMatch, manager);
}

export async function notifyMatches(projectMatches: ProjectMatch[], manager: EntityManager) {
    await Promise.all(projectMatches.map(pm => notifyMatch(pm, manager)));
}