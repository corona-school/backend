import { getStudentsToRemindAtDate } from "./remindees";
import { EntityManager } from "typeorm";
import { shouldRemindAtDate } from "./timecontrol";
import { getLogger } from "log4js";
import { sendToStudents } from "./send";

const logger = getLogger();

/// Will remind all students, that should be reminded now.
/// It is possible that no one will get reminded, for example due to public holidays etc.
export async function remindAllThatShouldBeRemindedNow(manager: EntityManager) {
    const now = new Date();

    //prevent reminders, if there's a public holiday today
    if (!shouldRemindAtDate(now)) {
        logger.info("---> Will not send screening reminders today!");
        return;
    }


    //get all students that should be reminded today
    const studentsToRemindToday = await getStudentsToRemindAtDate(manager, now);

    if (studentsToRemindToday.length === 0) {
        logger.info("There are no students that should receive screening reminders today...");
        return;
    }

    //send the reminders to them
    await sendToStudents(manager, studentsToRemindToday); //if it fails sending some reminders, we'll try it again at the next day...
}