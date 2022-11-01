import { subcourse as Subcourse, lecture as Lecture } from '@prisma/client';
import { prisma } from '../prisma';

export async function getFirstLecture(subcourse: Subcourse): Promise<Lecture> {
    return await prisma.lecture.findFirstOrThrow({
        where: { subcourseId: subcourse.id },
        orderBy: { start: 'asc' },
    });
}
