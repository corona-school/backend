import { course as Course, subcourse as Subcourse, pupil as Pupil, student as Student } from '@prisma/client';
import { Decision } from '../util/decision';
import { File } from '../attachments';
import * as Notification from '../notification';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { subcourseOverGracePeriod } from './states';
import { userForPupil, userForStudent } from '../user';

const logger = getLogger('CourseContact');

export async function canContactParticipants(subcourse: Subcourse): Promise<Decision> {
    if (await subcourseOverGracePeriod(subcourse)) {
        return { allowed: false, reason: 'course-ended' };
    }

    return { allowed: true };
}

export async function canContactInstructors(subcourse: Subcourse): Promise<Decision> {
    if (!subcourse.allowChatContactParticipants) {
        return { allowed: false, reason: 'contact-not-allowed' };
    }

    if (await subcourseOverGracePeriod(subcourse)) {
        return { allowed: false, reason: 'course-ended' };
    }

    return { allowed: true };
}

export async function contactInstructors(course: Course, subcourse: Subcourse, pupil: Pupil, title: string, body: string, files: File[]) {
    const decision = await canContactInstructors(subcourse);
    if (!decision.allowed) {
        throw new Error(`Not allowed to contact instructors - ${decision.reason}`);
    }

    const instructors = (
        await prisma.subcourse_instructors_student.findMany({
            where: { subcourseId: subcourse.id },
            select: { student: true },
        })
    ).map((it) => it.student);

    const attachmentGroup = await Notification.createAttachments(files, userForPupil(pupil));

    await Promise.all(
        instructors.map(async (instructor) => {
            await Notification.actionTaken(
                userForStudent(instructor),
                'instructor_course_participant_message',
                {
                    instructorFirstName: instructor.firstname,
                    participantFirstName: pupil.firstname,
                    courseName: course.name,
                    messageTitle: title,
                    messageBody: body,
                    participantMail: pupil.email,
                    replyToAddress: pupil.email as any,
                },
                attachmentGroup
            );
        })
    );

    logger.info(`Pupil(${pupil.id}) contacted the instructors of Subcourse(${subcourse.id}) with title '${title}' and message '${body}'`);
}

export async function contactParticipants(
    course: Course,
    subcourse: Subcourse,
    instructor: Student,
    title: string,
    body: string,
    files: File[],
    participants: number[]
) {
    if (await subcourseOverGracePeriod(subcourse)) {
        throw new Error(`Cannot contact participants as the course is over`);
    }

    const attachmentGroup = await Notification.createAttachments(files, userForStudent(instructor));

    const selectedParticipants = await prisma.pupil.findMany({
        where: {
            active: true,
            id: { in: participants },
            subcourse_participants_pupil: { some: { subcourseId: subcourse.id } },
        },
    });

    await Promise.all(
        selectedParticipants.map(async (participant) => {
            await Notification.actionTaken(
                userForPupil(participant),
                'participant_course_message',
                {
                    courseName: course.name,
                    participantFirstName: participant.firstname,
                    instructorFirstName: instructor.firstname,
                    messageTitle: title,
                    messageBody: body,
                    instructorMail: instructor.email,
                    replyToAddress: instructor.email as any,
                },
                attachmentGroup
            );
        })
    );

    logger.info(`Student(${instructor.id}) contacted participants of the Subcourse(${subcourse.id}) with title '${title}' and message '${body}'`);
}
