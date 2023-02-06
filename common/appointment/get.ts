import { Lecture as Appointment } from '../entity/Lecture';
import { getUserType, User } from '../user';
import { prisma } from '../prisma';
import { AttendanceStatus } from '../entity/AppointmentAttendee';
import { lecture } from '@prisma/client';

export const getAppointmentsForUser = async (user: User, take?: number, skip?: number): Promise<Appointment[]> => {
    switch (getUserType(user)) {
        case 'student':
            return await getStudentAppointments(user, take, skip);
    }
    return null;
};

const getStudentAppointments = async (user: User, take?: number, skip?: number): Promise<Appointment[]> => {
    return (await prisma.lecture.findMany({
        include: {
            appointment_organizer: { where: { studentId: user.studentId, status: AttendanceStatus.ACCEPTED }, select: { studentId: true } },
            appointment_participant_student: { where: { studentId: user.studentId, status: AttendanceStatus.ACCEPTED } },
        },
        distinct: ['id'],
        take,
        skip,
    })) as lecture[] as unknown[] as Appointment[];
};
