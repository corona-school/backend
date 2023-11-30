import { checkUserAchievement } from '../../../common/achievement';
import { UserAchievementTemplate } from '../../../common/achievement/types';
import { prisma } from '../../../common/prisma';
import { CSJob } from '../../types';

const userAchievement = {
    userId: 'student/1',
    id: 67,
    achievedAt: '2023-11-29T12:15:25.611Z',
    context: '{}',
    template: {
        id: 8,
        name: 'Anwesenheits-Rekord',
        metrics: ['weekly_presence'],
        templateFor: 'Global',
        group: 'weekly_presence',
        groupOrder: 1,
        stepName: '',
        type: 'STREAK',
        subtitle: '',
        description: 'Dieses Achievement zeichnet kontinuierliche Teilnahme auf einer Lernplattform aus, insbesondere im Hinblick auf die Anwesenheit.',
        image: 'https://img.freepik.com/vektoren-kostenlos/flache-landschaft-von-bergen-am-meer_23-2147587827.jpg?size=626&ext=jpg&ga=GA1.1.153302910.1700229246&semt=ais',
        achievedImage:
            'https://img.freepik.com/vektoren-kostenlos/flache-landschaft-von-bergen-am-meer_23-2147587827.jpg?size=626&ext=jpg&ga=GA1.1.153302910.1700229246&semt=ais',
        actionName: null,
        actionRedirectLink: '/matching',
        actionType: null,
        achievedText:
            'Herzlichen Glückwunsch! Du hast deinen Anwesenheits-Rekord gebrochen und beweist damit deine außergewöhnliche Engagement und Hingabe zum Lernen. Mach weiter so und lass dich von deinem Erfolg zu noch größeren Leistungen motivieren!',
        condition: 'weekly_presence_count > recordValue',
        conditionDataAggregations: { weekly_presence_count: { metric: 'weekly_presence', aggregator: 'count_weeks', createBuckets: 'by_weeks' } },
        isActive: true,
    },
    recordValue: 1,
};

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
