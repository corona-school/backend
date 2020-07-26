import { EntityManager } from "typeorm";
import { Course, CourseState } from "../../../common/entity/Course";
import { Subcourse } from "../../../common/entity/Subcourse";
import * as moment from "moment-timezone";
import { getLogger } from "log4js";
import { Lecture } from "../../../common/entity/Lecture";
import { sendCourseUpcomingReminderInstructor, sendCourseUpcomingReminderParticipant } from "../../../common/mails/courses";


const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("CourseReminder job: looking for subcourses with first lecture in two days...");
    await sendUpcomingCourseReminders(manager);
}

async function sendUpcomingCourseReminders(manager: EntityManager) {
    // find courses that have a lecture the day after tomorrow
    const courses = await manager.find(Course, { courseState: CourseState.ALLOWED });

    for (let course of courses) {
        // find any subcourses
        const subcourses = await manager.find(Subcourse, { course: course, published: true });

        // skip if this course has no subcourses
        if (!subcourses) continue;

        for (let subcourse of subcourses) {
            // skip if this subcourse has no lectures
            if (subcourse.lectures.length == 0) continue;

            // get first lecture
            let firstLecture = subcourse.lectures[0];
            for (let i = 1; i < subcourse.lectures.length; i++) {
                if (subcourse.lectures[i].start < firstLecture.start) {
                    firstLecture = subcourse.lectures[i];
                }
            }

            const dayAfterTomorrow = moment().add(2, 'days');
            if (moment(firstLecture.start).isSame(dayAfterTomorrow, 'day')) {
                // first lecture is in two days
                logger.info("Found lecture on (sub)course " + course.name + " with start date in 2 days: " + firstLecture.start.toDateString());
                logger.info("Sending reminders to instructor and " + subcourse.participants.length + " participants");

                // notify instructor
                sendCourseUpcomingReminderInstructor(firstLecture.instructor, course, firstLecture.start);

                // notify all participants
                for (let i = 0; i < subcourse.participants.length; i++) {
                    sendCourseUpcomingReminderParticipant(subcourse.participants[i], course, firstLecture.start);
                }
            }
        }

    }
}