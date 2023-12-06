import { prisma } from '../prisma';
import { User } from '../user';
import { isGamificationFeatureActive, getMetricsByAction } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { AchievementToCheck, ActionEvent, ConditionDataAggregations, UserAchievementContext, UserAchievementTemplate } from './types';
import { createAchievement, getOrCreateUserAchievement } from './create';
import { Achievement_template } from '../../graphql/generated';
import { Prisma } from '@prisma/client';
import { injectRecordValue, sortActionTemplatesToGroups } from './helper';

const logger = getLogger('Achievement');

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    if (!isGamificationFeatureActive()) {
        return;
    }
    const templatesForAction = await getTemplatesByAction(actionId);

    if (templatesForAction.length === 0) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const templatesByGroups = sortActionTemplatesToGroups(templatesForAction);

    const event: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };
    await trackEvent(event);

    for (const [key, group] of templatesByGroups) {
        let achievementToCheck: AchievementToCheck;
        for (const template of group) {
            const userAchievement = await getOrCreateUserAchievement(template, user.userID, context);
            if (userAchievement.achievedAt === null || userAchievement.recordValue) {
                achievementToCheck = userAchievement;
                break;
            }
        }
        if (achievementToCheck) {
            await checkUserAchievement(achievementToCheck as UserAchievementTemplate);
        }
    }

    return;
}

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    if (!metricsForEvent) {
        logger.debug(`Can't track event, because no metrics found for action '${event.actionId}'`);
        return;
    }

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(event.context);

        await prisma.achievement_event.create({
            data: {
                metric: metric.metricName,
                value: value,
                action: event.actionId,
                userId: event.user.userID,
                // TODO - get relation OR get relationId from context
                relation: event.context.relationId ?? '',
            },
        });
    }

    return true;
}

async function checkUserAchievement(userAchievement: UserAchievementTemplate) {
    const evaluationResult = await isAchievementConditionMet(userAchievement);
    if (evaluationResult.conditionIsMet) {
        const dataAggregationKey = Object.keys(userAchievement.template.conditionDataAggregations as ConditionDataAggregations)[0];
        const evaluationResultValue =
            typeof evaluationResult.resultObject[dataAggregationKey] === 'number' ? Number(evaluationResult.resultObject[dataAggregationKey]) : null;
        const awardedAchievement = await awardUser(evaluationResultValue, userAchievement);
        const userAchievementContext: UserAchievementContext = {};
        await createAchievement(awardedAchievement.template, userAchievement.userId, userAchievementContext);
    }
}

async function isAchievementConditionMet(achievement: UserAchievementTemplate) {
    const {
        userId,
        template: { condition, conditionDataAggregations, metrics },
    } = achievement;
    if (!condition) {
        return;
    }

    const updatedCondition = injectRecordValue(condition, achievement.recordValue);
    const { conditionIsMet, resultObject } = await evaluateAchievement(updatedCondition, conditionDataAggregations as ConditionDataAggregations, metrics);
    return { conditionIsMet, resultObject };
}

async function awardUser(evaluationResult: number, userAchievement: UserAchievementTemplate) {
    let newRecordValue = null;
    if (typeof userAchievement.recordValue === 'number' && evaluationResult) {
        newRecordValue = evaluationResult;
    }
    return await prisma.user_achievement.update({
        where: { id: userAchievement.id },
        data: { achievedAt: new Date(), recordValue: newRecordValue, isSeen: false },
        select: { id: true, userId: true, achievedAt: true, context: true, template: true },
    });
}
