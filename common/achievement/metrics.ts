import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { ActionID } from '../notification/actions';
import { Metric } from './types';

const metricByName: Map<string, Metric> = new Map();
const metricsByAction: Map<ActionID, Metric[]> = new Map();

export function getMetricsByAction<ID extends ActionID>(actionId: ID): Metric[] {
    return metricsByAction.get(actionId) || [];
}

function registerMetric(metric: Metric) {
    const { metricName, onActions } = metric;

    if (metricByName.has(metricName)) {
        throw new Error(`Metric '${metricName}' may only be registered once`);
    }

    onActions.forEach((actionID) => {
        if (!metricsByAction.has(actionID)) {
            metricsByAction.set(actionID, []);
        }
        metricsByAction.get(actionID)!.push(metric);
    });

    metricByName.set(metricName, metric);
}

export function registerAllMetrics(metrics: Metric[]) {
    metrics.forEach((metric) => {
        registerMetric(metric);
    });
}
