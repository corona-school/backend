import { Lecture as Appointment } from '../entity/Lecture';
import { getUserType, User } from '../user';
import { prisma } from '../prisma';
import { AttendanceStatus } from '../entity/AppointmentAttendee';

export const getAppointmentsForUser = async (
    user: User,
    take?: number,
    skip?: number,
    cursor?: number,
    direction?: 'last' | 'next'
): Promise<Appointment[]> => {
    const userType = getUserType(user);
    let appointmentIds: number[] = [];
    switch (userType) {
        case 'student':
            appointmentIds = await getStudentAppointmentIds(user.studentId);
            break;
        case 'pupil':
            appointmentIds = await getPupilAppointmentIds(user.pupilId);
            break;
        case 'screener':
            appointmentIds = await getScreenerAppointmentIds(user.screenerId);
            break;
        default:
            throw new Error(`Unknown user type: ${userType}`);
    }
    appointmentIds = removeDuplicateIds(appointmentIds);

    let appointments;

    if (!direction && !cursor) {
        return await getAppointmentsByIdList(appointmentIds, take, skip);
    }

    if (!direction || !cursor) {
        throw Error('Cursor or direction not specified for cursor based pagination');
    }

    if (direction === 'next' && cursor) {
        appointments = await getNextAppointmentsByIdList(appointmentIds, take, cursor);
    }

    if (direction === 'last' && cursor) {
        appointments = await getLastAppointmentsByIdList(appointmentIds, take, cursor);
    }

    return appointments;
};

const getNextAppointmentsByIdList = async (appointmentIds: number[], take: number, cursor: number) => {
    return (await prisma.lecture.findMany({
        where: {
            AND: {
                id: {
                    in: appointmentIds,
                },
                isCanceled: false,
            },
        },
        orderBy: [{ start: 'asc' }],
        take,
        skip: 1, // Skipping the cursor object
        cursor: { id: cursor },
    })) as unknown as Appointment[];
};
const getLastAppointmentsByIdList = async (appointmentIds: number[], take: number, cursor: number) => {
    const appointments = (await prisma.lecture.findMany({
        where: {
            AND: {
                id: {
                    in: appointmentIds,
                },
                isCanceled: false,
            },
        },
        orderBy: [{ start: 'desc' }],
        take,
        skip: 1, // Skipping the cursor object
        cursor: { id: cursor },
    })) as unknown as Appointment[];
    return appointments.reverse();
};

const getAppointmentsByIdList = async (appointmentIds: number[], take, skip): Promise<Appointment[]> => {
    return (await prisma.lecture.findMany({
        where: {
            AND: {
                id: {
                    in: appointmentIds,
                },
                isCanceled: false,
                start: { gte: new Date().toISOString() },
            },
        },
        orderBy: [{ start: 'asc' }],
        take,
        skip,
    })) as unknown as Appointment[];
};

const mergeIdLists = (...listsOfIds: number[][]): number[] => listsOfIds.reduce((flat, current) => flat.concat(current), []);

const removeDuplicateIds = (list: number[]) => [...new Set(list)];

const mapAppointmentId = (relation) => relation.appointmentId;
const selectAccepted = (addWhere: {}) => ({ where: { status: AttendanceStatus.ACCEPTED, ...addWhere }, select: { appointmentId: true } });

const getStudentAppointmentIds = async (studentId: number): Promise<number[]> => {
    const selection = selectAccepted({ studentId });
    const appointmentsOrganizer: number[] = (await prisma.appointment_organizer.findMany(selection)).map(mapAppointmentId);
    const appointmentsParticipant: number[] = (await prisma.appointment_participant_student.findMany(selection)).map(mapAppointmentId);

    return mergeIdLists(appointmentsOrganizer, appointmentsParticipant);
};

const getPupilAppointmentIds = async (pupilId: number): Promise<number[]> => {
    const selection = selectAccepted({ pupilId });
    return (await prisma.appointment_participant_pupil.findMany(selection)).map(mapAppointmentId);
};

const getScreenerAppointmentIds = async (screenerId: number): Promise<number[]> => {
    const selection = selectAccepted({ screenerId });
    return (await prisma.appointment_participant_pupil.findMany(selection)).map(mapAppointmentId);
};
