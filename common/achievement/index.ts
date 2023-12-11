import { prisma } from '../prisma';
import { User } from '../user';
import { isGamificationFeatureActive, getMetricsByAction, sortActionTemplatesToGroups } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { AchievementToCheck, ActionEvent, ConditionDataAggregations, UserAchievementTemplate } from './types';
import { createAchievement, getOrCreateUserAchievement } from './create';

const logger = getLogger('Achievement');

export async function rewardActionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    if (!isGamificationFeatureActive()) {
        return;
    }
    const templatesForAction = await getTemplatesByAction(actionId);

    if (templatesForAction.length === 0) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const templatesByGroups = sortActionTemplatesToGroups(templatesForAction);

    const actionEvent: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };
    await trackEvent(actionEvent);

    for (const [, group] of templatesByGroups) {
        let achievementToCheck: AchievementToCheck;
        for (const template of group) {
            const userAchievement = await getOrCreateUserAchievement(template, user.userID, context);
            if (userAchievement.achievedAt === null || userAchievement.recordValue) {
                achievementToCheck = userAchievement;
                break;
            }
        }
        if (achievementToCheck) {
            await checkUserAchievement(achievementToCheck as UserAchievementTemplate, context);
        }
    }
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
                relation: event.context.relationId ?? '',
            },
        });
    }

    return true;
}

async function checkUserAchievement<ID extends ActionID>(userAchievement: UserAchievementTemplate | undefined, context: SpecificNotificationContext<ID>) {
    const evaluationResult = await isAchievementConditionMet(userAchievement);

    if (evaluationResult.conditionIsMet) {
        const conditionDataAggregations = userAchievement?.template.conditionDataAggregations as ConditionDataAggregations;
        const dataAggregationKeys = Object.keys(conditionDataAggregations);
        const evaluationResultValue = dataAggregationKeys.map((key) => evaluationResult.resultObject[key]).reduce((a, b) => a + b, 0);

        const awardedAchievement = await rewardUser(evaluationResultValue, userAchievement);
        await createAchievement(awardedAchievement.template, userAchievement.userId, context);
    } else {
        await prisma.user_achievement.update({
            where: { id: userAchievement.id },
            data: { achievedAt: null, isSeen: false },
        });
    }
}

async function isAchievementConditionMet(achievement: UserAchievementTemplate) {
    const {
        recordValue,
        template: { condition, conditionDataAggregations, metrics },
    } = achievement;
    if (!condition) {
        return;
    }

    const { conditionIsMet, resultObject } = await evaluateAchievement(condition, conditionDataAggregations as ConditionDataAggregations, metrics, recordValue);
    return { conditionIsMet, resultObject };
}

async function rewardUser(evaluationResult: number, userAchievement: UserAchievementTemplate) {
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
