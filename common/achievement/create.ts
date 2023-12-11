import { Prisma } from '@prisma/client';
import { Achievement_template, JsonFilter } from '../../graphql/generated';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';

async function doesUserAchievementAlreadyExist<ID extends ActionID>(templateId: number, userId: string, context: SpecificNotificationContext<ID>) {
    const keys = Object.keys(context);
    const userAchievement = await prisma.user_achievement.findFirst({
        where: {
            templateId,
            userId,
            AND: keys.map((key) => {
                return {
                    context: {
                        path: key,
                        equals: context[key],
                    },
                };
            }),
        },
        select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true },
    });
    return userAchievement;
}

async function getOrCreateUserAchievement<ID extends ActionID>(template: Achievement_template, userId: string, context?: SpecificNotificationContext<ID>) {
    const existingUserAchievement = await doesUserAchievementAlreadyExist(template.id, userId, context);
    if (!existingUserAchievement) {
        return await createAchievement(template, userId, context);
    }
    return existingUserAchievement;
}

async function createAchievement<ID extends ActionID>(templateToCreate: Achievement_template, userId: string, context: SpecificNotificationContext<ID>) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    const keys = Object.keys(context);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: {
            template: {
                group: templateToCreate.group,
            },
            userId,
            AND: keys.map((key) => {
                return {
                    context: {
                        path: key,
                        equals: context[key],
                    },
                };
            }),
        },
        orderBy: { template: { groupOrder: 'asc' } },
    });

    // TODO
    const nextStepIndex = userAchievementsByGroup.length > 0 ? userAchievementsByGroup.findIndex((e) => e.groupOrder === templateToCreate.groupOrder) + 1 : 0;

    const templatesForGroup = templatesByGroup.get(templateToCreate.group);
    if (templatesForGroup && templatesForGroup.length > nextStepIndex) {
        const createdUserAchievement = await createNextUserAchievement(templatesForGroup, nextStepIndex, userId, context);
        return createdUserAchievement;
    }
}

async function createNextUserAchievement<ID extends ActionID>(
    templatesForGroup: Achievement_template[],
    nextStepIndex: number,
    userId: string,
    context: SpecificNotificationContext<ID>
) {
    const nextStepTemplate = templatesForGroup[nextStepIndex];
    // Here a user template is created for the next template in the group. This is done to always have the data availible for the next step.
    // This could mean to, for example, have the name of a match partner that is not yet availible due to a unfinished matching process.
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
