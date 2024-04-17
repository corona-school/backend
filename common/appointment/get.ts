import moment from 'moment';
import { Lecture as Appointment, Match } from '../../graphql/generated';
import { prisma } from '../prisma';
import { User } from '../user';

type QueryDirection = 'last' | 'next';
type Edge = 'first' | 'last';

/**
 * The current maximum duration of an appointment is 4 hours.
 */
const MAXIMUM_APPOINTMENT_DURATION = 4;

export const hasAppointmentsForUser = async (user: User): Promise<boolean> => {
    const appointmentsCount = await prisma.lecture.count({
        where: {
            isCanceled: false,
            NOT: {
                declinedBy: { has: user.userID },
            },
            AND: [
                { OR: [{ subcourseId: null }, { subcourse: { published: true } }] },
                {
                    OR: [
                        {
                            participantIds: {
                                has: user.userID,
                            },
                        },
                        {
                            organizerIds: {
                                has: user.userID,
                            },
                        },
                    ],
                },
            ],
        },
        orderBy: [{ start: 'asc' }],
        take: 1,
    });
    return appointmentsCount > 0;
};
export const getEdgeAppointmentId = async (user: User, edge: Edge): Promise<number> => {
    const isFirst = edge === 'first';
    const edgeAppointment = await prisma.lecture.findFirst({
        where: {
            isCanceled: false,
            NOT: {
                declinedBy: { has: user.userID },
            },
            AND: [
                { OR: [{ subcourseId: null }, { subcourse: { published: true } }] },
                {
                    OR: [
                        {
                            participantIds: {
                                has: user.userID,
                            },
                        },
                        {
                            organizerIds: {
                                has: user.userID,
                            },
                        },
                    ],
                },
            ],
        },
        orderBy: [isFirst ? { start: 'asc' } : { start: 'desc' }],
        take: 1,
    });
    return edgeAppointment?.id;
};

export const getAppointmentsForUser = async (user: User, take: number, skip: number, cursor?: number, direction?: QueryDirection): Promise<Appointment[]> => {
    if (!direction && !cursor) {
        return await getAppointmentsForUserFromNow(user.userID, take, skip);
    }

    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }

    return await getAppointmentsForUserFromCursor(user.userID, take, skip, cursor, direction);
};

const getAppointmentsForUserFromCursor = async (userId: User['userID'], take: number, skip: number, cursor: number, direction: QueryDirection) => {
    const isNextQuery = direction === 'next';
    const appointments = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            NOT: {
                declinedBy: { has: userId },
            },
            AND: [
                { OR: [{ subcourseId: null }, { subcourse: { published: true } }] },
                {
                    OR: [
                        {
                            participantIds: {
                                has: userId,
                            },
                        },
                        {
                            organizerIds: {
                                has: userId,
                            },
                        },
                    ],
                },
            ],
        },
        orderBy: [isNextQuery ? { start: 'asc' } : { start: 'desc' }],
        take,
        skip: skip,
        cursor: { id: cursor },
    });
    if (!isNextQuery) {
        appointments.reverse();
    }
    return appointments;
};

const getAppointmentsForUserFromNow = async (userId: User['userID'], take: number, skip: number): Promise<Appointment[]> => {
    const appointmentsFromNow = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: {
                gte: moment().subtract(MAXIMUM_APPOINTMENT_DURATION, 'hours').toDate(),
            },
            NOT: {
                declinedBy: { has: userId },
            },
            AND: [
                { OR: [{ subcourseId: null }, { subcourse: { published: true } }] },
                {
                    OR: [
                        {
                            participantIds: {
                                has: userId,
                            },
                        },
                        {
                            organizerIds: {
                                has: userId,
                            },
                        },
                    ],
                },
            ],
        },
        orderBy: { start: 'asc' },
        take,
        skip,
    });

    return appointmentsFromNow;
};

const getAppointmentsForMatchFromNow = async (matchId: Match['id'], userId: User['userID'], take: number, skip: number) => {
    const appointmentsFromNow = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: {
                gte: moment().subtract(MAXIMUM_APPOINTMENT_DURATION, 'hours').toDate(),
            },
            NOT: {
                declinedBy: { has: userId },
            },
            matchId,
        },
        orderBy: { start: 'asc' },
        take,
        skip,
    });

    return appointmentsFromNow;
};

export const getAppointmentsForMatch = async (
    matchId: Match['id'],
    userId: User['userID'],
    take: number,
    skip: number,
    cursor?: number,
    direction?: QueryDirection
) => {
    if (!direction && !cursor) {
        return getAppointmentsForMatchFromNow(matchId, userId, take, skip);
    }
    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }
    const isNextQuery = direction === 'next';
    const appointments = await prisma.lecture.findMany({
        where: {
            matchId,
            isCanceled: false,
            NOT: {
                declinedBy: { has: userId },
            },
        },
        orderBy: [isNextQuery ? { start: 'asc' } : { start: 'desc' }],
        take,
        skip: skip,
        cursor: { id: cursor },
    });
    if (!isNextQuery) {
        appointments.reverse();
    }
    return appointments;
};

export const getEdgeMatchAppointmentId = async (matchId: Match['id'], userId: User['userID'], edge: Edge) => {
    const isFirst = edge === 'first';
    const edgeAppointment = await prisma.lecture.findFirst({
        where: {
            isCanceled: false,
            NOT: {
                declinedBy: { has: userId },
            },
            matchId,
        },
        orderBy: [isFirst ? { start: 'asc' } : { start: 'desc' }],
        take: 1,
    });
    return edgeAppointment?.id;
};
