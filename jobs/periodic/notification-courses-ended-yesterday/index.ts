import { prisma } from '../../../common/prisma';
import moment from 'moment';
import { getLogger } from '../../../common/logger/logger';
import { getNotificationContextForSubcourse } from '../../../common/courses/notifications';
import { userForPupil, userForStudent } from '../../../common/user';
import * as Notification from '../../../common/notification';

const logger = getLogger();

export default async function execute() {
    const subcoursesWithLecturesEndedYesterday = await prisma.subcourse.findMany({
        where: {
            lecture: {
                some: {
                    start: {
                        gte: moment().subtract(1, 'day').startOf('day').toDate(),
                        lt: moment().startOf('day').toDate(),
                    },
                },
            },
        },
        include: {
            course: true,
            lecture: true,
            subcourse_instructors_student: { include: { student: true } },
            subcourse_participants_pupil: { include: { pupil: true } },
        },
    });
    for (const subcourse of subcoursesWithLecturesEndedYesterday) {
        if (subcourse.lecture.length === 0) {
            continue;
        }
        const lastLecture = subcourse.lecture.sort((a, b) => a.start.getTime() - b.start.getTime())[subcourse.lecture.length - 1];
        if (lastLecture.start >= moment().subtract(1, 'day').startOf('day').toDate() && lastLecture.start < moment().startOf('day').toDate()) {
            const notificationCtx = await getNotificationContextForSubcourse(subcourse.course, subcourse);
            // for (const instructor of subcourse.subcourse_instructors_student) {
            //     await Notification.actionTaken(userForStudent(instructor.student), 'instructor_course_ended', {
            //         uniqueId: String(subcourse.id),
            //         ...notificationCtx,
            //     });
            // }
            for (const participant of subcourse.subcourse_participants_pupil) {
                await Notification.actionTaken(userForPupil(participant.pupil), 'participant_course_ended', {
                    relation: `subcourse/${subcourse.id}`,
                    subcourseId: subcourse.id.toString(),
                    uniqueId: String(subcourse.id),
                    ...notificationCtx,
                });
            }
            logger.info(
                `Course(${subcourse.course.id})'s Subcourse(${subcourse.id}) ended yesterday, triggered ${
                    subcourse.subcourse_instructors_student.length + subcourse.subcourse_participants_pupil.length
                } course_ended notifications`
            );
        }
    }
}
