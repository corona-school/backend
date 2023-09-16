import { mailjetTemplates, sendTemplateMail } from '../index';
import { student as Student } from '@prisma/client';

export const SCREENING_USER_URL = 'https://authentication.lern-fair.de/';

/// Use this function to send a screening reminder mail to the student
export async function sendScreeningInvitationReminderMail(student: Student) {
    const mail = mailjetTemplates.STUDENTSCREENINGREMINDER({
        personFirstname: student.firstname,
        confirmationURL: SCREENING_USER_URL,
    });
    await sendTemplateMail(mail, student.email);
}

export async function sendInstructorScreeningInvitationReminderMail(instructor: Student) {
    const mail = mailjetTemplates.INSTRUCTORSCREENINGREMINDER({
        instructorFirstName: instructor.firstname,
        confirmationURL: SCREENING_USER_URL,
    });
    await sendTemplateMail(mail, instructor.email);
}
