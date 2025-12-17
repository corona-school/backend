import { course_category_enum, Prisma, subcourse as Subcourse } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { join } from 'path';
import { prisma } from '../prisma';
import { getSubcourse } from '../../graphql/util';
import { getLogger } from '../logger/logger';

const logger = getLogger('CourseUtil');

const courseDefaultImage = process.env.WEBFLOW_COURSE_DEFAULT_IMAGE;

export const COURSE_IMAGES_DEFAULT_PATH = 'courses/images';
export const COURSE_IMAGE_DEFAULT_NAME = 'cover';

export function getCourseImageKey(course: { id: number }, fileType: string) {
    return join(COURSE_IMAGES_DEFAULT_PATH, `${course.id}`, `${COURSE_IMAGE_DEFAULT_NAME}.${fileType}`);
}

export function getCourseImageURL(course: { imageKey?: string }) {
    return course.imageKey ? accessURLForKey(course.imageKey) : courseDefaultImage;
}

export async function getSubcourseInstructors(subcourse: Subcourse) {
    return await prisma.student.findMany({
        where: { subcourse_instructors_student: { some: { subcourseId: subcourse.id } } },
    });
}

export async function getSubcourseParticipants(subcourse: Subcourse) {
    return await prisma.pupil.findMany({
        where: { subcourse_participants_pupil: { some: { subcourseId: subcourse.id } } },
    });
}

export const getGradeRangeLabel = (minGrade: number, maxGrade: number) => {
    const minGradeLabel = minGrade === 14 ? 'in Ausbildung' : `${minGrade}. Klasse`;
    const maxGradeLabel = maxGrade === 14 ? 'in Ausbildung' : `${maxGrade}. Klasse`;

    if (minGrade === maxGrade) {
        return minGradeLabel;
    }

    return `${minGradeLabel} - ${maxGradeLabel}`;
};

export async function getCourseOfSubcourse(subcourse: Subcourse) {
    return await prisma.course.findUniqueOrThrow({
        where: { id: subcourse.courseId },
    });
}

export async function getCourseParticipantCount(subcourse: Subcourse) {
    return await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
}

export async function getCourseCapacity(subcourse: Subcourse) {
    return (await getCourseParticipantCount(subcourse)) / (subcourse.maxParticipants || 1);
}

export async function getCourseFreePlaces(subcourse: Subcourse) {
    return Math.max(0, subcourse.maxParticipants - (await getCourseParticipantCount(subcourse)));
}

export interface SubcourseProspect {
    pupilId: number;
    conversationId: string;
}

export function getSubcourseProspects(subcourse: Pick<Subcourse, 'prospectChats'>): SubcourseProspect[] {
    return subcourse.prospectChats as unknown as SubcourseProspect[];
}

export async function addSubcourseProspect(subcourseId: number, prospect: SubcourseProspect) {
    await prisma.subcourse.update({
        where: {
            id: subcourseId,
        },
        data: {
            prospectChats: {
                push: prospect as unknown as Prisma.InputJsonObject,
            },
        },
    });
    logger.info(`Added Pupil(${prospect.pupilId}) to the prospects of Subcourse(${subcourseId})`);
}

export async function removeSubcourseProspect(subcourseId: number, pupilId: number): Promise<boolean> {
    const prospects = getSubcourseProspects(await getSubcourse(subcourseId));
    const updatedProspects = prospects.filter((it) => it.pupilId !== pupilId);
    if (prospects.length === updatedProspects.length) {
        return false;
    }
    await prisma.subcourse.update({
        where: {
            id: subcourseId,
        },
        data: {
            prospectChats: {
                set: updatedProspects as unknown as Prisma.InputJsonValue[],
            },
        },
    });
    logger.info(`Removed Pupil(${pupilId}) from the prospects of Subcourse(${subcourseId})`);
    return true;
}

export async function isSubcourseSilent(subcourseId: number): Promise<boolean> {
    const subcourse = await prisma.subcourse.findUnique({
        where: { id: subcourseId },
        include: { course: { select: { category: true } } },
    });

    return subcourse.course.category === course_category_enum.homework_help;
}
