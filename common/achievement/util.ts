import { ActionEvent } from '.';
import { metrics } from './metric';
import { Context, Metric } from './types';

export function getMetricsForEvent(event: ActionEvent): Metric[] {
    const metricsForEvent = metrics.filter((metric) => metric.onActions.some((_onAction) => _onAction === event.action));
    return metricsForEvent;
}

export function getRelationByContext(context: Context): string {
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
