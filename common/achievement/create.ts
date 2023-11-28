import { Achievement_template } from '../../graphql/generated';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';
import { UserAchievementContext } from './types';

async function doesUserAchievementAlreadyExist(templateId: number, userId: string, context?: UserAchievementContext) {
    // TODO - check if user achievement exist for one match or one subcourse
    const userAchievement = await prisma.user_achievement.findFirst({
        where: { templateId, userId },
        select: { id: true, userId: true, achievedAt: true, context: true, template: true },
    });
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
            return await createAchievement(templateToCreate, userId, context);
        case 'TIERED':
            return await createAchievement(templateToCreate, userId, context);
        case 'STREAK':
            // await createStreakAchievement(userAchievements[0], userId, context);
            break;
        default:
            console.log('DEFAULT');
    }
}

async function createAchievement(templateToCreate: Achievement_template, userId: string, context: UserAchievementContext) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: { template: { group: templateToCreate.group } },
        // orderBy: { template: { groupOrder: 'asc' } },
    });

    const nextStepIndex = userAchievementsByGroup.length > 0 ? templateToCreate.groupOrder + 1 : 1;

    const templatesForGroup = templatesByGroup.get(templateToCreate.group);
    if (templatesForGroup) {
        const nextStepTemplate = templatesForGroup.find((template) => template.groupOrder === nextStepIndex);
        const isLastStepInGroup = nextStepIndex === templatesForGroup.length;

        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                group: nextStepTemplate.group,
                groupOrder: nextStepTemplate.groupOrder,
                context: context ? JSON.stringify(context) : {},
                template: { connect: { id: nextStepTemplate.id } },
            },
            select: { id: true, userId: true, context: true, template: true, achievedAt: true },
        });
        return createdUserAchievement;
    }
}

export { createUserAchievement, getOrCreateUserAchievement, createAchievement };
