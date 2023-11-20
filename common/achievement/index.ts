import { prisma } from '../prisma';
import { User } from '../user';
import { getMetricsByAction } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { Achievement_template } from '../../graphql/generated';
import { getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations, EventValue, Metric } from './types';
import { createUserAchievement } from './create';
import { addMetrics } from './metric';

const logger = getLogger('Achievement');

export type ActionEvent<ID extends ActionID> = {
    actionId: ActionID;
    at: Date;
    user: User;
    context: SpecificNotificationContext<ID>;
};
export type Achievement_Event = {
    userId?: string;
    metric: string;
    value: EventValue;
    action?: string;
    relation?: string; // e.g. "user/10", "subcourse/15", "match/20"
};
export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    const templates = await getTemplatesByAction(actionId);

    console.log('_________________');
    console.log('ACTION TAKEN - TEMPLATES:', JSON.stringify(templates));
    console.log('_________________');

    // check if action triggers an achievement
    if (templates.length === 0) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const event: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };
    context.weeks;

    await trackEvent(event, context);
    await checkAndCreateAchievement(templates, user.userID, context);

    return null;
}

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>, context: SpecificNotificationContext<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    console.log('_________________');
    console.log('TRACK EVENT - METRICS FOR EVENT:', JSON.stringify(metricsForEvent));
    console.log('_________________');

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
                // TODO - get relation OR get relationId from context?
                relation: event.context.relationId ?? '',
            },
        });
    }

    return true;
}

async function checkAndCreateAchievement<ID extends ActionID>(templates: Achievement_template[], userId: string, context: SpecificNotificationContext<ID>) {
    for (const achievement of templates) {
        if (achievement) {
            const isMet = await isAchievementConditionMet(achievement, context);
            if (isMet) {
                await createUserAchievement(templates, userId, context);
            }
        }
    }
}

async function isAchievementConditionMet(achievement: Achievement_template, context: NotificationContext) {
    const { condition, conditionDataAggregations, metrics } = achievement;
    if (!condition) {
        return;
    }
    const conditionIsMet = await evaluateAchievement(achievement.condition, conditionDataAggregations as ConditionDataAggregations, metrics);
    return conditionIsMet;
}
