import { prisma } from '../prisma';
import { User } from '../user';
import { Context, EventValue } from './types';
import { getMetricsForEvent, getRelationByContext } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { isAchievementExistingForAction } from './helper';

const logger = getLogger('Achievement');

export type ActionEvent = {
    action: string;
    at: Date;
    user: User;
};

export type Achievement_Event = {
    id?: number;
    userId?: string;
    metric: string;
    value: EventValue;
    createdAt?: Date;
    action?: string;
    relation?: string; // e.g. "user/10", "subcourse/15", "match/20"
};

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    const isAchievementAction = await isAchievementExistingForAction(actionId);
    if (!isAchievementAction) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }

    // TODO: create Event
    const event: ActionEvent = {
        action: actionId,
        at: new Date(),
        user: user,
    };

    const tracked = await trackEvent(event, context);
    // TODO: check if user achievement already exists
    // TODO: track event(event)
    // TODO: checkAwardAchievement

    return null;
}

// export type Context = {
//     subcourse?: {
//         id: number;
//         lectures: {
//             start: Date;
//         }[];
//     };
//     match?: {
//         id: number;
//         lectures: {
//             start: Date;
//         }[];
//     };
//     appointment?: {
//         id: number;
//         duration?: number;
//         match?: number;
//         subcourse?: number;
//     };
//     user?: {
//         id: number;
//     };
// };

function trackEvent<ID extends ActionID>(event: ActionEvent, context: SpecificNotificationContext<ID>) {
    const metricsForEvent = getMetricsForEvent(event);
    // const { appointment, match, subcourse } = context;
    // const relation = getRelationByContext(context);

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(context);

        const trackedEvent: Achievement_Event = {
            metric: metric.metricName,
            value: value,
            action: event.action,
            userId: event.user.userID,
            // relation: relation,
        };

        // await prisma.achievement_event.create({ data: trackedEvent });
    }

    return true;
}
