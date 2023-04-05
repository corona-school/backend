import { subcourse as Subcourse } from '@prisma/client';
import { Decision } from '../util/decision';
import { prisma } from '../prisma';
import { getLogger } from 'log4js';
import { getCourse } from '../../graphql/util';
import { sendPupilCourseSuggestion, sendSubcourseCancelNotifications } from '../mails/courses';
import { fillSubcourse } from './participants';
import { PrerequisiteError } from '../util/error';
import { getLastLecture } from './lectures';

const logger = getLogger('Course States');

/* -------------- Subcourse Timing ------------- */

export async function hasStarted(subcourse: Subcourse) {
    const startedLectures = await prisma.lecture.count({
        where: {
            subcourseId: subcourse.id,
            start: { lte: new Date() },
        },
    });
    return startedLectures === 0;
}


export async function subcourseOverGracePeriod(subcourse: Subcourse) {
    const lastLecture = await getLastLecture(subcourse);

    if (!lastLecture) {
        return false;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return lastLecture.start < thirtyDaysAgo;
}

export async function subcourseOver(subcourse: Subcourse) {
    const lastLecture = await getLastLecture(subcourse);

    if (!lastLecture) {
        return false;
    }

    const now = new Date();
    return lastLecture.start < now;
}

/* ------------------ Subcourse Publish ------------- */

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

export async function publishSubcourse(subcourse: Subcourse) {
    const can = await canPublish(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot Publish Subcourse(${subcourse.id}), reason: ${can.reason}`);
    }

    await prisma.subcourse.update({ data: { published: true, publishedAt: new Date() }, where: { id: subcourse.id } });
    logger.info(`Subcourse (${subcourse.id}) was published`);

    const course = await getCourse(subcourse.courseId);
    await sendPupilCourseSuggestion(course, subcourse, 'instructor_subcourse_published');
}

/* ---------------- Subcourse Cancel ------------ */

export async function canCancel(subcourse: Subcourse): Promise<Decision> {
    if (!subcourse.published) {
        return { allowed: false, reason: 'not-published' };
    }

    if (subcourse.cancelled) {
        return { allowed: false, reason: 'already-cancelled' };
    }

    if (await subcourseOver(subcourse)) {
        return { allowed: false, reason: 'subcourse-ended' };
    }

    return { allowed: true };
}

export async function cancelSubcourse(subcourse: Subcourse) {
    const can = await canCancel(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot cancel Subcourse(${subcourse.id}), reason: ${can.reason}`);
    }

    await prisma.subcourse.update({ data: { cancelled: true }, where: { id: subcourse.id } });
    const course = await getCourse(subcourse.courseId);
    await sendSubcourseCancelNotifications(course, subcourse);
    logger.info(`Subcourse (${subcourse.id}) was cancelled`);
}


/* --------------- Modify Subcourse ------------------- */

export async function canEditSubcourse(subcourse: Subcourse): Promise<Decision> {
    if (subcourse.published && await subcourseOver(subcourse)) {
        return { allowed: false, reason: 'course-ended' };
    }

    return { allowed: true };
}

export async function editSubcourse(subcourse: Subcourse, update: Partial<Subcourse>) {
    const can = await canEditSubcourse(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot edit Subcourse(${subcourse.id}) reason: ${can.reason}`);
    }

    const isMaxParticipantsChanged: boolean = Boolean(update.maxParticipants);

    if (isMaxParticipantsChanged) {
        const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
        if (update.maxParticipants < participantCount) {
            throw new PrerequisiteError(`Decreasing the number of max participants below the current number of participants is not allowed`);
        }
    }

    const result = await prisma.subcourse.update({ data: { ...update }, where: { id: subcourse.id } });

    if (isMaxParticipantsChanged) {
        await fillSubcourse(result);
    }

    return result;
}