import { prisma } from '../prisma';
import { User } from '../user';
import { getMetricsByAction } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { Achievement_template } from '../../graphql/generated';
import { doesTemplateExistForAction, getAchievementTemplates, getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations, EventValue, Metric } from './types';
import { createUserAchievement } from './create';

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
    const templateExists = await doesTemplateExistForAction(actionId);
    // check if action triggers achievement
    if (!templateExists) {
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
    const userAchievement = createUserAchievement(actionId, user.userID, context);
    await checkAwardAchievement(context, event);

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
                // TODO - get relation
                relation: event.context.relationId ?? '',
            },
        });
    }

    return true;
}

async function getAchievementForMetric(metric: Metric): Promise<Readonly<Achievement_template>[] | undefined> {
    const templates = await getAchievementTemplates();
    return templates.get(metric.metricName);
}

async function checkAwardAchievement<ID extends ActionID>(context: NotificationContext, event: ActionEvent<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);
    for (const metric of metricsForEvent) {
        const achievements = await getAchievementForMetric(metric);
        for (const achievement of achievements) {
            if (achievement) {
                await isAchievementConditionMet(achievement, context);
                // TODO - for sequential steps we have to copy the next step if the step before is achieved
            } else {
                console.log(`No template found for metric '${metric.metricName}'`);
            }
        }
    }
}

async function isAchievementConditionMet(achievement: Achievement_template, context: NotificationContext) {
    const { condition, conditionDataAggregations } = achievement;
    if (!condition) {
        return;
    }
    await evaluateAchievement(achievement.condition, conditionDataAggregations as ConditionDataAggregations, context);
}
