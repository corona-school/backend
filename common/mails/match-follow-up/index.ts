import { mailjetTemplates, sendTemplateMail } from "../index";
import { Student } from "../../entity/Student";
import { Pupil } from "../../entity/Pupil";

export async function sendMatchFollowUpStudent(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.STUDENTMATCHFOLLOWUP({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, student.email);
}

export async function sendMatchFollowUpPupil(student: Student, pupil: Pupil) {
    const mail = mailjetTemplates.PUPILMATCHFOLLOWUP({
        studentFirstName: student.firstname,
        pupilFirstName: pupil.firstname
    });
    await sendTemplateMail(mail, pupil.email);
}