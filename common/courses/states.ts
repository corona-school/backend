import { subcourse as Subcourse } from '@prisma/client';
import { Decision } from '../util/decision';
import { prisma } from '../prisma';

export async function hasStarted(subcourse: Subcourse) {
    const startedLectures = await prisma.lecture.count({
        where: {
            subcourseId: subcourse.id,
            start: { lte: new Date() },
        },
    });
    return startedLectures === 0;
}

export async function canPublish(subcourse: Subcourse): Promise<Decision> {
    const course = await prisma.course.findUnique({ where: { id: subcourse.courseId } });
    if (course.courseState !== 'allowed') {
        return { allowed: false, reason: 'course-not-allowed' };
    }

    const lectures = await prisma.lecture.findMany({ where: { subcourseId: subcourse.id } });
    if (lectures.length == 0) {
        return { allowed: false, reason: 'no-lectures' };
    }

    let currentDate = new Date();
    const pastLectures = lectures.filter((lecture) => +lecture.start < +currentDate);
    if (pastLectures.length !== 0) {
        return { allowed: false, reason: 'past-lectures' };
    }

    return { allowed: true };
}

export async function subcourseOver(subcourse: Subcourse) {
    const lastLecture = await prisma.lecture.findFirst({
        where: { subcourseId: subcourse.id },
        orderBy: { start: 'desc' },
    });

    if (!lastLecture) {
        return false;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return lastLecture.start < thirtyDaysAgo;
}
