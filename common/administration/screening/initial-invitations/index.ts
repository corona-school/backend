import { EntityManager } from "typeorm";
import { Student } from "../../../entity/Student";
import { sendFirstScreeningInvitation } from "../../../mails/screening";


export async function sendFirstScreeningInvitationToStudent(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendFirstScreeningInvitation(student);

    //... store that in the database
    student.lastSentScreeningInvitationDate = new Date();

    manager.save(student);
}