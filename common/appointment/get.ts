import moment from 'moment';
import { Lecture as Appointment } from '../../graphql/generated';
import { prisma } from '../prisma';
import { User } from '../user';

type QueryDirection = 'last' | 'next';

export const hasAppointmentsForUser = async (user: User): Promise<boolean> => {
    const appointmentsCount = await prisma.lecture.count({
        where: {
            isCanceled: false,
            subcourse: { published: true },
            NOT: {
                declinedBy: { has: user.userID },
            },
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
        orderBy: [{ start: 'asc' }],
        take: 1,
    });
    return appointmentsCount > 0;
};
export const getLastAppointmentId = async (user: User): Promise<number> => {
    const lastAppointment = await prisma.lecture.findFirst({
        where: {
            isCanceled: false,
            subcourse: { published: true },
            NOT: {
                declinedBy: { has: user.userID },
            },
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
        orderBy: [{ start: 'desc' }],
        take: 1,
    });
    return lastAppointment?.id;
};

export const getAppointmentsForUser = async (user: User, take: number, skip: number, cursor?: number, direction?: QueryDirection): Promise<Appointment[]> => {
    if (!direction && !cursor) {
        return getAppointmentsForUserFromNow(user.userID, take, skip);
    }

    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }

    return getAppointmentsForUserFromCursor(user.userID, take, skip, cursor, direction);
};

const getAppointmentsForUserFromCursor = async (userId: User['userID'], take: number, skip: number, cursor: number, direction: QueryDirection) => {
    const isNextQuery = direction === 'next';
    const appointments = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            subcourse: { published: true },
            NOT: {
                declinedBy: { has: userId },
            },
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
    /**
     * The current maximum duration of an appointment is 4 hours.
     */
    const MAXIMUM_APPOINTMENT_DURATION = 4;

    const appointmentsFromNow = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: {
                gte: moment().subtract(MAXIMUM_APPOINTMENT_DURATION, 'hours').toDate(),
            },
            NOT: {
                declinedBy: { has: userId },
            },
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
        orderBy: [{ start: 'asc' }],
        take,
        skip,
    });

    return appointmentsFromNow;
};
