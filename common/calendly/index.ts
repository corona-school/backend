import moment from 'moment';
import { getLogger } from '../logger/logger';
import { addPupilScreening } from '../pupil/screening';
import { getPupil, getUserByEmail } from '../user';
import { prisma } from '../prisma';
import { DEFAULT_SCREENER_NUMBER_ID } from '../util/screening';

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
        return user;
    } catch (error) {
        logger.error(`Failed to get screener from calendly event: ${membership.user_email}`, error);
        return null;
    }
};

const onEventInviteeCreated = async (event: CalendlyEvent) => {
    const user = await getUserByEmail(event.payload.email);
    const screener = await getEventOrganizer(event);
    const newAppointmentComment = `[System]: Der Termin wurde am ${moment(event.payload.created_at).format('D.M.YYYY, HH:mm')} erstellt und findet am ${moment(
        event.payload.scheduled_event.start_time
    ).format('D.M.YYYY, HH:mm')} statt.`;

    if (user.pupilId) {
        // Check if there is already a valid screening
        let screening = await prisma.pupil_screening.findFirst({
            where: {
                pupilId: user.pupilId,
                status: 'pending',
                invalidated: false,
            },
        });
        // If there is a screening, just update the comment
        // This should cover the case where the matching algo invites a pupil to a screening
        if (screening) {
            await prisma.pupil_screening.update({
                where: { id: screening.id },
                data: {
                    comment: `${screening.comment}\n${newAppointmentComment}`,
                },
            });
        } else {
            const pupil = await getPupil(user);
            screening = await addPupilScreening(pupil, { comment: newAppointmentComment, status: 'pending' }, true);
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
                comment: newAppointmentComment,
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
                comment: newAppointmentComment,
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
                comment: `${screening.comment}\n[System]: Der Termin wurde am ${moment(event.payload.scheduled_event.cancellation?.created_at).format(
                    'D.M.YYYY, HH:mm'
                )} abgesagt. Grund: ${event.payload.scheduled_event.cancellation?.reason}`,
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
                comment: `${screening.comment}\n[System]: Der Termin wurde am ${moment(event.payload.scheduled_event.cancellation?.created_at).format(
                    'D.M.YYYY, HH:mm'
                )} abgesagt. Grund: ${event.payload.scheduled_event.cancellation?.reason}`,
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
                comment: `${screening.comment}\n[System]: Der Termin wurde am ${moment(event.payload.scheduled_event.cancellation?.created_at).format(
                    'D.M.YYYY, HH:mm'
                )} abgesagt. Grund: ${event.payload.scheduled_event.cancellation?.reason}`,
            },
        });
        logger.info(`Updated Screening(${screening.id}) for Student(${screening.studentId}) after screening appointment was canceled`);
    }
};

export const onEvent = (event: CalendlyEvent) => {
    const validEventTypes = (process.env.CALENDLY_WEBHOOK_EVENT_TYPES ?? '').split(',').map((uuid) => `https://api.calendly.com/event_types/${uuid}`);
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
