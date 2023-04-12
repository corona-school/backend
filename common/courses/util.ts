import { course as Course } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';

const courseDefaultImage = process.env.WEBFLOW_COURSE_DEFAULT_IMAGE;

export function getCourseImageURL(course: { imageKey?: string }) {
    return course.imageKey ? accessURLForKey(course.imageKey) : courseDefaultImage;
}
