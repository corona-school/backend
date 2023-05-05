import { EntityManager } from "typeorm";
import { Student } from "../../../entity/Student";
import { sendInstructorScreeningInvitationReminderMail, sendProjectCoachingJufoAlumniScreeningInvitationReminderMail, sendScreeningInvitationReminderMail } from "../../../mails/screening";


export async function sendTutorScreeningReminderToStudent(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendScreeningInvitationReminderMail(student);

    //...store that in database
    student.lastSentScreeningInvitationDate = new Date();
    student.sentScreeningReminderCount += 1;

    await manager.save(student);
}

export async function sendInstructorScreeningReminderToStudent(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendInstructorScreeningInvitationReminderMail(student);

    //...store that in database
    student.lastSentInstructorScreeningInvitationDate = new Date();
    student.sentInstructorScreeningReminderCount += 1;

    await manager.save(student);
}

export async function sendJufoAlumniScreeningReminderToStudent(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendProjectCoachingJufoAlumniScreeningInvitationReminderMail(student);

    //...store that in database
    student.lastSentJufoAlumniScreeningInvitationDate = new Date();
    student.sentJufoAlumniScreeningReminderCount += 1;

    await manager.save(student);
}