import { Lecture as Appointment } from '../../graphql/generated';
import { prisma } from '../prisma';
import { User } from '../user';

type QueryDirection = 'last' | 'next';

export const getAppointmentsForUser = async (user: User, take?: number, skip?: number, cursor?: number, direction?: QueryDirection): Promise<Appointment[]> => {
    if (!direction && !cursor) {
        return getAppointmentsForUserFromNow(user.userID, take, skip);
    }

    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }

    return getAppointmentsForUserFromCursor(user.userID, take, cursor, direction);
};

const getAppointmentsForUserFromCursor = async (userId: User['userID'], take: number, cursor: number, direction: QueryDirection) => {
    const isNextQuery = direction === 'next';
    const appointments = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
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
        skip: 1, // Skipping the cursor object
        cursor: { id: cursor },
    });
    if (!isNextQuery) {
        appointments.reverse();
    }
    return appointments;
};

const getAppointmentsForUserFromNow = async (userId: User['userID'], take: number, skip: number): Promise<Appointment[]> => {
    return await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: { gte: new Date().toISOString() },
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
};
