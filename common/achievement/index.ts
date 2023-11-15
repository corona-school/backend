import { prisma } from '../prisma';
import { User } from '../user';
import { getMetricsByAction, getRelationByContext } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { Achievement_template } from '../../graphql/generated';
import { doesTemplateExistForAction, getAchievementTemplatesByMetric } from './template';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations, Metric } from './types';

const logger = getLogger('Achievement');

export type ActionEvent = {
    actionId: ActionID;
    at: Date;
    user: User;
};

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    const templateExists = await doesTemplateExistForAction(actionId);

    if (!templateExists) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const event: ActionEvent = {
        actionId,
        at: new Date(),
        user: user,
    };

    await trackEvent(event, context);
    // TODO: check if user achievement already exists
    await checkAwardAchievement(context, event);

    return null;
}

async function trackEvent(event: ActionEvent, context: NotificationContext) {
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
                relation: getRelationByContext(context),
            },
        });
    }

    return true;
}

async function getAchievementForMetric(metric: Metric): Promise<Readonly<Achievement_template>[] | undefined> {
    const templates = await getAchievementTemplatesByMetric();
    return templates.get(metric.metricName);
}

async function checkAwardAchievement(context: NotificationContext, event: ActionEvent) {
    const metricsForEvent = getMetricsByAction(event.actionId);
    for (const metric of metricsForEvent) {
        const achievements = await getAchievementForMetric(metric);
        for (const achievement of achievements) {
            if (achievement) {
                await isAchievementConditionMet(achievement, context);
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
