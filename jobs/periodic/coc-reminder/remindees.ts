import {EntityManager} from "typeorm";
import {Student} from "../../../common/entity/Student";
import {COC_REMINDER_INTERVALS, MAX_COC_REMINDER_COUNT} from "./constants";
import moment from "moment-timezone";

export async function getAllStudentsWithScreeningTrueAndNoCOC(manager: EntityManager) {
    return manager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoinAndSelect("s.screening", "sc")
        .leftJoinAndSelect("s.projectCoachingScreening", "pcsc")
        .leftJoinAndSelect("s.certificateOfConduct", "coc")
        .where("s.active IS TRUE AND s.verification IS NULL AND s.isInstructor IS FALSE AND (s.isStudent IS TRUE OR (s.isProjectCoach IS TRUE AND s.isUniversityStudent IS TRUE)) AND (sc IS NOT NULL OR pcsc IS NOT NULL) AND coc IS NULL")
        .getMany();
}

export const filterStudentsForCoCToRemindAtDate = filterToRemindAtDate(s => computeNextCoCReminderDate(s.sentCoCReminderCount, s.lastSentCoCReminder));

function filterToRemindAtDate(remindDateForStudent: (s: Student) => Date): (students: Student[], date: Date) => Student[] {
    return (students: Student[], date: Date) => {
        return students.filter(s => {
            const remindDate = remindDateForStudent(s);

            if (!remindDate) {
                return false;
            }

            return remindDate <= date;
        });
    };
}



function computeNextCoCReminderDate(sentReminderCount: number, lastInvitationSentDate: Date) {
    if (!lastInvitationSentDate) {
        return null; //cannot compute when to remind next screening
    }

    if (sentReminderCount >= MAX_COC_REMINDER_COUNT) {
        return null; //This person should never get reminded again...
    }

    const daysAfterPreviousReminderUntilNextReminder = COC_REMINDER_INTERVALS[sentReminderCount];

    return moment(lastInvitationSentDate).add(daysAfterPreviousReminderUntilNextReminder, "days")
        .toDate();
}