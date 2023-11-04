import { lecture as Appointment, subcourse as Subcourse } from '@prisma/client';
import { getNotificationContextForSubcourse } from '../courses/notifications';

const language = 'de-DE';

export function getAppointmentEnd(appointment: Appointment) {
    const end = new Date(appointment.start);
    end.setMinutes(end.getMinutes() + appointment.duration);

    return end;
}

export function getAppointmentForNotification(appointment: Appointment, original?: Appointment) {
    const end = getAppointmentEnd(appointment);

    return {
        ...appointment,

        start_day: appointment.start.toLocaleString(language, { weekday: 'long', timeZone: 'Europe/Berlin' }),
        start_date: appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }),
        start_time: appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }),

        end_date: end.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }),
        end_time: end.toLocaleString(language, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }),

        original: original ? getAppointmentForNotification(original) : undefined,
    };
}

export async function getContextForMatchAppointmentReminder(appointment: Appointment, original?: Appointment) {
    return {
        uniqueId: appointment.id.toString(),
        matchId: appointment.matchId.toString(),
        appointment: await getAppointmentForNotification(appointment, original),
    };
}

export async function getContextForGroupAppointmentReminder(
    appointment: Appointment,
    subcourse: Subcourse,
    course: { name: string; description: string; imageKey: string },
    original?: Appointment
) {
    return {
        uniqueId: appointment.id.toString(),
        appointment: await getAppointmentForNotification(appointment, original),
        ...(await getNotificationContextForSubcourse(course, subcourse)),
    };
}
