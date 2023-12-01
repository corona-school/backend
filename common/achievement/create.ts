import { Prisma } from '@prisma/client';
import { Achievement_template } from '../../graphql/generated';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';
import { UserAchievementContext } from './types';

async function doesUserAchievementAlreadyExist(templateId: number, userId: string) {
    // TODO - check if user achievement exist for one match or one subcourse
    const userAchievement = await prisma.user_achievement.findFirst({
        where: {
            templateId,
            userId,
        },
        select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true },
    });
    return userAchievement;
}

async function getOrCreateUserAchievement(template: Achievement_template, userId: string, context: UserAchievementContext) {
    const existingUserAchievement = await doesUserAchievementAlreadyExist(template.id, userId);
    if (!existingUserAchievement) {
        return await createAchievement(template, userId, context);
    }
    return existingUserAchievement;
}

async function createAchievement(prevTemplate: Achievement_template, userId: string, context: UserAchievementContext) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: { template: { group: prevTemplate.group } },
        orderBy: { template: { groupOrder: 'asc' } },
    });

    const nextStepIndex = userAchievementsByGroup.length > 0 ? userAchievementsByGroup.findIndex((e) => e.groupOrder === prevTemplate.groupOrder) + 1 : 0;

    const templatesForGroup = templatesByGroup.get(prevTemplate.group);
    if (templatesForGroup && templatesForGroup.length > nextStepIndex) {
        const createdUserAchievement = await createNextUserAchievement(templatesForGroup, nextStepIndex, userId, context);
        return createdUserAchievement;
    }
}

async function createNextUserAchievement(templatesForGroup: Achievement_template[], nextStepIndex: number, userId: string, context: UserAchievementContext) {
    const nextStepTemplate = templatesForGroup[nextStepIndex];

    if (nextStepTemplate && nextStepTemplate.isActive) {
        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                group: nextStepTemplate.group,
                groupOrder: nextStepTemplate.groupOrder,
                context: context ? context : Prisma.JsonNull,
                template: { connect: { id: nextStepTemplate.id } },
                recordValue: nextStepTemplate.type === 'STREAK' ? 0 : null,
            },
            select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true },
        });
        return createdUserAchievement;
    }
    const nextUserAchievement = await createNextUserAchievement(templatesForGroup, nextStepIndex + 1, userId, context);
    return nextUserAchievement;
}

export { getOrCreateUserAchievement, createAchievement };
