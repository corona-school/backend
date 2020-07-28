import { EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";
import { sendScreeningReminderToStudent } from "../../../common/administration/screening/reminder";
import mailjet from "../../../common/mails/mailjet";
import { getLogger } from "log4js";

const logger = getLogger();

export async function sendToStudents(manager: EntityManager, students: Student[]) {
    try {
        for (const s of students) {
            // This will send a screening reminder to the given student and stores in database, that the reminder was sent (if it was sent successfully)
            await sendScreeningReminderToStudent(manager, s);
        }
    } catch (e) {
        if (e.statusCode === mailjet.ErrorCodes.RATE_LIMIT) { //handle rate limit errors in mailjet
            //TODO: probably handle rate limits better and schedule the invitations to a later time (but this actually applies to all emails)...
            logger.info("Hit rate limit while sending screening invitations to students -> the missing reminders will be send tomorrow...");
            return;
        }
        throw e;
    }
}