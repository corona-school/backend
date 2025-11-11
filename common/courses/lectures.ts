import { subcourse as Subcourse, lecture as Lecture } from '@prisma/client';
import { prisma } from '../prisma';

export async function getFirstLecture(subcourse: Subcourse): Promise<Lecture> {
    return await prisma.lecture.findFirstOrThrow({
        where: { subcourseId: subcourse.id, isCanceled: false },
        orderBy: { start: 'asc' },
    });
}

export async function getLastLecture(subcourse: Subcourse): Promise<Lecture | null> {
    return await prisma.lecture.findFirst({
        where: { subcourseId: subcourse.id, isCanceled: false },
        orderBy: { start: 'desc' },
    });
}
