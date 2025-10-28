import moment from 'moment-timezone';
import 'moment/locale/de';
import { getLogger } from '../logger/logger';
import { addPupilScreening } from '../pupil/screening';
import { getPupil, getUserByEmail, User } from '../user';
import { prisma } from '../prisma';
import { DEFAULT_SCREENER_NUMBER_ID } from '../util/screening';
import * as Notification from '../notification';
import systemMessages from '../chat/localization';

const logger = getLogger('Calendly');

export interface CalendlyEventPayload {
    cancel_url: string;
    created_at: string;
    email: string;
    event: string;
    first_name: string;
    name: string;
    reschedule_url: string;
    rescheduled: boolean;
    scheduled_event: ScheduledEvent;
    status: string;
    timezone: string;
    updated_at: string;
    uri: string;
}

export interface CalendlyEvent {
    created_at: string;
    created_by: string;
    event: 'invitee.created' | 'invitee.canceled' | 'invitee_no_show.created' | 'invitee_no_show.deleted';
    payload: CalendlyEventPayload;
}

export interface ScheduledEvent {
    created_at: string;
    end_time: string;
    event_type: string;
    name: string;
    start_time: string;
    status: string;
    updated_at: string;
    uri: string;
    join_url: string;
    cancellation?: {
        canceled_by: string;
        canceler_type: 'invitee' | string;
        created_at: string;
        reason: string;
    };
    location?: {
        data: {
            id: number;
        };
        join_url: string;
        type: 'zoom' | string;
    };
    event_memberships?: { user_email: string }[];
}

export interface InviteeEvent {
    email: string;
    cancel_url: string;
    reschedule_url: string;
}

export const cancelCalendlyEvent = async (eventUrl: string, reason: string) => {
    const parts = eventUrl.split('/');
    const uuid = parts[parts.length - 1];
    const response = await fetch(`https://api.calendly.com/scheduled_events/${uuid}/cancellation`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
        const errorText = `Failed to cancel Calendly Event(${eventUrl}): ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }
    logger.info(`Automatically cancelled Calendly Event(${eventUrl})`);
};

export const getCalendlyScheduledEvent = async (eventUrl: string) => {
    const response = await fetch(eventUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = `Failed to fetch Calendly event: ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }

    const envelope = await response.json();
    const scheduledEvent = envelope.resource as ScheduledEvent;
    return {
        ...scheduledEvent,
        join_url: scheduledEvent?.location?.join_url,
    };
};

export const getCalendlyInviteeEvent = async (eventUrl: string, inviteeEmail: string) => {
    const response = await fetch(`${eventUrl}/invitees`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorText = `Failed to fetch Calendly event for invitee: ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }
    const envelope = await response.json();
    const collection = envelope.collection as InviteeEvent[];
    const inviteeEvent = collection.find((e) => e.email === inviteeEmail);
    if (!inviteeEvent) {
        logger.warn(`No invitee found for email ${inviteeEmail} in event ${eventUrl}`);
        return null;
    }
    return inviteeEvent;
};

const getEventOrganizer = async (event: CalendlyEvent) => {
    const [membership] = event.payload.scheduled_event.event_memberships;
    try {
        const user = await getUserByEmail(membership.user_email);
        if (!user.screenerId) {
            logger.warn(`User with email ${membership.user_email} does not have a screener ID.`);
            return null;
        }
        return user;
    } catch (error) {
        logger.warn(`Failed to get screener from calendly event: ${membership.user_email}`, error);
        return null;
    }
};

const formatAppointmentDate = (date: string) => {
    return moment.tz(date, 'Europe/Berlin').format('dddd DD. MMM, HH:mm');
};

const onEventInviteeCreated = async (event: CalendlyEvent) => {
    let user: User;
    try {
        user = await getUserByEmail(event.payload.email);
    } catch (error) {
        // If user wasn't found we can just "fail silently" here as probably the user entered a different email
        // which we can't prevent from calendly ...
        logger.warn(`Error getting user from Calendly Event(${event.payload.scheduled_event.uri})`);
        return;
    }
    const screener = await getEventOrganizer(event);
    const newAppointmentComment = `[System]: Ein Termin wurde am ${formatAppointmentDate(
        event.payload.created_at
    )} erstellt und findet am ${formatAppointmentDate(event.payload.scheduled_event.start_time)} statt.`;

    if (user.pupilId || user.studentId) {
        // Check if there is already a valid appointment
        const existingAppointment = await prisma.lecture.findFirst({
            where: {
                participantIds: { has: user.userID },
                appointmentType: 'screening',
                isCanceled: false,
                start: { gte: new Date() },
            },
        });
        // If there is already a valid appointment, it means the user is trying to book a second appointment (this is not a reschedule!)
        // In this case, we just cancel the event we just received and let the user know they already have an appointment
        // and how they can properly reschedule it
        if (existingAppointment) {
            const appointmentDate = formatAppointmentDate(existingAppointment.start.toISOString());
            await cancelCalendlyEvent(
                event.payload.scheduled_event.uri,
                `Du hast bereits einen Termin bei uns am ${appointmentDate}. Falls du ihn verschieben musst, logge dich bitte in deinen Lern-Fair-Account ein`
            );
            return;
        }
    }

    if (user.pupilId) {
        await Notification.actionTaken(user, 'pupil_screening_appointment_booked', {});
        // Check if there is already a valid screening
        let screening = await prisma.pupil_screening.findFirst({
            where: {
                pupilId: user.pupilId,
                status: { in: ['pending', 'dispute'] },
                invalidated: false,
            },
        });
        // If there is a screening, just update the comment
        // This should cover the case where the matching algo invites a pupil to a screening
        if (screening) {
            await prisma.pupil_screening.update({
                where: { id: screening.id },
                systemMessages: {
                    push: newAppointmentComment,
                },
            });
        } else {
            const pupil = await getPupil(user);
            screening = await addPupilScreening(pupil, { comment: newAppointmentComment, status: 'pending' }, true); // TBD
        }
        const appointment = await prisma.lecture.create({
            data: {
                duration: 15,
                appointmentType: 'screening',
                title: event.payload.scheduled_event.name,
                eventUrl: event.payload.scheduled_event.uri,
                override_meeting_link: event.payload.scheduled_event.location?.join_url,
                start: new Date(event.payload.scheduled_event.start_time),
                pupilScreeningId: screening.id,
                participantIds: [user.userID],
                organizerIds: screener ? [screener.userID] : [],
            },
        });
        logger.info(`Created ScreeningAppointment(${appointment.id}) for Screening(${screening.id})`);
        return;
    }

    if (user.studentId) {
        await Notification.actionTaken(user, 'student_screening_appointment_booked', {});
        // If the student already completed a screening, we won't attach the screening appointment to it
        const hadTutorScreening =
            (await prisma.screening.count({
                where: {
                    studentId: user.studentId,
                    status: { in: ['rejection', 'success'] },
                },
            })) > 0;
        const hadInstructorScreening =
            (await prisma.instructor_screening.count({
                where: {
                    studentId: user.studentId,
                    status: { in: ['rejection', 'success'] },
                },
            })) > 0;

        // Create or "update" the screenings
        const tutorScreening = await prisma.screening.upsert({
            where: {
                studentId: user.studentId,
            },
            create: {
                screenerId: screener?.screenerId ?? DEFAULT_SCREENER_NUMBER_ID,
                studentId: user.studentId,
                systemMessages: { push: newAppointmentComment },
                status: 'pending',
            },
            // If there was already a screening we don't do anything here
            update: {},
        });
        const instructorScreening = await prisma.instructor_screening.upsert({
            where: {
                studentId: user.studentId,
            },
            create: {
                screenerId: screener?.screenerId ?? DEFAULT_SCREENER_NUMBER_ID,
                studentId: user.studentId,
                systemMessages: { push: newAppointmentComment },
                status: 'pending',
            },
            // If there was already a screening we don't do anything here
            update: {},
        });

        const appointment = await prisma.lecture.create({
            data: {
                duration: 30,
                appointmentType: 'screening',
                title: event.payload.scheduled_event.name,
                eventUrl: event.payload.scheduled_event.uri,
                override_meeting_link: event.payload.scheduled_event.location?.join_url,
                start: new Date(event.payload.scheduled_event.start_time),
                instructorScreeningId: !hadInstructorScreening ? instructorScreening.id : undefined,
                tutorScreeningId: !hadTutorScreening ? tutorScreening.id : undefined,
                participantIds: [user.userID],
                organizerIds: screener ? [screener.userID] : [],
            },
        });
        logger.info(`Created ScreeningAppointment(${appointment.id}) for Student(${user.studentId})`);
        return;
    }
};

const onEventInviteeCanceled = async (event: CalendlyEvent) => {
    const appointment = await prisma.lecture.findFirst({
        where: {
            eventUrl: event.payload.scheduled_event.uri,
        },
        include: {
            pupilScreening: true,
            instructorScreening: true,
            tutorScreening: true,
        },
    });
    if (!appointment) {
        logger.warn(`No ScreeningAppointment found for event URL: ${event.payload.scheduled_event.uri}`);
        return;
    }

    await prisma.lecture.update({
        where: { id: appointment.id },
        data: {
            isCanceled: true,
        },
    });

    if (appointment.pupilScreeningId) {
        const screening = await prisma.pupil_screening.findFirst({
            where: {
                pupilId: appointment.pupilScreening.pupilId,
                invalidated: false,
            },
        });
        await prisma.pupil_screening.update({
            where: { id: screening.id },
            data: {
                systemMessages: {
                    push: `[System]: Ein Termin wurde am ${formatAppointmentDate(event.payload.scheduled_event.cancellation?.created_at)} abgesagt. Grund: ${
                        event.payload.scheduled_event.cancellation?.reason
                    }`,
                },
            },
        });
        logger.info(`Updated Screening(${screening.id}) for Pupil(${screening.pupilId}) after screening appointment was canceled`);
    }

    if (appointment.tutorScreeningId) {
        const screening = await prisma.screening.findFirst({
            where: {
                id: appointment.tutorScreeningId,
            },
        });
        await prisma.screening.update({
            where: { id: screening.id },
            data: {
                systemMessages: {
                    push: `[System]: Ein Termin wurde am ${formatAppointmentDate(event.payload.scheduled_event.cancellation?.created_at)} abgesagt. Grund: ${
                        event.payload.scheduled_event.cancellation?.reason
                    }`,
                },
            },
        });
        logger.info(`Updated Screening(${screening.id}) for Student(${screening.studentId}) after screening appointment was canceled`);
    }

    if (appointment.instructorScreeningId) {
        const screening = await prisma.instructor_screening.findFirst({
            where: {
                id: appointment.instructorScreeningId,
            },
        });
        await prisma.instructor_screening.update({
            where: { id: screening.id },
            data: {
                systemMessages: {
                    push: `[System]: Ein Termin wurde am ${formatAppointmentDate(event.payload.scheduled_event.cancellation?.created_at)} abgesagt. Grund: ${
                        event.payload.scheduled_event.cancellation?.reason
                    }`,
                },
            },
        });
        logger.info(`Updated Screening(${screening.id}) for Student(${screening.studentId}) after screening appointment was canceled`);
    }
};

const validEventTypes = (process.env.CALENDLY_WEBHOOK_EVENT_TYPES ?? '').split(',').map((uuid) => `https://api.calendly.com/event_types/${uuid}`);
export const onEvent = (event: CalendlyEvent) => {
    // Discard event if it's not configured
    if (!validEventTypes.includes(event.payload.scheduled_event.event_type)) {
        logger.debug(`Discarding event type: ${event.payload.scheduled_event.event_type}`);
        return;
    }

    logger.info(`Handling Calendly Event(${event.event})`, event);
    switch (event.event) {
        case 'invitee.created':
            return onEventInviteeCreated(event);
        case 'invitee.canceled':
            return onEventInviteeCanceled(event);
        case 'invitee_no_show.created':
            // We don't handle this for now
            break;
        case 'invitee_no_show.deleted':
            // We don't handle this for now
            break;
        default:
            logger.warn(`Unknown Calendly event type: ${event.event}`, event);
            break;
    }
};
