import { lecture as Appointment } from '@prisma/client';
import { User } from '../user';
import { prisma } from '../prisma';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';

const logger = getLogger('Appointment Tracking');

// To track achievements we trigger actions whenever a user
// joins an appointment meeting
export async function trackUserJoinAppointmentMeeting(user: User, appointment: Appointment) {
    if (appointment.subcourseId) {
        const subcourse = await prisma.subcourse.findUniqueOrThrow({
            where: { id: appointment.subcourseId },
            include: { lecture: { where: { start: { gte: new Date('Tue Feb 13 2024 13:36:52 GMT+0100') } } } },
        });
        if (user.studentId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.isCanceled ? 0 : 1), 0);
            await Notification.actionTaken(user, 'student_joined_subcourse_meeting', {
                relation: `subcourse/${subcourse.id}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
        } else if (user.pupilId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.declinedBy.includes(user.userID) ? 0 : 1), 0);
            await Notification.actionTaken(user, 'pupil_joined_subcourse_meeting', {
                relation: `subcourse/${subcourse.id}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
        }

        logger.info(`Tracked User(${user.userID}) joining Appointment(${appointment.id}) for Subcourse(${subcourse.id})`);
    } else if (appointment.matchId) {
        if (user.studentId) {
            await Notification.actionTaken(user, 'student_joined_match_meeting', {
                relation: `match/${appointment.matchId}`,
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_match_meeting', {
                relation: `match/${appointment.matchId}`,
            });
        }

        logger.info(`Tracked User(${user.userID}) joining Appointment(${appointment.id}) for a Match(${appointment.matchId})`);
    } else {
        logger.info(`Did not track User(${user.userID}) joining Appointment(${appointment.id}) as it is neither associated to a subcourse or match`);
    }
}
