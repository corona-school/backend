import { Achievement_event } from '../../graphql/generated';
import { Bucket, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations, Metric } from './types';
import { prisma } from '../prisma';
import { NotificationContext } from '../notification/types';
import { aggregators } from './aggregator';
import { swan } from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';

export async function evaluateAchievement(condition: string, dataAggregation: ConditionDataAggregations, context: NotificationContext, metrics?: Metric[]) {
    const achievementEvents = await prisma.achievement_event.findMany({ where: { metric: { in: metrics.map((metric) => metric.metricName) } } });

    const valuesByMetric: Record<string, Achievement_event[]> = {}; // Hier speichern wir Werte pro Metric
    for (const event of achievementEvents) {
        if (!valuesByMetric[event.metric]) {
            valuesByMetric[event.metric] = [];
        }
        valuesByMetric[event.metric].push(event);
    }

    const resultObject: Record<string, number | string | boolean> = {};

    for (const key in dataAggregation) {
        // eslint-disable-next-line no-prototype-builtins
        if (dataAggregation.hasOwnProperty(key)) {
            const dataAggregationObject = dataAggregation[key];
            const metricId = dataAggregationObject.metricId;

            const bucketCreator = dataAggregationObject.createBuckets || 'default';
            const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

            const aggregator = dataAggregationObject.aggregator;

            const valuesForMetric = valuesByMetric[metricId];

            if (valuesForMetric) {
                const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
                const bucketAggregatorFunction = aggregators[bucketAggregator].function;
                const aggFunction = aggregators[aggregator].function;

                // TODO - how do we pass relation to the bucket creator
                const buckets = (await bucketCreatorFunction(valuesForMetric[0].relation)) || [];
                const bucketEvents = createBucketEvents(valuesForMetric, buckets);

                // TODO: events should be sorted by start date asc
                const bucketAggr = bucketEvents.map(
                    (bucketEvent): BucketEventsWithAggr => ({
                        ...bucketEvent,
                        aggregation: bucketAggregatorFunction(bucketEvent.events.map((event) => event.value)),
                    })
                );
                // TODO: buckets should be sorted by start date asc
                const value = aggFunction(bucketAggr.map((bucket) => bucket.aggregation));
                resultObject[key] = value;
            }
        }
    }

    const evaluate = swan.parse(condition);
    const value = await evaluate(resultObject);

    return null;
}

export function createBucketEvents(events: Achievement_event[], buckets: Bucket[]): BucketEvents[] {
    // If there a no buckets, we are just creating one bucket for each event
    if (buckets.length === 0) {
        return events.map((event) => ({
            startTime: event.createdAt!,
            endTime: event.createdAt!,
            events: [event],
        }));
    }
}
