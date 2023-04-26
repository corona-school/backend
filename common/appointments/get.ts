import { Lecture as Appointment } from '../../graphql/generated';
import { prisma } from '../prisma';
import { User } from '../user';

export const getAppointmentsForUser = async (
    user: User,
    take?: number,
    skip?: number,
    cursor?: number,
    direction?: 'last' | 'next'
): Promise<Appointment[]> => {
    let appointments;

    if (!direction && !cursor) {
        return await getAppointmentsByIdList(user.userID, take, skip);
    }

    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }

    if (direction === 'next' && cursor) {
        appointments = await getNextAppointmentsByIdList(user.userID, take, cursor);
    }

    if (direction === 'last' && cursor) {
        appointments = await getLastAppointmentsByIdList(user.userID, take, cursor);
    }

    return appointments;
};

const getNextAppointmentsByIdList = async (userId: User['userID'], take: number, cursor: number) => {
    return await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            OR: [
                {
                    participants: {
                        has: userId,
                    },
                },
                {
                    organizers: {
                        has: userId,
                    },
                },
            ],
        },
        orderBy: [{ start: 'asc' }],
        take,
        skip: 1, // Skipping the cursor object
        cursor: { id: cursor },
    });
};
const getLastAppointmentsByIdList = async (userId: User['userID'], take: number, cursor: number) => {
    const appointments = await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            OR: [
                {
                    participants: {
                        has: userId,
                    },
                },
                {
                    organizers: {
                        has: userId,
                    },
                },
            ],
        },
        orderBy: [{ start: 'desc' }],
        take,
        skip: 1, // Skipping the cursor object
        cursor: { id: cursor },
    });
    return appointments.reverse();
};

const getAppointmentsByIdList = async (userId: User['userID'], take, skip): Promise<Appointment[]> => {
    return await prisma.lecture.findMany({
        where: {
            isCanceled: false,
            start: { gte: new Date().toISOString() },
            OR: [
                {
                    participants: {
                        has: userId,
                    },
                },
                {
                    organizers: {
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
