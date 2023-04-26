import { course as Course } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { join } from 'path';

const courseDefaultImage = process.env.WEBFLOW_COURSE_DEFAULT_IMAGE;

export const COURSE_IMAGES_DEFAULT_PATH = "courses/images";
export const COURSE_IMAGE_DEFAULT_NAME = "cover";


export function getCourseImageKey(course: { id: number }, fileType: string) {
    return join(COURSE_IMAGES_DEFAULT_PATH, `${course.id}`, `${COURSE_IMAGE_DEFAULT_NAME}.${fileType}`);
}

export function getCourseImageURL(course: { imageKey?: string }) {
    return course.imageKey ? accessURLForKey(course.imageKey) : courseDefaultImage;
}
