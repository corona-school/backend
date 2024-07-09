import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getScreener, getStudent, User, userForPupil, userForStudent } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';
import { deleteZoomMeeting } from '../zoom/scheduled-meeting';
import { PrerequisiteError, RedundantError } from '../util/error';
import { getNotificationContextForSubcourse } from '../courses/notifications';
import { Student } from '../../graphql/generated';

const logger = getLogger('Appointment');

async function isLastCourseAppointment(subcourseId: number) {
    const appointments = await prisma.lecture.count({ where: { subcourseId: subcourseId, isCanceled: false } });
    if (appointments === 1) {
        return true;
    }
    return false;
}

export async function cancelAppointment(user: User, appointment: Appointment, silent?: boolean, force?: boolean) {
    if (appointment.isCanceled) {
        throw new RedundantError(`Appointment already cancelled`);
    }

    if (appointment.subcourseId && !force) {
        const isLastAppointment = await isLastCourseAppointment(appointment.subcourseId);
        if (appointment.subcourseId && isLastAppointment) {
            throw new PrerequisiteError(`Appointment is last of the course`);
        }
    }

    await prisma.lecture.update({
        data: { isCanceled: true },
        where: { id: appointment.id },
    });

    logger.info(`Appointment(${appointment.id}) was cancelled by User(${user.userID})`);

    switch (appointment.appointmentType) {
        case AppointmentType.group: {
            const _user = user.studentId ? await getStudent(user) : await getScreener(user);

            const subcourse = await prisma.subcourse.findFirst({ where: { id: appointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
            const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: subcourse.id }, include: { student: true } });

            // TODO: adjust notification for if screener cancelled the appointment
            for (const participant of participants) {
                // Notifications are sent only when an appointment is cancelled, not when a subcourse is cancelled
                if (!silent) {
                    await Notification.actionTaken(userForPupil(participant.pupil), 'student_cancel_appointment_group', {
                        appointment: getAppointmentForNotification(appointment),
                        student: _user,
                        ...(await getNotificationContextForSubcourse(subcourse.course, subcourse)),
                    });
                }

                // Cancellation actions are triggered regardless
                await Notification.actionTaken(userForPupil(participant.pupil), 'cancel_group_appointment_reminder', {
                    appointment: getAppointmentForNotification(appointment),
                    uniqueId: appointment.id.toString(),
                });
            }

            for (const instructor of instructors) {
                await Notification.actionTaken(userForStudent(instructor.student), 'cancel_group_appointment_reminder', {
                    appointment: getAppointmentForNotification(appointment),
                    uniqueId: appointment.id.toString(),
                });
            }
            break;
        }
        case AppointmentType.match: {
            if (user.screenerId) break; //TODO: Throw an error?

            const student = await getStudent(user);
            const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true, student: true } });

            if (!silent) {
                await Notification.actionTaken(userForPupil(match.pupil), 'student_cancel_appointment_match', {
                    appointment: getAppointmentForNotification(appointment),
                    student,
                });
            }

            await Notification.actionTaken(userForPupil(match.pupil), 'cancel_match_appointment_reminder', {
                appointment: getAppointmentForNotification(appointment),
                uniqueId: appointment.id.toString(),
            });
            await Notification.actionTaken(userForStudent(match.student), 'cancel_match_appointment_reminder', {
                appointment: getAppointmentForNotification(appointment),
                uniqueId: appointment.id.toString(),
            });

            break;
        }
        case AppointmentType.internal:
        case AppointmentType.legacy:
            break;
    }

    if (appointment.zoomMeetingId) {
        await deleteZoomMeeting(appointment);
    }
}
