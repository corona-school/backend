import { EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";
import { sendInstructorScreeningReminderToStudent, sendJufoAlumniScreeningReminderToStudent, sendTutorScreeningReminderToStudent } from "../../../common/administration/screening/reminder";
import mailjet from "../../../common/mails/mailjet";
import { getLogger } from '../../../common/logger/logger';

const logger = getLogger();

//sends the appropriate screening reminder based on the screening invitation hierarchy, i.e. instructor screening is always first, then tutor screening, then jufo alumni screening
async function sendScreeningReminderToStudentBasedOnType(manager: EntityManager, student: Student) {
    if (student.isInstructor) {
        // send instructor screening reminder
        await sendInstructorScreeningReminderToStudent(manager, student);
    } else if (student.isStudent || (student.isProjectCoach && student.isUniversityStudent)) {
        // send tutor screening reminder
        await sendTutorScreeningReminderToStudent(manager, student);
    } else if (!student.isStudent && student.isProjectCoach && !student.isUniversityStudent) {
        // send jufo alumni screening reminder
        await sendJufoAlumniScreeningReminderToStudent(manager, student);
    } else {
        throw new Error(`Cannot send screening reminder to student because the screening reminder type cannot be determined: ${JSON.stringify(student)}!`);
    }
}

export async function sendToStudents(manager: EntityManager, students: Student[]) {
    try {
        for (const s of students) {
            // This will send a screening reminder to the given student and stores in database, that the reminder was sent (if it was sent successfully)
            await sendScreeningReminderToStudentBasedOnType(manager, s);
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
