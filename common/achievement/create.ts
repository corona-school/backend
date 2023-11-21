import { UserAchievementWithTemplate } from '.';
import { Achievement_template } from '../../graphql/generated';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';

async function doesUserAchievementAlreadyExist(templateId: number, userId?: string): Promise<boolean> {
    const userAchievement = await prisma.user_achievement.findFirst({ where: { templateId } });
    if (!userAchievement) {
        return false;
    }
    return true;
}

async function createUserAchievement<ID extends ActionID>(
    userAchievements: UserAchievementWithTemplate[],
    userId: string,
    context: SpecificNotificationContext<ID>
) {
    switch (userAchievements[0].template.type) {
        case 'SEQUENTIAL':
            await createSequentialAchievement(userAchievements, userId, context);
            break;
        case 'TIERED':
            // await createTieredAchievement(userAchievements, userId, context);
            break;
        case 'STREAK':
            // await createStreakAchievement(userAchievements[0], userId, context);
            break;
        default:
            console.log('DEFAULT');
    }
}

async function createSequentialAchievement<ID extends ActionID>(
    userAchievements: UserAchievementWithTemplate[],
    userId: string,
    context: SpecificNotificationContext<ID>
) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: { template: { group: userAchievements[0].template.group } },
        orderBy: { template: { groupOrder: 'desc' } },
    });

    const lastStepIndex = userAchievementsByGroup.length > 0 ? userAchievements[0].template.groupOrder : 0;
    const nextStepIndex = lastStepIndex + 1;

    const nextStepTemplate = userAchievements.find((t) => t.template.groupOrder === nextStepIndex);
    // const nextStepTemplate = templatesByGroup[];
    console.log('CREATE', userAchievements);
    console.log('CREATE', nextStepTemplate);

    await prisma.user_achievement.create({
        data: {
            templateId: nextStepTemplate.template.id,
            userId,
            group: nextStepTemplate.template.group,
            groupOrder: nextStepTemplate.template.groupOrder,
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
