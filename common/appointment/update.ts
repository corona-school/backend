import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getUser, getStudent, User, userForPupil } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';
import moment from 'moment';
import { updateZoomMeeting } from '../zoom/zoom-scheduled-meeting';
import { getNotificationContextForSubcourse } from '../mails/courses';

const logger = getLogger('Appointment');

export async function updateAppointment(
    user: User,
    appointment: Appointment,
    appointmentUpdate: Partial<Pick<Appointment, 'description' | 'duration' | 'start' | 'title'>>
) {
    const { id, start, duration, appointmentType } = appointment;
    const { duration: newDuration, start: newStart } = appointmentUpdate;

    const currentDate = moment();
    const isPastAppointment = moment(start).add(duration).isBefore(currentDate);

    if (isPastAppointment) {
        throw new Error(`Cannot update past appointment.`);
    }

    const updatedAppointment = await prisma.lecture.update({
        where: { id: id },
        data: { ...appointmentUpdate },
    });

    logger.info(`User(${user.userID}) updated Appointment(${appointment.id})`, { appointment, appointmentUpdate });

    const sameStart = !newStart || start.toISOString() === newStart.toISOString();
    const sameDuration = !newDuration || duration === newDuration;
    const sameDate = sameStart && sameDuration;

    if (sameDate) {
        return;
    }

    let lastDate: Date;

    const student = await getStudent(user);
    switch (appointmentType) {
        case AppointmentType.group:
            const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: updatedAppointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
            const subcourseAppointments = await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId } });
            lastDate = subcourseAppointments[subcourseAppointments.length - 1].start;

            // send notification if date has changed
            for (const participant of participants) {
                await Notification.actionTaken(userForPupil(participant.pupil), 'pupil_change_appointment_group', {
                    student: student,
                    appointment: getAppointmentForNotification(updatedAppointment, /* original: */ appointment),
                    ...(await getNotificationContextForSubcourse(subcourse.course, subcourse)),
                });
            }
            break;

        case AppointmentType.match:
            const match = await prisma.match.findUnique({ where: { id: updatedAppointment.matchId }, include: { pupil: true } });
            const matchAppointments = await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId } });
            lastDate = matchAppointments[matchAppointments.length - 1].start;

            // send notification if date has changed
            await Notification.actionTaken(userForPupil(match.pupil), 'pupil_change_appointment_match', {
                student: student,
                appointment: getAppointmentForNotification(updatedAppointment, /* original */ appointment),
            });

            break;

        case AppointmentType.internal:
        case AppointmentType.legacy:
            break;
    }

    await updateZoomMeeting(appointment.zoomMeetingId, newStart, newDuration, lastDate);

    logger.info(`Participants of Appointment(${id}) were notified of the appointment change`);
}
