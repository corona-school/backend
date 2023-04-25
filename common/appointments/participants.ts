import { Lecture } from '../entity/Lecture';
import { prisma } from '../prisma';
import { User } from '../user';

export async function isAppointmentParticipant(lecture: Lecture, user: User): Promise<boolean> {
    return !!(await prisma.lecture.findFirst({
        where: {
            id: lecture.id,
            participants: {
                has: user.userID,
            },
        },
        select: {
            id: true,
        },
    }));
}
