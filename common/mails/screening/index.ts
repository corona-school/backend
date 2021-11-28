import { Student } from "../../entity/Student";
import { mailjetTemplates, sendTemplateMail } from "../index";
import { student as PrismaStudent } from "@prisma/client";
////////////////// TUTOR SCREENING

/// Use this function to send the first screening invitation mail to the student
export async function sendFirstScreeningInvitationMail(student: Student | PrismaStudent) {
    const mail = mailjetTemplates.STUDENTFIRSTSCREENINGINVITATION({
        personFirstname: student.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, student.email);
}

/// Use this function to send a screening reminder mail to the student
export async function sendScreeningInvitationReminderMail(student: Student | PrismaStudent) {
    const mail = mailjetTemplates.STUDENTSCREENINGREMINDER({
        personFirstname: student.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, student.email);
}

////////////////// INSTRUCTOR SCREENING

export async function sendFirstInstructorScreeningInvitationMail(instructor: Student | PrismaStudent) {
    const mail = mailjetTemplates.INSTRUCTORFIRSTSCREENINGINVITATION({
        instructorFirstName: instructor.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, instructor.email);
}

export async function sendInstructorScreeningInvitationReminderMail(instructor: Student | PrismaStudent) {
    const mail = mailjetTemplates.INSTRUCTORSCREENINGREMINDER({
        instructorFirstName: instructor.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, instructor.email);
}

////////////////// JUFO ALUMNI SCREENING

export async function sendFirstProjectCoachingJufoAlumniScreeningInvitationMail(coach: Student | PrismaStudent) {
    const mail = mailjetTemplates.PROJECTCOACHJUFOALUMNIFIRSTSCREENINGINVITATION({
        personFirstname: coach.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, coach.email);
}

export async function sendProjectCoachingJufoAlumniScreeningInvitationReminderMail(coach: Student | PrismaStudent) {
    const mail = mailjetTemplates.PROJECTCOACHJUFOALUMNISCREENINGREMINDER({
        personFirstname: coach.firstname,
        confirmationURL: "https://authentication.lern-fair.de/"
    });
    await sendTemplateMail(mail, coach.email);
}