import { Achievement_event } from '../../graphql/generated';
import { Bucket, BucketConfig, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations, FilterBucket, TimeBucket } from './types';
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
            // we take the relation from the first event, that posesses one, in order to create buckets from it, if needed
            const relation = eventsForMetric.find((event) => event.relation)?.relation;

            if (eventsForMetric) {
                const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
                const bucketAggregatorFunction = aggregators[bucketAggregator].function;
                const aggFunction = aggregators[aggregator].function;

                const buckets = await bucketCreatorFunction(relation);
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
    const value: boolean = await evaluate(resultObject);

    return value;
}

export function createBucketEvents(events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] {
    switch (bucketConfig.bucketKind) {
        case 'default':
            return createDefaultBuckets(events, bucketConfig);
        case 'time':
            return createTimeBuckets(events, bucketConfig);
        case 'filter':
            return createFilterBuckets(events, bucketConfig);
    }
}

const createDefaultBuckets = (events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] => {
    return events.map((event) => ({
        kind: 'default',
        events: [event],
    }));
};

const createTimeBuckets = (events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] => {
    const { buckets } = bucketConfig;
    const bucketsWithEvents: BucketEvents[] = buckets.map((bucket) => {
        const filteredEvents = events.filter((event) => {
            return event.createdAt >= bucket.startTime && event.createdAt <= bucket.endTime;
        });
        return {
            kind: bucket.kind,
            startTime: bucket.startTime,
            endTime: bucket.endTime,
            events: filteredEvents,
        };
    });
    return bucketsWithEvents;
};

const createFilterBuckets = (events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] => {
    const { buckets } = bucketConfig;
    const filteredEvents = events.filter((event) => {
        return buckets.some((bucket) => bucket.actionName === event.action);
    });
    // TODO - filter and sort events by actionName and put them in the right bucket
    return filteredEvents.map((event) => ({
        kind: 'filter',
        actionName: event.action,
        events: [event],
    }));
};
