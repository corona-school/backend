import { Student } from "../../entity/Student";
import { mailjetTemplates, sendTemplateMail } from "../index";

/// Use this function to send the first screening invitation mail to the student
export async function sendFirstScreeningInvitation(student: Student) {
    const mail = mailjetTemplates.STUDENTFIRSTSCREENINGINVITATION({
        personFirstname: student.firstname,
        confirmationURL: student.screeningURL(),
    });
    await sendTemplateMail(mail, student.email);
}
