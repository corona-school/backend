import { ActionID, NotificationContext } from '../notification/types';
import { metricsByAction } from './metrics';
import { Metric } from './types';

export function getRelationByContext(context: NotificationContext): string {
    const { appointment, match, subcourse } = context;
    let relation: string;

    switch (context) {
        case context.match:
            relation = `match/${match.id}`;
            break;
        case context.subcourse:
            relation = `subcourse/${subcourse.id}`;
            break;
        case context.appointment:
            relation = `appointment/${appointment.id}`;
            break;
        default:
            relation = '';
    }

    return relation;
}

export function getMetricsByAction<ID extends ActionID>(actionId: ID): Metric[] {
    return metricsByAction.get(actionId) || [];
}
