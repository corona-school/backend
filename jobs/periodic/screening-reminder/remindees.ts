import { EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";

import { MAX_REMINDER_COUNT, REMINDER_INTERVALS } from "./constants";
import moment from "moment-timezone";


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

    return moment(lastInvitationSentDate).add(daysAfterPreviousReminderUntilNextReminder, "days")
        .toDate();
}

// ------------
// DaTABASE
// ------------
// All students who still need a tutor screening (and no Jufo-alumni screening or instructor screening)
async function getAllStudentsWithPendingTutorScreening(manager: EntityManager) {
    return manager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoinAndSelect("s.screening", "sc")
        .leftJoinAndSelect("s.projectCoachingScreening", "pcsc")
        .where("s.active IS TRUE AND s.verification IS NULL AND s.isInstructor IS FALSE AND (s.isStudent IS TRUE OR (s.isProjectCoach IS TRUE AND s.isUniversityStudent IS TRUE)) AND (sc IS NULL AND pcsc IS NULL) AND s.sentScreeningReminderCount BETWEEN :srcLow AND :srcUp", { srcLow: 0, srcUp: MAX_REMINDER_COUNT - 1 })
        .getMany();
}

async function getAllStudentsWithPendingJufoAlumniScreening(manager: EntityManager) {
    return manager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoinAndSelect("s.projectCoachingScreening", "pcsc")
        .where("s.active IS TRUE AND s.verification IS NULL AND (s.isInstructor IS FALSE AND s.isStudent IS FALSE AND s.isProjectCoach IS TRUE AND s.isUniversityStudent IS FALSE) AND pcsc IS NULL AND s.sentJufoAlumniScreeningReminderCount BETWEEN :srcLow AND :srcUp", { srcLow: 0, srcUp: MAX_REMINDER_COUNT - 1 })
        .getMany();
}

async function getAllStudentsWithPendingInstructorScreening(manager: EntityManager) {
    return manager
        .createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoinAndSelect("s.instructorScreening", "sc")
        .where ("s.active IS TRUE AND s.verification IS NULL AND s.isInstructor IS TRUE AND sc IS NULL AND s.sentInstructorScreeningReminderCount BETWEEN :srcLow AND :srcUp", { srcLow: 0, srcUp: MAX_REMINDER_COUNT - 1 })
        .getMany();
}

// ------------
// FiLTER
// ------------
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
const filterStudentsForTutorScreeningToRemindAtDate = filterToRemindAtDate(s => computeNextScreeningReminderDate(s.sentScreeningReminderCount, s.lastSentScreeningInvitationDate));
const filterStudentsForJufoAlumniScreeningToRemindAtDate = filterToRemindAtDate(s => computeNextScreeningReminderDate(s.sentJufoAlumniScreeningReminderCount, s.lastSentJufoAlumniScreeningInvitationDate));
const filterStudentsForInstructorScreeningToRemindAtDate = filterToRemindAtDate(s => computeNextScreeningReminderDate(s.sentInstructorScreeningReminderCount, s.lastSentInstructorScreeningInvitationDate));

// ------------------
// StUDENTS TO REMIND
// ------------------
export async function getStudentsForTutorScreeningReminderAtDate(manager: EntityManager, date: Date) {
    const studentsWithPendingReminders = await getAllStudentsWithPendingTutorScreening(manager);
    const studentsToReallyRemind = filterStudentsForTutorScreeningToRemindAtDate(studentsWithPendingReminders, date); //filter out those, that shouldn't be reminded at the specified date

    return studentsToReallyRemind;
}

export async function getStudentsForJufoAlumniScreeningReminderAtDate(manager: EntityManager, date: Date) {
    const studentsWithPendingReminders = await getAllStudentsWithPendingJufoAlumniScreening(manager);
    const studentsToReallyRemind = filterStudentsForJufoAlumniScreeningToRemindAtDate(studentsWithPendingReminders, date);

    return studentsToReallyRemind;
}

export async function getStudentsForInstructorScreeningReminderAtDate(manager: EntityManager, date: Date) {
    const studentsWithPendingReminders = await getAllStudentsWithPendingInstructorScreening(manager);
    const studentsToReallyRemind = filterStudentsForInstructorScreeningToRemindAtDate(studentsWithPendingReminders, date);

    return studentsToReallyRemind;
}

export async function getStudentsToRemindAtDate(manager: EntityManager, date: Date) {
    const tutorsToRemind = await getStudentsForTutorScreeningReminderAtDate(manager, date);
    const jufoAlumniToRemind = await getStudentsForJufoAlumniScreeningReminderAtDate(manager, date);
    const instructorsToRemind = await getStudentsForInstructorScreeningReminderAtDate(manager, date);
    return [...tutorsToRemind, ...jufoAlumniToRemind, ...instructorsToRemind]; //those are all disjunct by construction
}