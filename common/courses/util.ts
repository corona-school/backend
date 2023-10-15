import { course as Course, subcourse as Subcourse } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { join } from 'path';
import { prisma } from '../prisma';

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

export async function getCourseOfSubcourse(subcourse: Subcourse) {
    return await prisma.course.findUniqueOrThrow({
        where: { id: subcourse.courseId },
    });
}
