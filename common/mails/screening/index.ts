import { Student } from "../../entity/Student";
import { mailjetTemplates, sendTemplateMail } from "../index";

////////////////// TUTOR SCREENING

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

////////////////// INSTRUCTOR SCREENING

export async function sendFirstInstructorScreeningInvitationMail(instructor: Student) {
    const mail = mailjetTemplates.INSTRUCTORFIRSTSCREENINGINVITATION({
        instructorFirstName: instructor.firstname,
        selectAppointmentURL: instructor.instructorScreeningURL()
    });
    await sendTemplateMail(mail, instructor.email);
}

export async function sendInstructorScreeningInvitationReminderMail(instructor: Student) {
    const mail = mailjetTemplates.INSTRUCTORSCREENINGREMINDER({
        instructorFirstName: instructor.firstname,
        selectAppointmentURL: instructor.instructorScreeningURL()
    });
    await sendTemplateMail(mail, instructor.email);
}

////////////////// JUFO ALUMNI SCREENING

export async function sendFirstProjectCoachingJufoAlumniScreeningInvitationMail(coach: Student) {
    const mail = mailjetTemplates.PROJECTCOACHJUFOALUMNIFIRSTSCREENINGINVITATION({
        personFirstname: coach.firstname,
        confirmationURL: coach.screeningURL()
    });
    await sendTemplateMail(mail, coach.email);
}

export async function sendProjectCoachingJufoAlumniScreeningInvitationReminderMail(coach: Student) {
    const mail = mailjetTemplates.PROJECTCOACHJUFOALUMNISCREENINGREMINDER({
        personFirstname: coach.firstname,
        confirmationURL: coach.screeningURL()
    });
    await sendTemplateMail(mail, coach.email);
}