import moment from 'moment-timezone';
import { getLogger } from '../../../common/logger/logger';
import { sendCourseUpcomingReminderInstructor, sendCourseUpcomingReminderParticipant } from '../../../common/mails/courses';
import { prisma } from '../../../common/prisma';
import { course_coursestate_enum as CourseState } from "@prisma/client";

const logger = getLogger();

export default async function execute() {
    logger.info('CourseReminder job: looking for subcourses with first lecture in two days...');
    await sendUpcomingCourseReminders();
}

async function sendUpcomingCourseReminders() {
    /* eslint camelcase: 'off' */
    const feasibleSubcourses = await prisma.subcourse.findMany({
        where: {
            course: {
                courseState: CourseState.allowed,
            },
            published: true,
        },
        include: {
            lecture: {
                include: {
                    student: true,
                },
            },
            course: true,
            subcourse_participants_pupil: {
                include: {
                    pupil: true,
                },
            },
        },
    });

    // find courses that have a lecture the day after tomorrow
    for (const subcourse of feasibleSubcourses) {
        const course = subcourse.course;

        // skip if this subcourse has no lectures
        if (subcourse.lecture.length == 0) {
            continue;
        }

        // get first lecture
        let firstLecture = subcourse.lecture[0];
        for (let i = 1; i < subcourse.lecture.length; i++) {
            if (subcourse.lecture[i].start < firstLecture.start) {
                firstLecture = subcourse.lecture[i];
            }
        }

        const dayAfterTomorrow = moment().add(2, 'days');
        if (moment(firstLecture.start).isSame(dayAfterTomorrow, 'day')) {
            // first lecture is in two days
            logger.info('Found lecture on (sub)course ' + course.name + ' with start date in 2 days: ' + firstLecture.start.toDateString());
            logger.info('Sending reminders to instructor and ' + subcourse.subcourse_participants_pupil.length + ' participants');

            if (firstLecture.student) {
                // notify instructor
                await sendCourseUpcomingReminderInstructor(firstLecture.student, course, subcourse, firstLecture.start);
            }

            // notify all participants
            for (let i = 0; i < subcourse.subcourse_participants_pupil.length; i++) {
                await sendCourseUpcomingReminderParticipant(subcourse.subcourse_participants_pupil[i].pupil, course, subcourse, firstLecture.start);
            }
        }
    }
}
