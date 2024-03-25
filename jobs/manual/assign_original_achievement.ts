import { actionTaken } from '../../common/notification';
import { prisma } from '../../common/prisma';
import { userForPupil, userForStudent } from '../../common/user';

// Date when the organisation was renamed to lern-fair
const LernFairSince = new Date('2021-05-17');
// Date of achievement system release
// All users that are registered and active before, should gain he achievment.
const OriginalAchievementUntil = new Date('2024-03-26');

export async function assignOriginalAchievement(): Promise<void> {
    await assignOriginalAchievementForPupils();
    await assignOriginalAchievementForStudents();
}

async function assignOriginalAchievementForPupils(): Promise<void> {
    const coronaSchoolOriginalPupils = await prisma.pupil.findMany({
        where: {
            active: true,
            verifiedAt: { not: null },
            isRedacted: false,
            createdAt: { lt: LernFairSince },
        },
    });
    const lernFairOriginalPupils = await prisma.pupil.findMany({
        where: {
            active: true,
            verifiedAt: { not: null },
            isRedacted: false,
            AND: [{ createdAt: { gte: LernFairSince } }, { createdAt: { lte: OriginalAchievementUntil } }],
        },
    });

    for (const pupil of coronaSchoolOriginalPupils) {
        const user = userForPupil(pupil);
        await actionTaken(user, 'user_original_corona_school', {});
    }
    for (const pupil of lernFairOriginalPupils) {
        const user = userForPupil(pupil);
        await actionTaken(user, 'user_original_lern_fair', {});
    }
}

async function assignOriginalAchievementForStudents(): Promise<void> {
    const coronaSchoolOriginalStudents = await prisma.student.findMany({
        where: {
            active: true,
            verifiedAt: { not: null },
            isRedacted: false,
            createdAt: { lt: LernFairSince },
        },
    });
    const lernFairOriginalStudents = await prisma.student.findMany({
        where: {
            active: true,
            verifiedAt: { not: null },
            isRedacted: false,
            AND: [{ createdAt: { gte: LernFairSince } }, { createdAt: { lte: OriginalAchievementUntil } }],
        },
    });

    for (const student of coronaSchoolOriginalStudents) {
        const user = userForStudent(student);
        await actionTaken(user, 'user_original_corona_school', {});
    }
    for (const student of lernFairOriginalStudents) {
        const user = userForStudent(student);
        await actionTaken(user, 'user_original_lern_fair', {});
    }
}
