import { EntityManager } from "typeorm";
import { Student } from "../../../entity/Student";
import { sendScreeningInvitationReminderMail } from "../../../mails/screening";


export async function sendScreeningReminderToStudent(manager: EntityManager, student: Student) {
    //send actual mail...
    await sendScreeningInvitationReminderMail(student);

    //...store that in database
    student.lastSentScreeningInvitationDate = new Date();
    student.sentScreeningReminderCount += 1;

    await manager.save(student);
}