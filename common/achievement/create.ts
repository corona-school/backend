import { Prisma, achievement_template, achievement_template_for_enum, achievement_type_enum } from '@prisma/client';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { prisma } from '../prisma';
import { TemplateSelectEnum, getAchievementTemplates } from './template';
import tracer from '../logger/tracing';
import { AchievementToCheck } from './types';

function createRelationContextFilter<ID extends ActionID>(context?: SpecificNotificationContext<ID>): Prisma.JsonFilter {
    if (context && context.relation) {
        return { path: ['relation'], equals: context.relation };
    }
    return { path: ['relation'], equals: Prisma.AnyNull };
}

export async function findUserAchievement<ID extends ActionID>(
    templateId: number,
    userId: string,
    context?: SpecificNotificationContext<ID>
): Promise<AchievementToCheck | null> {
    const contextFilter = createRelationContextFilter(context);
    const userAchievement = await prisma.user_achievement.findFirst({
        where: {
            templateId,
            userId,
            context: contextFilter,
        },
        select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true },
    });
    return userAchievement;
}

async function getOrCreateUserAchievement<ID extends ActionID>(
    template: achievement_template,
    userId: string,
    context: SpecificNotificationContext<ID>
): Promise<AchievementToCheck | null> {
    const isGlobal =
        template.templateFor === achievement_template_for_enum.Global ||
        template.templateFor === achievement_template_for_enum.Global_Courses ||
        template.templateFor === achievement_template_for_enum.Global_Matches;
    const existingUserAchievement = await findUserAchievement(template.id, userId, !isGlobal ? context : undefined);
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

    const templatesForGroup = templatesByGroup.get(currentTemplate.group)!.sort((a, b) => a.groupOrder - b.groupOrder);

    const contextFilter = createRelationContextFilter(context);
    const userAchievementsByGroup = await prisma.user_achievement.findMany({
        where: {
            template: {
                group: currentTemplate.group,
            },
            userId,
            context: contextFilter,
        },
        orderBy: { template: { groupOrder: 'asc' } },
    });

    const nextStepIndex = userAchievementsByGroup.length > 0 ? templatesForGroup.findIndex((e) => e.groupOrder === currentTemplate.groupOrder) + 1 : 0;

    if (templatesForGroup && templatesForGroup.length > nextStepIndex) {
        const createdUserAchievement = await createNextUserAchievement(templatesForGroup, nextStepIndex, userId, context);
        return createdUserAchievement;
    }

    return null;
}

async function createNextUserAchievement<ID extends ActionID>(
    templatesForGroup: achievement_template[],
    nextStepIndex: number,
    userId: string,
    context: SpecificNotificationContext<ID>
) {
    if (templatesForGroup.length <= nextStepIndex) {
        return null;
    }
    const nextStepTemplate = templatesForGroup[nextStepIndex];
    const achievedAt =
        templatesForGroup.length - 1 === nextStepIndex && templatesForGroup[nextStepIndex].type === achievement_type_enum.SEQUENTIAL ? new Date() : null;
    // Here a user template is created for the next template in the group. This is done to always have the data availible for the next step.
    // This could mean to, for example, have the name of a match partner that is not yet availible due to a unfinished matching process.
    if (nextStepTemplate) {
        const createdUserAchievement = await prisma.user_achievement.create({
            data: {
                userId: userId,
                group: nextStepTemplate.group,
                groupOrder: nextStepTemplate.groupOrder,
                context: context ? context : Prisma.JsonNull,
                template: { connect: { id: nextStepTemplate.id } },
                recordValue: nextStepTemplate.type === 'STREAK' ? 0 : null,
                achievedAt: achievedAt,
            },
            select: { id: true, userId: true, context: true, template: true, achievedAt: true, recordValue: true },
        });
        return createdUserAchievement;
    }
    return null;
}

export { getOrCreateUserAchievement, createAchievement };
