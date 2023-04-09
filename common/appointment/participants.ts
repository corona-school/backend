import { getUserType, User } from '../user';
import { Lecture } from '../../graphql/generated';
import { prisma } from '../prisma';

export function isAppointmentParticipant(lecture: Lecture, user: User): boolean {
    const userType = getUserType(user);
    switch (userType) {
        case 'pupil': {
            return !!prisma.appointment_participant_pupil.findFirst({
                where: {
                    appointmentId: lecture.id,
                    pupilId: user.pupilId,
                },
            });
        }
        case 'student': {
            return !!prisma.appointment_participant_student.findFirst({
                where: {
                    appointmentId: lecture.id,
                    studentId: user.studentId,
                },
            });
        }
        case 'screener': {
            return !!prisma.appointment_participant_screener.findFirst({
                where: {
                    appointmentId: lecture.id,
                    screenerId: user.screenerId,
                },
            });
        }
    }
}

export async function addGroupParticipantPupils(subcourseId: number, pupilId: number) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    const participantPupils = appointments.map((a) => ({ appointmentId: a.id, pupilId }));
    await prisma.appointment_participant_pupil.createMany({ data: participantPupils });
}

export async function removeGroupParticipantPupils(subcourseId: number, pupilId: number) {
    const appointments = await prisma.lecture.findMany({
        where: {
            subcourseId,
            start: {
                gte: new Date(),
            },
        },
    });
    await Promise.all(
        appointments.map(async (a) => await prisma.appointment_participant_pupil.delete({ where: { appointmentId_pupilId: { appointmentId: a.id, pupilId } } }))
    );
}

export async function addGroupOrganizer(subcourseId: number, studentId: number) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    const organizers = appointments.map((a) => ({ appointmentId: a.id, studentId }));
    await prisma.appointment_organizer.createMany({ data: organizers });
}

export async function removeGroupOrganizer(subcourseId: number, studentId: number) {
    const appointments = await prisma.lecture.findMany({
        where: {
            subcourseId,
            start: {
                gte: new Date(),
            },
        },
    });
    await Promise.all(
        appointments.map(async (a) => await prisma.appointment_organizer.delete({ where: { appointmentId_studentId: { appointmentId: a.id, studentId } } }))
    );
}
