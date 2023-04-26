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
                    where: { subcourseId },
                    data: { participantIds: { push: pupilId } },
                })
        )
    );
}

export async function removeGroupParticipant(subcourseId: number, pupilId: string) {
    const appointments = await prisma.lecture.findMany({ where: { subcourseId } });

    await Promise.all(
        appointments.map(async (a) => {
            const participants = a.participantIds;
            await prisma.lecture.updateMany({
                where: { subcourseId },
                data: { participantIds: { set: participants.filter((pId) => pId !== pupilId) } },
            });
        })
    );
}
