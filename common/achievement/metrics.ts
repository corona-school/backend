import { Metric } from './types';

export const metrics: Map<string, Metric>[] = [];

export const metricExists = (metricName: string) => metrics.some((map) => map.has(metricName));

function registerMetric(metric: Metric) {
    const { metricName } = metric;
    const metricMap = metrics.find((map) => map.has(metricName));

    if (metricMap) {
        metricMap.set(metricName, metric);
    } else {
        const newMetricMap = new Map<string, Metric>();
        newMetricMap.set(metricName, metric);
        metrics.push(newMetricMap);
    }
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
