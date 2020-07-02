import { Student } from "../../entity/Student";
import { mailjetTemplates, sendTemplateMail } from "../index";

/// Use this function to send the first screening invitation mail to the student
export async function sendFirstScreeningInvitationMail(student: Student) {
    const mail = mailjetTemplates.STUDENTFIRSTSCREENINGINVITATION({
        personFirstname: student.firstname,
        confirmationURL: student.screeningURL()
    });
    await sendTemplateMail(mail, student.email);
}

/// Use this function to send a screening reminder mail to the student
export async function sendScreeningInvitationReminderMail(student: Student) {
    const mail = mailjetTemplates.STUDENTSCREENINGREMINDER({
        personFirstname: student.firstname,
        confirmationURL: student.screeningURL()
    });
    await sendTemplateMail(mail, student.email);
}

export async function sendFirstInstructorScreeningInvitationMail(instructor: Student) {
    const mail = mailjetTemplates.INSTRUCTORFIRSTSCREENINGINVITATION({
        instructorFirstName: instructor.firstname,
        selectAppointmentURL: instructor.instructorScreeningURL()
    });
    await sendTemplateMail(mail, instructor.email);
}