import { pupil, student, mentor, screener } from '@prisma/client';
import { prisma } from '../../../common/prisma';

export async function findAllPersons(
    active: boolean,
    lastLoginBefore: Date
): Promise<{ pupils: pupil[]; students: student[]; mentors: mentor[]; screener: screener[] }> {
    return {
        pupils: await prisma.pupil.findMany({
            where: {
                active: active,
                lastLogin: { lt: lastLoginBefore },
                isRedacted: false,
            },
        }),
        students: await prisma.student.findMany({
            where: {
                active: active,
                lastLogin: { lt: lastLoginBefore },
                isRedacted: false,
            },
        }),
        mentors: await prisma.mentor.findMany({
            where: {
                active: active,
                lastLogin: { lt: lastLoginBefore },
                isRedacted: false,
            },
        }),
        screener: await prisma.screener.findMany({
            where: {
                active: active,
                lastLogin: { lt: lastLoginBefore },
                isRedacted: false,
            },
        }),
    };
}
