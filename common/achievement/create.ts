import { Prisma, achievement_template } from '@prisma/client';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';
import tracer from '../logger/tracing';
import { AchievementTemplateFor, AchievementToCheck, AchievementType } from './types';
import { transformEventContextToUserAchievementContext, checkIfAchievementIsGlobal } from './util';

export async function findUserAchievement<ID extends ActionID>(
    templateId: number,
    templateFor: AchievementTemplateFor,
    userId: string,
    context: SpecificNotificationContext<ID>
): Promise<AchievementToCheck | null> {
    let relation = context?.relation || null;
    switch (templateFor) {
        case AchievementTemplateFor.Global_Courses:
            relation = 'course';
            break;
        case AchievementTemplateFor.Global_Matches:
            relation = 'match';
            break;
        default:
    }
    const userAchievement = await prisma.user_achievement.findFirst({
        where: {
            templateId,
            userId,
            relation: relation,
        },
        select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true, relation: true },
    });
    return userAchievement;
}

async function getOrCreateUserAchievement<ID extends ActionID>(
    template: achievement_template,
    userId: string,
    context: SpecificNotificationContext<ID>
): Promise<AchievementToCheck | null> {
    const existingUserAchievement = await findUserAchievement(template.id, template.templateFor, userId, context);
    if (!existingUserAchievement) {
        return await createAchievement(template, userId, context);
    }
    return existingUserAchievement;
}

const createAchievement = tracer.wrap('achievement.createAchievement', _createAchievement);
async function _createAchievement<ID extends ActionID>(currentTemplate: achievement_template, userId: string, context: SpecificNotificationContext<ID>) {
    const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
    if (!templatesByGroup.has(currentTemplate.group)) {
        return null;
    }

    const isGlobal = checkIfAchievementIsGlobal(currentTemplate);
    const achievementContext = isGlobal ? undefined : context;

    const templatesForGroup = templatesByGroup.get(currentTemplate.group)!.sort((a, b) => a.groupOrder - b.groupOrder);
    let relation = context?.relation || null;
    switch (currentTemplate.templateFor) {
        case AchievementTemplateFor.Global_Courses:
            relation = 'course';
            break;
        case AchievementTemplateFor.Global_Matches:
            relation = 'match';
            break;
        default:
    }

    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: {
            template: {
                group: currentTemplate.group,
            },
            userId,
            relation: relation,
        },
        orderBy: { template: { groupOrder: 'asc' } },
    });

    const nextStepIndex = userAchievementsByGroup.length > 0 ? templatesForGroup.findIndex((e) => e.groupOrder === currentTemplate.groupOrder) + 1 : 0;

    if (templatesForGroup && templatesForGroup.length > nextStepIndex) {
        const createdUserAchievement = await createNextUserAchievement(templatesForGroup, nextStepIndex, userId, relation, achievementContext);
        return createdUserAchievement;
    }

    return null;
}

async function createNextUserAchievement<ID extends ActionID>(
    templatesForGroup: achievement_template[],
    nextStepIndex: number,
    userId: string,
    relation: string | null,
    context?: SpecificNotificationContext<ID>
) {
    if (templatesForGroup.length <= nextStepIndex) {
        return null;
    }

    const nextStepTemplate = templatesForGroup[nextStepIndex];
    const achievedAt =
        templatesForGroup.length - 1 === nextStepIndex && templatesForGroup[nextStepIndex].type === AchievementType.SEQUENTIAL ? new Date() : null;
    // Here a user template is created for the next template in the group. This is done to always have the data availible for the next step.
    // This could mean to, for example, have the name of a match partner that is not yet availible due to a unfinished matching process.
    if (nextStepTemplate) {
        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                // This ensures that the relation will set to null even if context.relation is an empty string
                relation: relation,
                context: context ? transformEventContextToUserAchievementContext(context) : Prisma.JsonNull,
                template: { connect: { id: nextStepTemplate.id } },
                recordValue: nextStepTemplate.type === 'STREAK' ? 0 : null,
                achievedAt: achievedAt,
            },
            select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true, relation: true },
        });
        return createdUserAchievement;
    }
    return null;
}

export { getOrCreateUserAchievement, createAchievement };
