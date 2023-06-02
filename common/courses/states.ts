import { subcourse as Subcourse } from '@prisma/client';
import { Decision } from '../util/decision';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { getCourse } from '../../graphql/util';
import { sendSubcourseCancelNotifications } from '../mails/courses';
import { fillSubcourse } from './participants';
import { PrerequisiteError } from '../util/error';
import { getLastLecture } from './lectures';
import moment from 'moment';
import { ChatType } from '../chat/types';
import { ConversationInfos, markConversationAsReadOnly, markConversationAsWriteable, updateConversation } from '../chat';

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

// After the course ended, participants might want to send feedback to the instructor or ask followup questions,
// instructors might want to send some final results or promote a next course. Thus certain course interactions are
// allowed for a 'grace period'
export async function subcourseOverGracePeriod(subcourse: Subcourse) {
    const lastLecture = await getLastLecture(subcourse);

    if (!lastLecture) {
        return false;
    }

    const thirtyDaysAgo = moment().subtract(30, 'days');

    return moment(lastLecture.start).add(lastLecture.duration, 'minutes').isBefore(thirtyDaysAgo);
}

export async function subcourseOver(subcourse: Subcourse) {
    const lastLecture = await getLastLecture(subcourse);

    if (!lastLecture) {
        return false;
    }

    const now = moment();
    return moment(lastLecture.start).add(lastLecture.duration, 'minutes').isBefore(now);
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

    let currentDate = moment();
    const pastLectures = lectures.filter((lecture) => moment(lecture.start).isBefore(currentDate));
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

    // const course = await getCourse(subcourse.courseId);
    // TODO: Seperate Issue, Promotion every 7 days
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
    if (subcourse.published && (await subcourseOver(subcourse))) {
        return { allowed: false, reason: 'course-ended' };
    }

    return { allowed: true };
}

export async function editSubcourse(subcourse: Subcourse, update: Partial<Subcourse>) {
    const can = await canEditSubcourse(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot edit Subcourse(${subcourse.id}) reason: ${can.reason}`);
    }
    const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });

    const isMaxParticipantsChanged: boolean = Boolean(update.maxParticipants);
    const isGroupChatTypeChanged: boolean = Boolean(update.groupChatType);

    if (isMaxParticipantsChanged) {
        if (update.maxParticipants < participantCount) {
            throw new PrerequisiteError(`Decreasing the number of max participants below the current number of participants is not allowed`);
        }
    }
    if (isGroupChatTypeChanged) {
        //* if the subcourse has already an conversation, the conversation has to be updated
        if (subcourse.conversationId !== null) {
            if (update.groupChatType === ChatType.NORMAL) {
                const conversationToBeUpdated: { id: string } & ConversationInfos = {
                    id: subcourse.conversationId,
                    custom: {
                        type: 'course',
                    },
                };

                markConversationAsWriteable(subcourse.conversationId);
                updateConversation(conversationToBeUpdated);
            } else if (update.groupChatType === ChatType.ANNOUNCEMENT) {
                const conversationToBeUpdated: { id: string } & ConversationInfos = {
                    id: subcourse.conversationId,
                    custom: {
                        type: 'announcement',
                    },
                };
                markConversationAsReadOnly(subcourse.conversationId);
                updateConversation(conversationToBeUpdated);
            }
        }
    }

    const result = await prisma.subcourse.update({ data: { ...update }, where: { id: subcourse.id } });

    if (isMaxParticipantsChanged) {
        await fillSubcourse(result);
    }

    return result;
}
