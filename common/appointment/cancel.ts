import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getStudent, User } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';

const logger = getLogger('Appointment');

export async function cancelAppointment(user: User, appointment: Appointment) {
    await prisma.lecture.update({
        data: { isCanceled: true },
        where: { id: appointment.id },
    });

    logger.info(`Appointment(${appointment.id}) was cancelled by User(${user.userID})`);

    const student = await getStudent(user);

    switch (appointment.appointmentType) {
        case AppointmentType.group:
            const subcourse = await prisma.subcourse.findFirst({ where: { id: appointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });

            for (const participant of participants) {
                await Notification.actionTaken(participant.pupil, 'student_cancel_appointment_group', {
                    appointment: getAppointmentForNotification(appointment),
                    student,
                    course: subcourse.course,
                });
            }

            break;

        case AppointmentType.match:
            const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true } });
            await Notification.actionTaken(match.pupil, 'student_cancel_appointment_match', {
                appointment: getAppointmentForNotification(appointment),
                student,
            });

            break;
    }
}
