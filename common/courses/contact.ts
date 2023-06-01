import { course as Course, subcourse as Subcourse, pupil as Pupil, student as Student } from '@prisma/client';
import { Decision } from '../util/decision';
import { getManager } from 'typeorm';
import { File } from '../attachments';
import { Pupil as TypeORMPupil } from '../entity/Pupil';
import { Student as TypeORMStudent } from '../entity/Student';
import * as Notification from '../notification';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { subcourseOverGracePeriod } from './states';

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

    const typeORMPupil = await getManager().findOneOrFail(TypeORMPupil, pupil.id);

    const instructors = (
        await prisma.subcourse_instructors_student.findMany({
            where: { subcourseId: subcourse.id },
            select: { student: true },
        })
    ).map((it) => it.student);

    let attachmentGroup = await Notification.createAttachments(files, typeORMPupil);

    await Promise.all(
        instructors.map(async (instructor) => {
            await Notification.actionTaken(
                instructor,
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

    const student = await getManager().findOneOrFail(TypeORMStudent, instructor.id);
    let attachmentGroup = await Notification.createAttachments(files, student);

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
                participant,
                'participant_course_message',
                {
                    courseName: course.name,
                    participantFirstName: participant.firstname,
                    instructorFirstName: student.firstname,
                    messageTitle: title,
                    messageBody: body,
                    instructorMail: student.email,
                    replyToAddress: student.email as any,
                },
                attachmentGroup
            );
        })
    );

    logger.info(`Student(${student.id}) contacted participants of the Subcourse(${subcourse.id}) with title '${title}' and message '${body}'`);
}
