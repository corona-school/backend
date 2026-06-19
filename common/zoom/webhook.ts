import { lecture as Appointment } from '@prisma/client';
import { trackUserJoinAppointmentMeeting } from '../appointment/tracking';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { getUser } from '../user';
import { getZoomMeetingReport } from './scheduled-meeting';

interface ZoomMeetingEndedEvent {
    event: 'meeting.ended';
    event_ts: number;
    payload: {
        account_id: string;
        object: {
            id: string;
            uuid: string;
            host_id: string;
            host_email: string;
            topic: string;
            type: number;
            start_time: string;
            timezone: string;
            duration: number;
            end_time: string;
        };
    };
}

interface ZoomMeetingParticipantJoinedEvent {
    event: 'meeting.participant_joined';
    event_ts: number;
    payload: {
        account_id: string;
        object: {
            id: string;
            uuid: string;
            host_id: string;
            topic: string;
            type: number;
            start_time: string;
            timezone: string;
            duration: number;
            participant: {
                user_id: string;
                user_name: string;
                id: string;
                participant_uuid: string;
                date_time: string;
                email: string;
                registrant_id: string;
                participant_user_id: string;
                customer_key: string;
                phone_number: string;
            };
        };
    };
}

type ZoomEvent = ZoomMeetingEndedEvent | ZoomMeetingParticipantJoinedEvent;
const logger = getLogger('ZoomWebhook');
const validEventTypes = ['meeting.ended', 'meeting.participant_joined'];

export const onEvent = async (zoomEvent: ZoomEvent) => {
    // Discard event if it's not configured
    if (!validEventTypes.includes(zoomEvent.event)) {
        logger.debug(`Discarding event type: ${zoomEvent.event}`);
        return;
    }

    // For now we'll only consider match appointments.
    const appointment = await prisma.lecture.findFirst({ where: { appointmentType: 'match', zoomMeetingId: zoomEvent.payload.object.id } });
    // We don't care about appointments we don't recognize / types we don't support yet.
    if (!appointment) {
        logger.debug(`No appointment found for Zoom Meeting ID: ${zoomEvent.payload.object.id}`);
        return;
    }

    logger.info(`Handling ZoomEvent(${zoomEvent.event})`, zoomEvent);
    try {
        switch (zoomEvent.event) {
            case 'meeting.ended':
                return await onEventMeetingEnded(zoomEvent, appointment);
            case 'meeting.participant_joined':
                return await onEventMeetingParticipantJoined(zoomEvent, appointment);
            default:
                logger.warn(`Unknown Zoom event type: ${(zoomEvent as any)?.event}`, zoomEvent);
                break;
        }
    } catch (error) {
        logger.error(`Error handling ZoomEvent(${zoomEvent.event}) ${error.message}`, error);
    }
};

const getOverlapInSeconds = (intervalsA: { start: Date; end: Date }[], intervalsB: { start: Date; end: Date }[]) => {
    let total = 0;

    for (const a of intervalsA) {
        for (const b of intervalsB) {
            const start = Math.max(a.start.getTime(), b.start.getTime());
            const end = Math.min(a.end.getTime(), b.end.getTime());

            if (end > start) {
                total += (end - start) / 1000;
            }
        }
    }

    return total;
};

const onEventMeetingEnded = async (event: ZoomMeetingEndedEvent, appointment: Appointment) => {
    const report = await getZoomMeetingReport(event.payload.object.id);
    if (!report?.participants) {
        return;
    }

    // Only students have a zoom account
    const hostFragments = report.participants.filter((e) => !!e.id);
    const guestFragments = report.participants.filter((e) => !e.id);

    if (!hostFragments.length || !guestFragments.length) {
        return;
    }

    // Users can have internet issues or other reason to reconnect and so have multiple join/leave times.
    const hostIntervals = hostFragments
        .filter((r) => r.status === 'in_meeting')
        .map((r) => ({
            start: new Date(r.join_time),
            end: new Date(r.leave_time),
        }));

    const guestIntervals = guestFragments
        .filter((r) => r.status === 'in_meeting')
        .map((r) => ({
            start: new Date(r.join_time),
            end: new Date(r.leave_time),
        }));

    const sharedTime = getOverlapInSeconds(hostIntervals, guestIntervals);

    if (!sharedTime) {
        return;
    }
    await prisma.lecture.update({ where: { id: appointment.id }, data: { actualDuration: { increment: Math.ceil(sharedTime / 60) } } });
};

const onEventMeetingParticipantJoined = async (event: ZoomMeetingParticipantJoinedEvent, appointment: Appointment) => {
    const pupilId = appointment.participantIds.find((id) => id.startsWith('pupil/'));
    const studentId = appointment.organizerIds.find((id) => id.startsWith('student/'));
    const participant = event.payload.object.participant;
    if (participant.participant_user_id) {
        // Only students have a zoomId
        const user = await getUser(studentId);
        await trackUserJoinAppointmentMeeting(user, appointment);
        return;
    }

    // As pupils don't have a zoom account at all we have to assume that all guests are pupils ...
    const pupil = await getUser(pupilId);
    await trackUserJoinAppointmentMeeting(pupil, appointment);
};
