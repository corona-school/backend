import { lecture as Appointment, lecture_appointmenttype_enum, subcourse as Subcourse } from '@prisma/client';
import { getNotificationContextForSubcourse } from '../courses/notifications';
import * as ics from 'ics';
import { EventAttributes } from 'ics';
import moment from 'moment';
import { prisma } from '../prisma';
import { getUsers } from '../user';

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

export async function getDisplayName(appointment: Appointment, isOrganizer: boolean) {
    switch (appointment.appointmentType) {
        case lecture_appointmenttype_enum.match: {
            if (isOrganizer) {
                const [tutee] = await getUsers(appointment.participantIds);
                return `${tutee.firstname} ${tutee.lastname}`;
            } else {
                const [tutor] = await getUsers(appointment.organizerIds);
                return `${tutor.firstname} ${tutor.lastname}`;
            }
        }
        case lecture_appointmenttype_enum.group: {
            const { course } = await prisma.subcourse.findUnique({ where: { id: appointment.subcourseId }, select: { course: true } });
            return course.name;
        }
        default:
            return appointment.title || 'Kein Titel';
    }
}

export async function getIcsFile(appointments: Appointment[], isOrganizer: boolean): Promise<string> {
    const displayNames: string[] = await Promise.all(appointments.map((appointment) => getDisplayName(appointment, isOrganizer)));

    const events: EventAttributes[] = appointments.map((appointment, index) => {
        const start = moment(appointment.start)
            .format('YYYY-M-D-H-m')
            .split('-')
            .map((a) => parseInt(a)) as [number, number, number, number, number];
        const end = moment(getAppointmentEnd(appointment))
            .format('YYYY-M-D-H-m')
            .split('-')
            .map((a) => parseInt(a)) as [number, number, number, number, number];
        const durationHours = Math.floor(appointment.duration / 60);
        const durationMinutes = appointment.duration % 60;
        const displayName = displayNames[index];

        return {
            start,
            end,
            duration: { hours: durationHours, minutes: durationMinutes },
            title: displayName,
            description: appointment.description,
            url: `https://app.lern-fair.de/appointment/${appointment.id}`,
            alarms: [
                {
                    action: 'display',
                    trigger: { hours: 1, minutes: 0, before: true },
                    description: `Erinnerung: ${displayName}`,
                },
            ],
            busyStatus: 'BUSY',
        } satisfies EventAttributes;
    });

    const file: string = await new Promise((resolve, reject) => {
        ics.createEvents(events, (error, value) => {
            if (error) {
                console.error('Error creating ICS file:', error);
                reject(error);
            }
            resolve(value);
        });
    });

    return Buffer.from(file).toString('base64');
}
