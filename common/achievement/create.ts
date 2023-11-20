import { Achievement_template } from '../../graphql/generated';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';

async function doesUserAchievementAlreadyExist(templateId: number): Promise<boolean> {
    const userAchievement = await prisma.user_achievement.findFirst({ where: { templateId } });
    if (!userAchievement) {
        return false;
    }
    return true;
}

async function createUserAchievement<ID extends ActionID>(templates: Achievement_template[], userId: string, context: SpecificNotificationContext<ID>) {
    switch (templates[0].type) {
        case 'SEQUENTIAL':
            await createSequentialAchievement(templates, userId, context);
            break;
        case 'TIERED':
            await createTieredAchievement(templates, userId, context);
            break;
        case 'STREAK':
            await createStreakAchievement(templates[0], userId, context);
            break;
        default:
            console.log('DEFAULT');
    }
}

async function createSequentialAchievement<ID extends ActionID>(templates: Achievement_template[], userId: string, context: SpecificNotificationContext<ID>) {
    const userAchievements = await prisma.user_achievement.findMany({
        where: { template: { group: templates[0].group } },
        orderBy: { template: { groupOrder: 'desc' } },
    });

    const lastStepIndex = userAchievements.length > 0 ? userAchievements[0].groupOrder : 0;
    const nextStepIndex = lastStepIndex + 1;

    const nextStepTemplate = templates.find((t) => t.groupOrder === nextStepIndex);
    console.log('CREATE', templates);
    console.log('CREATE', nextStepTemplate);

    await prisma.user_achievement.create({
        data: {
            templateId: nextStepTemplate.id,
            userId,
            group: nextStepTemplate.group,
            groupOrder: nextStepTemplate.groupOrder,
            context,
        },
    });
}
async function createTieredAchievement<ID extends ActionID>(templates: Achievement_template[], userId: string, context: SpecificNotificationContext<ID>) {
    for (const template of templates) {
        const { group, groupOrder, type } = template;
        const achievementExistForUser = await doesUserAchievementAlreadyExist(template.id);

        if (!achievementExistForUser) {
            await prisma.user_achievement.create({
                data: {
                    templateId: template.id,
                    userId,
                    group: template.group,
                    groupOrder: template.groupOrder,
                    context,
                },
            });
        }
    }
}
async function createStreakAchievement<ID extends ActionID>(template: Achievement_template, userId: string, context: SpecificNotificationContext<ID>) {
    const userAchievements = await prisma.user_achievement.findFirst({
        where: { template: { group: template.group } },
        orderBy: { recordValue: 'desc' },
    });

    await prisma.user_achievement.create({
        data: {
            templateId: template.id,
            userId,
            group: template.group,
            groupOrder: 0,
            context,
        },
    });
}

export { createUserAchievement };
