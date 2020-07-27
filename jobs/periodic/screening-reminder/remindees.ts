import { EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";

import { MAX_REMINDER_COUNT, REMINDER_INTERVALS } from "./constants";
import * as moment from "moment-timezone";


// ------------
// HeLPERS
// ------------
function computeNextScreeningReminderDate(sentReminderCount: number, lastInvitationSentDate: Date) {
    if (!lastInvitationSentDate) {
        return null; //cannot compute when to remind next screening
    }

    if (sentReminderCount >= MAX_REMINDER_COUNT) {
        return null; //This person should never get reminded again...
    }

    const daysAfterPreviousReminderUntilNextReminder = REMINDER_INTERVALS[sentReminderCount];

    return moment(lastInvitationSentDate).add(daysAfterPreviousReminderUntilNextReminder, "days").toDate();
}

// ------------
// DaTABASE
// ------------
async function getAllStudentsWithPendingReminders(manager: EntityManager) {
    return manager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoinAndSelect("s.screening", "sc")
        .where("s.active IS TRUE AND s.isStudent IS TRUE AND s.verification IS NULL AND sc IS NULL AND s.sentScreeningReminderCount BETWEEN :srcLow AND :srcUp", { srcLow: 0, srcUp: MAX_REMINDER_COUNT - 1 }) //active | is tutor in 1-on-1 tutoring | email verified | never screened | everything less than 0 is meant to be: do not sent any screening reminders
        .getMany();
}

// ------------
// FiLTER
// ------------
function filterStudentsToRemindAtDate(students: Student[], date: Date) {
    return students.filter(s => {
        const remindDate = computeNextScreeningReminderDate(s.sentScreeningReminderCount, s.lastSentScreeningInvitationDate);

        if (!remindDate) { //if remind date is no valid date, do not remind that student...
            return false;
        }

        return remindDate <= date;
    });
}

// ------------------
// StUDENTS TO REMIND
// ------------------
export async function getStudentsToRemindAtDate(manager: EntityManager, date: Date) {
    const studentsWithPendingReminders = await getAllStudentsWithPendingReminders(manager);
    const studentsToReallyRemind = filterStudentsToRemindAtDate(studentsWithPendingReminders, date); //filter out those, that shouldn't be reminded at the specified date

    return studentsToReallyRemind;
}
