import { mailjetTemplates, sendTemplateMail } from "../index";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";
import * as Notification from "../../../common/notification";

export async function sendFeedbackRequestStudent(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.STUDENTREQUESTFEEDBACK({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, student.email);
    await Notification.actionTaken(student, "feedback_request_student", {
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
}

export async function sendFeedbackRequestPupil(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.PUPILREQUESTFEEDBACK({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, pupil.email);
    await Notification.actionTaken(student, "feedback_request_pupil", {
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
}