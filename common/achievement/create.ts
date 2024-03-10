import { Prisma, achievement_template } from '@prisma/client';
import { metrics } from '../logger/metrics';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates, getAchievementTamplateUID as getAchievementTemplateUID } from './template';
import tracer from '../logger/tracing';
import { AchievementTemplateFor, AchievementToCheck } from './types';
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
            relation = 'subcourse';
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
            relation = 'subcourse';
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
    // We should avoid creating a new achievement if the next step precedes the current step.
    // This scenario could occur, for instance, if an old student account, created before the implementation of the achievement system, applies to become an instructor.
    // Consequently, the screening process would trigger the creation of the Onboarding achievement, implying several steps that are inappropriate for the student.
    // Thus, the line below ensures that only the current or subsequent achievement steps are created, while others are automatically bypassed.
    // Note: +1 is added because the index is 0-based, while the groupOrder is 1-based.
    if (nextStepIndex + 1 < currentTemplate.groupOrder) {
        return null;
    }

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
    // Here a user template is created for the next template in the group. This is done to always have the data availible for the next step.
    // This could mean to, for example, have the name of a match partner that is not yet availible due to a unfinished matching process.
    if (nextStepTemplate) {
        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                // This ensures that the relation will set to null even if context.relation is an empty string
                relation: relation,
                // TODO: maybe merge with context of previous achievement in group
                context: context ? transformEventContextToUserAchievementContext(context) : Prisma.JsonNull,
                template: { connect: { id: nextStepTemplate.id } },
                recordValue: nextStepTemplate.type === 'STREAK' ? 0 : null,
                achievedAt: null,
            },
            select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true, relation: true },
        });
        metrics.AchievementsCreated.inc({
            id: createdUserAchievement.template.id.toString(),
            uid: getAchievementTemplateUID(createdUserAchievement.template),
            type: createdUserAchievement.template.type,
        });
        return createdUserAchievement;
    }
    return null;
}

export { getOrCreateUserAchievement, createAchievement };
