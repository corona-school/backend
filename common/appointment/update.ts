import { lecture as Appointment, lecture_appointmenttype_enum as AppointmentType } from '@prisma/client';
import { prisma } from '../prisma';
import { getUser, getStudent, User, userForPupil, userForStudent } from '../user';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { getContextForGroupAppointmentReminder, getContextForMatchAppointmentReminder, getAppointmentForNotification } from './util';
import moment from 'moment';
import { updateZoomMeeting } from '../zoom/scheduled-meeting';
import { getNotificationContextForSubcourse } from '../courses/notifications';

const logger = getLogger('Appointment');

export async function updateAppointment(
    user: User,
    appointment: Appointment,
    appointmentUpdate: Partial<Pick<Appointment, 'description' | 'duration' | 'start' | 'title'>>,
    silent = false
) {
    const { id, start, duration, appointmentType, zoomMeetingId, override_meeting_link } = appointment;
    const { duration: newDuration, start: newStart } = appointmentUpdate;

    const currentDate = moment();
    const isPastAppointment = moment(start).add(duration).isBefore(currentDate);

    if (isPastAppointment) {
        throw new Error(`Cannot update past appointment.`);
    }

    const sameStart = !newStart || start.toISOString() === newStart.toISOString();
    const sameDuration = !newDuration || duration === newDuration;
    const sameDate = sameStart && sameDuration;
    const matchAppointmentDateChanged = appointmentType === 'match' && !sameDate;

    const updatedAppointment = await prisma.lecture.update({
        where: { id: id },
        data: matchAppointmentDateChanged ? { ...appointmentUpdate, declinedBy: [] } : appointmentUpdate,
    });

    logger.info(`User(${user.userID}) updated Appointment(${appointment.id})`, { appointment, appointmentUpdate });

    if (sameDate) {
        return;
    }

    let lastDate: Date;

    const student = await getStudent(user);
    if (!silent) {
        // send notifications
        switch (appointmentType) {
            case AppointmentType.group: {
                const subcourse = await prisma.subcourse.findUniqueOrThrow({ where: { id: updatedAppointment.subcourseId }, include: { course: true } });
                const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
                const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: subcourse.id }, include: { student: true } });
                const subcourseAppointments = await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId } });
                lastDate = subcourseAppointments[subcourseAppointments.length - 1].start;

                // send notification if date has changed
                for (const participant of participants) {
                    await Notification.actionTaken(userForPupil(participant.pupil), 'pupil_change_appointment_group', {
                        student: student,
                        appointment: getAppointmentForNotification(updatedAppointment, /* original: */ appointment),
                        ...(await getNotificationContextForSubcourse(subcourse.course, subcourse)),
                    });
                    await Notification.actionTakenAt(
                        new Date(updatedAppointment.start),
                        userForPupil(participant.pupil),
                        'pupil_group_appointment_starts',
                        await getContextForGroupAppointmentReminder(updatedAppointment, subcourse, subcourse.course, /* original: */ appointment)
                    );
                }
                for (const instructor of instructors) {
                    if (subcourse.published) {
                        // For unpublished courses, this is deferred to a later point
                        await Notification.actionTakenAt(
                            new Date(updatedAppointment.start),
                            userForStudent(instructor.student),
                            'student_group_appointment_starts',
                            await getContextForGroupAppointmentReminder(updatedAppointment, subcourse, subcourse.course, /* original: */ appointment)
                        );
                    }
                }

                break;
            }
            case AppointmentType.match: {
                const match = await prisma.match.findUnique({ where: { id: updatedAppointment.matchId }, include: { pupil: true } });
                const matchAppointments = await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId } });
                lastDate = matchAppointments[matchAppointments.length - 1].start;

                // send notification if date has changed
                await Notification.actionTaken(userForPupil(match.pupil), 'pupil_change_appointment_match', {
                    student: student,
                    appointment: getAppointmentForNotification(updatedAppointment, /* original: */ appointment),
                });
                await Notification.actionTakenAt(new Date(updatedAppointment.start), userForPupil(match.pupil), 'pupil_match_appointment_starts', {
                    ...(await getContextForMatchAppointmentReminder(updatedAppointment, /* original: */ appointment)),
                    student,
                });
                await Notification.actionTakenAt(new Date(updatedAppointment.start), userForStudent(student), 'student_match_appointment_starts', {
                    ...(await getContextForMatchAppointmentReminder(updatedAppointment, /* original: */ appointment)),
                    pupil: match.pupil,
                });

                break;
            }
            case AppointmentType.internal:
            case AppointmentType.legacy:
                break;
        }
    }
    const zoomUpdate = {
        start: newStart,
        duration: newDuration,
        endDate: lastDate,
    };

    if (!override_meeting_link && zoomMeetingId) {
        await updateZoomMeeting(appointment.zoomMeetingId, zoomUpdate);
    }

    logger.info(`Participants of Appointment(${id}) were notified of the appointment change`);
}
