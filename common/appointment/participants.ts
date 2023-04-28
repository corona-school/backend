import { Lecture } from '../entity/Lecture';
import { prisma } from '../prisma';
import { User } from '../user';

export async function isAppointmentParticipant(lecture: Lecture, user: User): Promise<boolean> {
    return !!(await prisma.lecture.findFirst({
        where: {
            id: lecture.id,
            participantIds: {
                has: user.userID,
            },
        },
        select: {
            id: true,
        },
    }));
}

export async function addGroupAppointmentsParticipant(subcourseId: number, userId: string) {
    await prisma.lecture.updateMany({
        where: { subcourseId },
        data: { participantIds: { push: userId } },
    });
}

export async function removeGroupAppointmentsParticipant(subcourseId: number, userId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId, participantIds: { hasSome: userId }, start: { gte: new Date() } } });

    await Promise.all(
        appointments.map(async (a) => {
            const participants = a.participantIds;
            const newParticipants = participants.filter((pId) => pId !== userId);
            await prisma.lecture.update({
                where: { id: a.id },
                data: { participantIds: { set: newParticipants } },
            });
        })
    );
}

export async function addGroupAppointmentsOrganizer(subcourseId: number, organizerId: string) {
    await prisma.lecture.updateMany({
        where: { subcourseId },
        data: { organizerIds: { push: organizerId } },
    });
}

export async function removeGroupAppointmentsOrganizer(subcourseId: number, organizerId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    await Promise.all(
        appointments.map(async (a) => {
            const organizers = a.organizerIds;
            const newOrganizers = organizers.filter((oId) => oId !== organizerId);
            await prisma.lecture.update({
                where: { id: a.id },
                data: { organizerIds: { set: newOrganizers } },
            });
        })
    );
}
