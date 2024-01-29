import { subcourse as Subcourse, course as Course, student as Student, course_coursestate_enum as CourseState, Prisma } from '@prisma/client';
import { Decision } from '../util/decision';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { getCourse } from '../../graphql/util';
import { fillSubcourse } from './participants';
import { PrerequisiteError } from '../util/error';
import { getLastLecture } from './lectures';
import moment from 'moment';
import { ChatType, SystemMessage } from '../chat/types';
import {
    addParticipant,
    ConversationInfos,
    markConversationAsReadOnlyForPupils,
    markConversationAsWriteable,
    sendSystemMessage,
    updateConversation,
} from '../chat';
import systemMessages from '../chat/localization';
import { cancelAppointment } from '../appointment/cancel';
import { User, userForStudent } from '../user';
import { addGroupAppointmentsOrganizer } from '../appointment/participants';
import { sendPupilCoursePromotion, sendSubcourseCancelNotifications } from './notifications';
import * as Notification from '../../common/notification';
import { deleteAchievementsForSubcourse } from '../../common/achievement/delete';

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

/* ------------------ Course Review ----------------- */
export async function allowCourse(course: Course, screeningComment: string | null) {
    await prisma.course.update({ data: { screeningComment, courseState: CourseState.allowed }, where: { id: course.id } });
    logger.info(`Admin allowed (approved) Course(${course.id}) with screening comment: ${screeningComment}`, { courseId: course.id, screeningComment });

    // Usually when a new course is created, instructors also create a proper subcourse with it
    // and then forget to publish it after it was approved. Thus we just publish during approval,
    // assuming the subcourses are ready:
    const subcourses = await prisma.subcourse.findMany({
        where: { courseId: course.id },
        include: { subcourse_instructors_student: { include: { student: true } } },
    });
    for (const subcourse of subcourses) {
        if (await canPublish(subcourse)) {
            await publishSubcourse(subcourse);
        }
    }
}

export async function denyCourse(course: Course, screeningComment: string | null) {
    await prisma.course.update({ data: { screeningComment, courseState: CourseState.denied }, where: { id: course.id } });
    logger.info(`Admin denied Course${course.id}) with screening comment: ${screeningComment}`, { courseId: course.id, screeningComment });
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

    const currentDate = moment();
    const pastLectures = lectures.filter((lecture) => moment(lecture.start).isBefore(currentDate));
    if (pastLectures.length !== 0) {
        return { allowed: false, reason: 'past-lectures' };
    }

    return { allowed: true };
}

export async function publishSubcourse(subcourse: Prisma.subcourseGetPayload<{ include: { subcourse_instructors_student: { include: { student: true } } } }>) {
    const can = await canPublish(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot Publish Subcourse(${subcourse.id}), reason: ${can.reason}`);
    }
    await prisma.subcourse.update({ data: { published: true, publishedAt: new Date() }, where: { id: subcourse.id } });
    logger.info(`Subcourse (${subcourse.id}) was published`);

    const course = await getCourse(subcourse.courseId);
    if (course.category !== 'focus') {
        await sendPupilCoursePromotion(subcourse);
        logger.info(`Subcourse(${subcourse.id}) was automatically promoted`);
    }

    await Promise.all(
        subcourse.subcourse_instructors_student.map((instructor) =>
            Notification.actionTaken(userForStudent(instructor.student), 'instructor_course_approved', {
                courseName: course.name,
                relation: `subcourse/${subcourse.id}`,
            })
        )
    );
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

export async function cancelSubcourse(user: User, subcourse: Subcourse) {
    const can = await canCancel(subcourse);
    if (!can.allowed) {
        throw new Error(`Cannot cancel Subcourse(${subcourse.id}), reason: ${can.reason}`);
    }

    await prisma.subcourse.update({ data: { cancelled: true }, where: { id: subcourse.id } });
    const course = await getCourse(subcourse.courseId);
    const courseAppointments = await prisma.lecture.findMany({ where: { subcourseId: subcourse.id } });
    for (const appointment of courseAppointments) {
        await cancelAppointment(user, appointment, /* silent */ true, /* force */ true);
    }
    await sendSubcourseCancelNotifications(course, subcourse);
    logger.info(`Subcourse (${subcourse.id}) was cancelled`);

    await deleteAchievementsForSubcourse(subcourse.id);
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

    const isMaxParticipantsChanged = Boolean(update.maxParticipants);
    const isGroupChatTypeChanged = Boolean(update.groupChatType && subcourse.groupChatType !== update.groupChatType);

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
                        groupType: ChatType.NORMAL,
                    },
                };

                await markConversationAsWriteable(subcourse.conversationId);
                await updateConversation(conversationToBeUpdated);
                await sendSystemMessage(systemMessages.de.toGroupChat, subcourse.conversationId, SystemMessage.GROUP_CHANGED);
            } else if (update.groupChatType === ChatType.ANNOUNCEMENT) {
                const conversationToBeUpdated: { id: string } & ConversationInfos = {
                    id: subcourse.conversationId,
                    custom: {
                        groupType: ChatType.ANNOUNCEMENT,
                    },
                };
                await markConversationAsReadOnlyForPupils(subcourse.conversationId);
                await updateConversation(conversationToBeUpdated);
                await sendSystemMessage(systemMessages.de.toAnnouncementChat, subcourse.conversationId, SystemMessage.GROUP_CHANGED);
            }
        }
    }

    const result = await prisma.subcourse.update({ data: { ...update }, where: { id: subcourse.id } });

    if (isMaxParticipantsChanged) {
        await fillSubcourse(result);
    }

    return result;
}

export async function addCourseInstructor(user: User | null, course: Course, newInstructor: Student) {
    await prisma.course_instructors_student.create({ data: { courseId: course.id, studentId: newInstructor.id } });
    logger.info(`Student (${newInstructor.id}) was added as an instructor to Course(${course.id}) by User(${user?.userID})`);
}

export async function addSubcourseInstructor(user: User | null, subcourse: Subcourse, newInstructor: Student) {
    await prisma.subcourse_instructors_student.create({ data: { subcourseId: subcourse.id, studentId: newInstructor.id } });

    await addGroupAppointmentsOrganizer(subcourse.id, newInstructor);

    if (subcourse.conversationId) {
        const newInstructorUser = userForStudent(newInstructor);
        await addParticipant(newInstructorUser, subcourse.conversationId, subcourse.groupChatType as ChatType);
    }

    const { name } = await prisma.course.findUnique({ where: { id: subcourse.courseId }, select: { name: true } });
    await Notification.actionTaken(userForStudent(newInstructor), 'instructor_course_created', {
        courseName: name,
        relation: `subcourse/${subcourse.id}`,
    });
    logger.info(`Student (${newInstructor.id}) was added as an instructor to Subcourse(${subcourse.id}) by User(${user?.userID})`);
}
