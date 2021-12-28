import {EntityManager} from "typeorm";
import {Student} from "../../../common/entity/Student";
import * as Notification from "../../../common/notification";

import {filterStudentsForCoCToRemindAtDate, getAllStudentsWithScreeningTrueAndNoCOC} from "./remindees";

export async function sendPendingCoCReminders(manager: EntityManager, date: Date) {
    const remindees = await getAllStudentsWithScreeningTrueAndNoCOC(manager);
    const todayRemindees = filterStudentsForCoCToRemindAtDate(remindees, date);

    for (const student of todayRemindees) {
        await sendCoCReminders(student, manager);
    }
}


async function sendCoCReminders (student: Student, manager: EntityManager) {
    //send actual mail...
    await sendCoCReminderEmail (student);
    //...store that in database
    student.lastSentCoCReminder = new Date();
    student.sentCoCReminderCount += 1;

    await manager.save(student);
}



async function sendCoCReminderEmail(student: Student) {
    const reminderCount = student.lastSentCoCReminder +1;

    //TODO: Here, we can either choose to send it via email templates or choose to send it via actions.
    // For actions, reminder actions will need to be defined based on the reminder number

    await Notification.actionTaken(student, `coc_reminder_count_${reminderCount}`
        , {certificateURL: "dummy_certificate_url",
           authToken: student.authToken
        });
}