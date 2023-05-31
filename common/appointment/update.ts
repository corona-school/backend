import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getUser, getStudent, User } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';
import moment from 'moment';

const logger = getLogger('Appointment');

export async function updateAppointment(
    user: User,
    appointment: Appointment,
    appointmentUpdate: Partial<Pick<Appointment, 'description' | 'duration' | 'start' | 'title'>>
) {
    const currentDate = moment();
    const isPastAppointment = moment(appointment.start).add(appointment.duration).isBefore(currentDate);

    if (isPastAppointment) {
        throw new Error(`Cannot update past appointment.`);
    }

    const updatedAppointment = await prisma.lecture.update({
        where: { id: appointment.id },
        data: { ...appointmentUpdate },
    });

    logger.info(`User(${user.userID}) updated Appointment(${appointment.id})`, { appointment, appointmentUpdate });

    const sameDate = !appointmentUpdate.start || appointment.start.toISOString() === appointmentUpdate.start.toISOString();
    if (sameDate) {
        return;
    }

    // send notification if date has changed
    const student = await getStudent(user);
    switch (appointment.appointmentType) {
        case AppointmentType.group:
            const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: updatedAppointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
            for (const participant of participants) {
                await Notification.actionTaken(participant.pupil, 'pupil_change_appointment_group', {
                    student: student,
                    appointment: getAppointmentForNotification(updatedAppointment, /* original: */ appointment),
                    course: subcourse.course,
                });
            }
            break;

        case AppointmentType.match:
            const match = await prisma.match.findUnique({ where: { id: updatedAppointment.matchId }, include: { pupil: true } });
            await Notification.actionTaken(match.pupil, 'pupil_change_appointment_match', {
                student: student,
                appointment: getAppointmentForNotification(updatedAppointment, /* original */ appointment),
            });
            break;

        case AppointmentType.internal:
        case AppointmentType.legacy:
            break;
    }

    logger.info(`Participants of Appointment(${appointment.id}) were notified of the appointment change`);
}
