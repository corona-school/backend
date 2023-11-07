import { ActionID } from '../notification/actions';
import { prisma } from '../prisma';
import { User } from '../user';
import { Context, EventValue } from './types';
import { getMetricsForEvent, getRelationByContext } from './util';

// import * as Achievement from '../../common/achievement';

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

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: Context) {
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

function trackEvent(event: ActionEvent, context: Context) {
    const metricsForEvent = getMetricsForEvent(event);
    const { appointment, match, subcourse } = context;
    const relation = getRelationByContext(context);

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(context);

        const trackedEvent: Achievement_Event = {
            metric: metric.metricName,
            value: value,
            action: event.action,
            userId: event.user.userID,
            relation: relation,
        };

        // await prisma.achievement_event.create({ data: trackedEvent });
    }

    return true;
}
