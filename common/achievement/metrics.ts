import { ActionID } from '../notification/actions';
import { Metric } from './types';

export const metricByName: Map<string, Metric> = new Map();
export const metricsByAction: Map<ActionID, Metric[]> = new Map();

export const metricExists = (metricName: string) => metricByName.has(metricName);

function registerMetric(metric: Metric) {
    const { metricName, onActions } = metric;

    if (metricByName.has(metricName)) {
        throw new Error(`Metric '${metricName}' may only be registered once`);
    }

    onActions.forEach((actionID) => {
        if (!metricsByAction.has(actionID)) {
            metricsByAction.set(actionID, []);
        }
        metricsByAction.get(actionID).push(metric);
    });

    metricByName.set(metricName, metric);
}

export function registerAllMetrics(metrics: Metric[]) {
    metrics.forEach((metric) => {
        const { metricName } = metric;
        if (metricExists(metricName)) {
            throw new Error(`Metric '${metricName}' may only be registered once`);
        }
        registerMetric(metric);
    });
}
