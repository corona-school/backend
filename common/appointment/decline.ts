import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getUser, getStudent, User, userForStudent } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getAppointmentForNotification } from './util';
import { RedundantError } from '../util/error';
import { getNotificationContextForSubcourse } from '../courses/notifications';
import { leaveSubcourse } from '../courses/participants';

const logger = getLogger('Appointment');

export async function declineAppointment(user: User, appointment: Appointment) {
    if (appointment.declinedBy.includes(user.userID)) {
        throw new RedundantError(`Appointment was already declined by User`);
    }

    await prisma.lecture.update({
        data: { declinedBy: { push: user.userID } },
        where: { id: appointment.id },
    });

    const pupil = user.pupilId ? await prisma.pupil.findUniqueOrThrow({ where: { id: user.pupilId } }) : null;

    if (pupil) {
        switch (appointment.appointmentType) {
            case AppointmentType.group: {
                const subCourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: appointment.subcourseId }, include: { course: true } });
                for (const organizerId of appointment.organizerIds) {
                    const user = await getUser(organizerId);
                    const organizer = await getStudent(user);
                    await Notification.actionTaken(userForStudent(organizer), 'pupil_decline_appointment_group', {
                        appointment: getAppointmentForNotification(appointment),
                        pupil,
                        ...(await getNotificationContextForSubcourse(subCourse.course, subCourse)),
                    });
                }
                break;
            }
            case AppointmentType.match:
                for (const organizerId of appointment.organizerIds) {
                    const user = await getUser(organizerId);
                    const organizer = await getStudent(user);
                    await Notification.actionTaken(userForStudent(organizer), 'pupil_decline_appointment_match', {
                        appointment: getAppointmentForNotification(appointment),
                        pupil,
                    });
                }
                break;

            case AppointmentType.internal:
            case AppointmentType.legacy:
                break;
        }
    }

    logger.info(`User(${user.userID}) declined Appointment(${appointment.id})`);

    if (appointment.subcourseId && pupil) {
        const isOnlyAppointment = (await prisma.lecture.count({ where: { subcourseId: appointment.subcourseId, isCanceled: false } })) === 1;
        if (isOnlyAppointment) {
            await leaveSubcourse(await prisma.subcourse.findUniqueOrThrow({ where: { id: appointment.subcourseId } }), pupil);
            logger.info(`User(${user.userID}) declined the only appointment of a Subcourse, and thus implicitly left the course`);
        }
    }
}
