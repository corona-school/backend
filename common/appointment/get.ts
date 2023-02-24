import { Lecture as Appointment } from '../entity/Lecture';
import { getUserType, User } from '../user';
import { prisma } from '../prisma';
import { AttendanceStatus } from '../entity/AppointmentAttendee';

export const getAppointmentsForUser = async (user: User, take?: number, skip?: number): Promise<Appointment[]> => {
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

    appointmentIds = deduplicate(sortIds(appointmentIds));

    const appointments = await getAppointmentsByIdList(appointmentIds, take, skip);

    return appointments;
};

const getAppointmentsByIdList = async (appointmentIds: number[], take, skip): Promise<Appointment[]> => {
    return (await prisma.lecture.findMany({
        where: {
            AND: {
                id: {
                    in: appointmentIds,
                },
                OR: [{ isCanceled: false }],
            },
        },
        orderBy: [{ start: 'asc' }],
        take,
        skip,
    })) as unknown as Appointment[];
};

const mergeIdLists = (...listsOfIds: number[][]): number[] => listsOfIds.reduce((flat, current) => flat.concat(current), []);

const deduplicate = (list: number[]) => [...new Set(list)];

const sortIds = (list: number[]) => [...new Uint32Array([...list]).sort()];

const mapAppointmentId = (relation) => relation.appointmentId;
const select = (addWhere: {}) => ({ where: { status: AttendanceStatus.ACCEPTED, ...addWhere }, select: { appointmentId: true } });

const getStudentAppointmentIds = async (studentId: number): Promise<number[]> => {
    const selection = select({ studentId });
    const appointmentsOrganizer: number[] = (await prisma.appointment_organizer.findMany(selection)).map(mapAppointmentId);
    const appointmentsParticipant: number[] = (await prisma.appointment_participant_student.findMany(selection)).map(mapAppointmentId);

    return mergeIdLists(appointmentsOrganizer, appointmentsParticipant);
};

const getPupilAppointmentIds = async (pupilId: number): Promise<number[]> => {
    const selection = select({ pupilId });
    return (await prisma.appointment_participant_pupil.findMany(selection)).map(mapAppointmentId);
};

const getScreenerAppointmentIds = async (screenerId: number): Promise<number[]> => {
    const selection = select({ screenerId });
    return (await prisma.appointment_participant_pupil.findMany(selection)).map(mapAppointmentId);
};
