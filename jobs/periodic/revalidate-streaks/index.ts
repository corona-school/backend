import { checkUserAchievement } from '../../../common/achievement';
import { UserAchievementTemplate } from '../../../common/achievement/types';
import { prisma } from '../../../common/prisma';

export enum StreakTimeFrame {
    WEEK = 'by_weeks',
    MONTH = 'by_months',
}

export default async function revalidateStreaks(timeFrame: StreakTimeFrame) {
    const streakAchievements = await prisma.user_achievement.findMany({
        where: {
            template: {
                type: 'STREAK',
            },
        },
        select: {
            userId: true,
            id: true,
            achievedAt: true,
            context: true,
            template: true,
            recordValue: true,
        },
    });
    // This can not be done directly in prisma fetch, because it is not yet possible to filter on the presence of a specific key
    // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields
    const achievementsToCheck = streakAchievements.filter((achievement) => {
        const firstKey = Object.keys(achievement.template.conditionDataAggregations)[0];
        return achievement.template.conditionDataAggregations[firstKey].createBuckets === timeFrame;
    });
    for (const achievement of achievementsToCheck) {
        await checkUserAchievement(achievement as UserAchievementTemplate);
    }
}
