import { prisma } from '../../../common/prisma';
import { Role } from '../../../common/user/roles';
import { IS_PUBLIC_SUBCOURSE } from '../../../graphql/subcourse/fields';
import { Prisma } from '@prisma/client';

export type WebflowSubcourse = Prisma.subcourseGetPayload<{
    include: {
        course: true;
        subcourse_instructors_student: { include: { student: true } };
        subcourse_participants_pupil: true;
        lecture: true;
    };
}>;

export const getWebflowSubcourses = (): Promise<WebflowSubcourse[]> =>
    prisma.subcourse.findMany({
        where: IS_PUBLIC_SUBCOURSE(),
        include: {
            course: true,
            subcourse_instructors_student: { include: { student: true } },
            subcourse_participants_pupil: true,
            lecture: true,
        },
    });
