import { Achievement_template } from '../../graphql/generated';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';
import { UserAchievementContext } from './types';

async function doesUserAchievementAlreadyExist(templateId: number, userId: string, context?: UserAchievementContext) {
    // TODO - check if user achievement exist for one match or one subcourse
    const userAchievement = await prisma.user_achievement.findFirst({ where: { templateId, userId } });
    if (!userAchievement) {
        return false;
    }
    return userAchievement;
}

async function getOrCreateUserAchievement(template: Achievement_template, userId: string, context?: UserAchievementContext) {
    const existingUserAchievement = await doesUserAchievementAlreadyExist(template.id, userId, context);
    if (existingUserAchievement === false) {
        return await createUserAchievement(template, userId, context);
    }
    return existingUserAchievement;
}

async function createUserAchievement(templateToCreate: Achievement_template, userId: string, context: UserAchievementContext) {
    switch (templateToCreate.type) {
        case 'SEQUENTIAL':
            return await createSequentialAchievement(templateToCreate, userId, context);
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

async function createSequentialAchievement(templateToCreate: Achievement_template, userId: string, context: UserAchievementContext) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: { template: { group: templateToCreate.group } },
        orderBy: { template: { groupOrder: 'desc' } },
    });

    const lastStepIndex = userAchievementsByGroup.length > 0 ? templateToCreate.groupOrder : 0;
    const nextStepIndex = lastStepIndex + 1;

    const templatesForGroup = templatesByGroup.get(templateToCreate.group);
    if (templatesForGroup) {
        const nextStepTemplate = templatesForGroup.find((template) => template.groupOrder === nextStepIndex);
        const isLastStepInGroup = nextStepIndex === templatesForGroup.length;

        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                group: nextStepTemplate.group,
                groupOrder: nextStepTemplate.groupOrder,
                context: JSON.stringify(context ? context : {}),
                template: { connect: { id: nextStepTemplate.id } },
            },
            select: { userId: true, context: true, template: true },
        });
        return createdUserAchievement;
    }
}

export { createUserAchievement, getOrCreateUserAchievement, createSequentialAchievement };
