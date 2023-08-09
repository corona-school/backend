import { lecture as Appointment } from '@prisma/client';

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

export class AuthorizationError extends Error {}
