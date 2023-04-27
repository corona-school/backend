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

export async function addGroupParticipant(subcourseId: number, pupilId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    await Promise.all(
        appointments.map(
            async (a) =>
                await prisma.lecture.updateMany({
                    where: { id: a.id },
                    data: { participantIds: { push: pupilId } },
                })
        )
    );
}

export async function removeGroupParticipant(subcourseId: number, pupilId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId, participantIds: { hasSome: pupilId }, start: { gte: new Date() } } });
    await Promise.all(
        appointments.map(async (a) => {
            const participants = a.participantIds;
            const newParticipants = participants.filter((pId) => pId !== pupilId);

            await prisma.lecture.updateMany({
                where: { id: a.id },
                data: { participantIds: { set: newParticipants } },
            });
        })
    );
}

export async function addGroupOrganizer(subcourseId: number, organizerId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    await Promise.all(
        appointments.map(
            async (a) =>
                await prisma.lecture.updateMany({
                    where: { id: a.id },
                    data: { organizerIds: { push: organizerId } },
                })
        )
    );
}

export async function removeGroupOrganizer(subcourseId: number, organizerId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });
    await Promise.all(
        appointments.map(async (a) => {
            const organizers = a.organizerIds;
            const newOrganizers = organizers.filter((oId) => oId !== organizerId);

            await prisma.lecture.updateMany({
                where: { id: a.id },
                data: { organizerIds: { set: newOrganizers } },
            });
        })
    );
}
