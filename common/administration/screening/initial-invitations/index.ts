import { EntityManager } from "typeorm";
import { Student } from "../../../entity/Student";
import { sendFirstScreeningInvitationMail, sendFirstInstructorScreeningInvitationMail } from "../../../mails/screening";


export async function sendFirstScreeningInvitationToTutor(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendFirstScreeningInvitationMail(student);

    //... store that in the database
    student.lastSentScreeningInvitationDate = new Date();

    await manager.save(student);
}

export async function sendFirstScreeningInvitationToInstructor(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendFirstInstructorScreeningInvitationMail(student);

    //... store that in the database
    student.lastSentInstructorScreeningInvitationDate = new Date();

    await manager.save(student);
}