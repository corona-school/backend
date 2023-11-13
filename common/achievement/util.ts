import { ActionEvent } from '.';
import { NotificationContext } from '../notification/types';
import { metrics } from './metrics';
import { Metric } from './types';

export function getMetricsForEvent(event: ActionEvent): Metric[] {
    const metricsForEvent = metrics.filter((metric) => metric.onActions.some((_onAction) => _onAction === event.action));
    return metricsForEvent;
}

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
    }

    return relation;
}
