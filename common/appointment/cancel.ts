import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getStudent, User, userForPupil } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';
import { getNotificationContextForSubcourse } from '../mails/courses';
import { deleteZoomMeeting } from '../zoom/zoom-scheduled-meeting';
import { RedundantError } from '../util/error';

const logger = getLogger('Appointment');

export async function cancelAppointment(user: User, appointment: Appointment, silent?: boolean) {
    if (appointment.isCanceled) {
        throw new RedundantError(`Appointment already cancelled`);
    }

    await prisma.lecture.update({
        data: { isCanceled: true },
        where: { id: appointment.id },
    });

    logger.info(`Appointment(${appointment.id}) was cancelled by User(${user.userID})`);

    const student = await getStudent(user);

    // Notifications are sent only when an appointment is cancelled, not when a subcourse is cancelled
    if (!silent) {
        switch (appointment.appointmentType) {
            case AppointmentType.group:
                const subcourse = await prisma.subcourse.findFirst({ where: { id: appointment.subcourseId }, include: { course: true } });
                const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });

                for (const participant of participants) {
                    await Notification.actionTaken(userForPupil(participant.pupil), 'student_cancel_appointment_group', {
                        appointment: getAppointmentForNotification(appointment),
                        student,
                        ...(await getNotificationContextForSubcourse(subcourse.course, subcourse)),
                    });
                }

                break;

            case AppointmentType.match:
                const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true } });
                await Notification.actionTaken(userForPupil(match.pupil), 'student_cancel_appointment_match', {
                    appointment: getAppointmentForNotification(appointment),
                    student,
                });

                break;

            case AppointmentType.internal:
            case AppointmentType.legacy:
                break;
        }
    }

    if (appointment.zoomMeetingId) {
        await deleteZoomMeeting(appointment);
    }
}
