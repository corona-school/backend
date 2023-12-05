import { Achievement_event } from '../../graphql/generated';
import { BucketConfig, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations, EvaluationResult } from './types';
import { prisma } from '../prisma';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';
import moment from 'moment';

export async function evaluateAchievement(condition: string, dataAggregation: ConditionDataAggregations, metrics: string[]): Promise<EvaluationResult> {
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
        if (!dataAggregation[key]) {
            return;
        }
        const dataAggregationObject = dataAggregation[key];
        const metricName = dataAggregationObject.metric;

        const bucketCreator = dataAggregationObject.createBuckets || 'default';
        const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

        const aggregator = dataAggregationObject.aggregator;

        const eventsForMetric = eventsByMetric[metricName];
        if (!eventsForMetric) {
            return;
        }
        // we take the relation from the first event, that posesses one, in order to create buckets from it, if needed
        const relation = eventsForMetric.find((event) => event.relation)?.relation;

        const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
        const bucketAggregatorFunction = aggregators[bucketAggregator].function;
        const aggFunction = aggregators[aggregator].function;

        if (!bucketCreatorFunction || !bucketAggregatorFunction || !aggFunction) {
            return;
        }

        const buckets = await bucketCreatorFunction(relation);
        const bucketEvents = createBucketEvents(eventsForMetric, buckets);

        const bucketAggr = bucketEvents.map(
            (bucketEvent): BucketEventsWithAggr => ({
                ...bucketEvent,
                aggregation: bucketAggregatorFunction([bucketEvent]),
            })
        );

        const value = aggFunction(bucketAggr);
        resultObject[key] = value;
    }

    const evaluate = swan.parse(condition);
    const value: boolean = await evaluate(resultObject);

    return {
        conditionIsMet: value,
        resultObject,
    };
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
        const filteredEvents = events
            .filter((event) => event.createdAt >= bucket.startTime && event.createdAt <= bucket.endTime)
            .sort((a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()); // Sort events by createdAt

        const earliestEvent = filteredEvents.length > 0 ? [filteredEvents[0]] : [];

        return {
            kind: bucket.kind,
            startTime: bucket.startTime,
            endTime: bucket.endTime,
            events: earliestEvent,
        };
    });
    return bucketsWithEvents;
};

const createFilterBuckets = (events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] => {
    const { buckets } = bucketConfig;
    const filteredEvents = events.filter((event) => {
        return buckets.some((bucket) => bucket.actionName === event.action);
    });
    return filteredEvents.map((event) => ({
        kind: 'filter',
        actionName: event.action,
        events: [event],
    }));
};
