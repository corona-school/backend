import { Metric } from './types';

export const metrics: Metric[] = [];

export const metricExists = (metricName: string) => metrics.some((m) => m.metricName == metricName);

export function registerMetric(metric: Metric) {
    const { metricName } = metric;
    if (metricExists(metricName)) {
        throw new Error(`Metric may only be registered once`);
    }
    metrics.push(metric);
}

export function registerMetrics(metricBatch: Metric[]) {
    metricBatch.forEach((metric) => {
        const { metricName } = metric;
        if (metricExists(metricName)) {
            throw new Error(`Metric may only be registered once`);
        }
        if (metricName in metrics) {
            throw new Error(`Metric '${metricName}' can only be registered once.`);
        }
        metrics.push(metric);
    });
}
