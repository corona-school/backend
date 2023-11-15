import { prisma } from '../prisma';
import { User } from '../user';
import { EventValue } from './types';
import { getMetricsByAction, getRelationByContext } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { Achievement_event } from '../../graphql/generated';
import { doesTemplateExistForAction } from './template';

const logger = getLogger('Achievement');

export type ActionEvent = {
    actionId: ActionID;
    at: Date;
    user: User;
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

    if (!templateExists) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    const event: ActionEvent = {
        actionId,
        at: new Date(),
        user: user,
    };

    const tracked = await trackEvent(event, context);
    // TODO: check if user achievement already exists
    // TODO: track event(event)
    // TODO: checkAwardAchievement

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
