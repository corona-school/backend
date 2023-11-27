import { prisma } from '../prisma';
import { User } from '../user';
import { assureGamificationFeatureActive, getMetricsByAction } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { ActionEvent, ConditionDataAggregations, EventValue, UserAchievementContext, UserAchievementTemplate } from './types';
import { createUserAchievement, getOrCreateUserAchievement } from './create';

const logger = getLogger('Achievement');

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    assureGamificationFeatureActive();
    const templatesForAction = await getTemplatesByAction(actionId);

    if (templatesForAction.length === 0) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const event: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };
    await trackEvent(event, context);

    for (const template of templatesForAction) {
        const userAchievement = await getOrCreateUserAchievement(template, user.userID, {});
        await checkUserAchievement(userAchievement as UserAchievementTemplate, context);
    }

    return null;
}

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>, context: SpecificNotificationContext<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    if (!metricsForEvent) {
        logger.debug(`Can't track event, because no metrics found for action '${event.actionId}'`);
        return;
    }

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(context);

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

async function checkUserAchievement<ID extends ActionID>(userAchievement: UserAchievementTemplate | undefined, context: SpecificNotificationContext<ID>) {
    if (userAchievement) {
        const isConditionMet = await isAchievementConditionMet(userAchievement, context);
        if (isConditionMet) {
            const awardedAchievement = await awardUser(userAchievement.id);
            const userAchievementContext: UserAchievementContext = {};
            await createUserAchievement(awardedAchievement.template, userAchievement.userId, userAchievementContext);
        }
    }
}

async function isAchievementConditionMet(achievement: UserAchievementTemplate, context: NotificationContext) {
    const {
        userId,
        template: { condition, conditionDataAggregations, metrics },
    } = achievement;
    if (!condition) {
        return;
    }
    const conditionIsMet = await evaluateAchievement(condition, conditionDataAggregations as ConditionDataAggregations, metrics);
    return conditionIsMet;
}

async function awardUser(userAchievementId: number) {
    return await prisma.user_achievement.update({
        where: { id: userAchievementId },
        data: { achievedAt: new Date() },
        select: { id: true, userId: true, context: true, template: true },
    });
}
