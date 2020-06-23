import { mailjetTemplates, sendTemplateMail } from "../index";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export async function sendFeedbackRequestStudent(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.STUDENTREQUESTFEEDBACK({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, student.email);
}

export async function sendFeedbackRequestPupil(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.PUPILREQUESTFEEDBACK({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, pupil.email);
}