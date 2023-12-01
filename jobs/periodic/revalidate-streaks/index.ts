import { checkUserAchievement } from '../../../common/achievement';
import { UserAchievementTemplate } from '../../../common/achievement/types';
import { prisma } from '../../../common/prisma';

export enum StreakTimeFrame {
    WEEK = 'by_weeks',
    MONTH = 'by_months',
}

// A cron job to revalidate the current state of a users streaks is important to prevent users from being rewarded for unwanted behavior
// Not continuing with a streak, therefore triggering no events that start a revalidation process, would result in users not doing tasks in order to keep their streaks
// The cron job revalidates if the condition for a users streaks is still met after a certain time frame, to reset the streak if the condition is not met anymore
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
