import { lecture as Appointment } from '@prisma/client';
import { User } from '../user';
import { prisma } from '../prisma';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getMatch, getStudent, getPupil } from '../../graphql/util';

const logger = getLogger('Appointment Tracking');

// To track achievements we trigger actions whenever a user
// joins an appointment meeting
export async function trackUserJoinAppointmentMeeting(user: User, appointment: Appointment) {
    // All actions in this file utilize the actionTakenAt funxtion to track each action.
    // This approach serves as a workaround to avoid complications arising from overlapping appointments.
    //
    // Occasionally, it's possible to join an appointment way ahead of its scheduled start time.
    // In such cases, the action could be mistakenly categorized in an incorrect bucket, potentially leading to evaluation issues down the line.
    //
    // To prevent this, we've implemented a workaround by setting the "join time" equal to the appointment's start time, ensuring that actions are accurately assigned to the appropriate bucket.
    // Moreover, the time window for lecture buckets has been narrowed to minimize the chance of overlaps.

    if (appointment.subcourseId) {
        const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: appointment.subcourseId }, include: { lecture: true } });
        if (user.studentId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.isCanceled ? 0 : 1), 0);
            await Notification.actionTakenAt(appointment.start, user, 'student_joined_subcourse_meeting', {
                relation: `subcourse/${subcourse.id}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
        } else if (user.pupilId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.declinedBy.includes(user.userID) ? 0 : 1), 0);
            await Notification.actionTakenAt(appointment.start, user, 'pupil_joined_subcourse_meeting', {
                relation: `subcourse/${subcourse.id}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
        }

        logger.info(`Tracked User(${user.userID}) joining Appointment(${appointment.id}) for Subcourse(${subcourse.id})`);
    } else if (appointment.matchId) {
        const match = await getMatch(appointment.matchId);
        const student = await getStudent(match.studentId);
        const pupil = await getPupil(match.pupilId);

        if (user.studentId) {
            await Notification.actionTakenAt(appointment.start, user, 'student_joined_match_meeting', {
                relation: `match/${appointment.matchId}`,
                name: pupil.firstname.toString(),
            });
        } else if (user.pupilId) {
            await Notification.actionTakenAt(appointment.start, user, 'pupil_joined_match_meeting', {
                relation: `match/${appointment.matchId}`,
                name: student.firstname.toString(),
            });
        }

        logger.info(`Tracked User(${user.userID}) joining Appointment(${appointment.id}) for a Match(${appointment.matchId})`);
    } else {
        logger.info(`Did not track User(${user.userID}) joining Appointment(${appointment.id}) as it is neither associated to a subcourse or match`);
    }
    if (user.studentId) {
        await Notification.actionTakenAt(appointment.start, user, 'student_presence_in_meeting', {});
    } else if (user.pupilId) {
        await Notification.actionTakenAt(appointment.start, user, 'pupil_presence_in_meeting', {});
    }
}
