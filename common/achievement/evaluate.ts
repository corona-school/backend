import { Achievement_event } from '../../graphql/generated';
import { Bucket, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations } from './types';
import { prisma } from '../prisma';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';

export async function evaluateAchievement(condition: string, dataAggregation: ConditionDataAggregations, metrics: string[]): Promise<boolean> {
    const achievementEvents = await prisma.achievement_event.findMany({ where: { metric: { in: metrics } } });

    const eventsByMetric: Record<string, Achievement_event[]> = {}; // Store events per metric
    for (const event of achievementEvents) {
        if (!eventsByMetric[event.metric]) {
            eventsByMetric[event.metric] = [];
        }
        eventsByMetric[event.metric].push(event);
    }

    const resultObject: Record<string, number | string | boolean> = {};

    for (const key in dataAggregation) {
        if (dataAggregation[key]) {
            const dataAggregationObject = dataAggregation[key];
            const metricName = dataAggregationObject.metric;

            const bucketCreator = dataAggregationObject.createBuckets || 'default';
            const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

            const aggregator = dataAggregationObject.aggregator;

            const eventsForMetric = eventsByMetric[metricName];

            if (eventsForMetric) {
                const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
                const bucketAggregatorFunction = aggregators[bucketAggregator].function;
                const aggFunction = aggregators[aggregator].function;

                const buckets = await bucketCreatorFunction(eventsForMetric[0].relation);
                const bucketEvents = createBucketEvents(eventsForMetric, buckets);

                const bucketAggr = bucketEvents.map(
                    (bucketEvent): BucketEventsWithAggr => ({
                        ...bucketEvent,
                        aggregation: bucketAggregatorFunction(bucketEvent.events.map((event) => event.value)),
                    })
                );
                const value = aggFunction(bucketAggr.map((bucket) => bucket.aggregation));
                resultObject[key] = value;
            }
        }
    }

    const evaluate = swan.parse(condition);
    const value: boolean = evaluate(resultObject);

    return value;
}

export function createBucketEvents(events: Achievement_event[], buckets: Bucket[]): BucketEvents[] {
    // If there a no buckets, we are just creating one bucket for each event
    if (buckets.length === 0) {
        const sortedEvents = events.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

        return sortedEvents.map((event) => ({
            startTime: event.createdAt!,
            endTime: event.createdAt!,
            events: [event],
        }));
    }
}
