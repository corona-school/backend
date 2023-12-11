import { Achievement_event } from '../../graphql/generated';
import { BucketConfig, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations, EvaluationResult } from './types';
import { prisma } from '../prisma';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';
import { getLogger } from '../logger/logger';
const logger = getLogger('Achievement');

export async function evaluateAchievement(
    condition: string,
    dataAggregation: ConditionDataAggregations,
    metrics: string[],
    recordValue: number
): Promise<EvaluationResult> {
    const achievementEvents = await prisma.achievement_event.findMany({ where: { metric: { in: metrics } }, orderBy: { createdAt: 'desc' } });

    const eventsByMetric: Record<string, Achievement_event[]> = {};
    for (const event of achievementEvents) {
        if (!eventsByMetric[event.metric]) {
            eventsByMetric[event.metric] = [];
        }
        eventsByMetric[event.metric].push(event);
    }

    const resultObject: Record<string, number | string | boolean> = {};
    resultObject['recordValue'] = recordValue;

    for (const key in dataAggregation) {
        if (!dataAggregation[key]) {
            continue;
        }
        const dataAggregationObject = dataAggregation[key];
        const metricName = dataAggregationObject.metric;

        const bucketCreator = dataAggregationObject.createBuckets || 'default';
        const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

        const aggregator = dataAggregationObject.aggregator;

        const eventsForMetric = eventsByMetric[metricName];
        if (!eventsForMetric) {
            continue;
        }
        // we take the relation from the first event, that posesses one, in order to create buckets from it, if needed
        const relation = eventsForMetric.find((event) => event.relation)?.relation;

        const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
        const bucketAggregatorFunction = aggregators[bucketAggregator].function;
        const aggFunction = aggregators[aggregator].function;

        if (!bucketCreatorFunction || !bucketAggregatorFunction || !aggFunction) {
            logger.error(
                `No bucket creator or aggregator function found for ${bucketCreator}, ${aggregator} or ${bucketAggregator} during the evaluation of achievement`
            );
            continue;
        }

        const buckets = await bucketCreatorFunction(relation, recordValue);
        const bucketEvents = createBucketEvents(eventsForMetric, buckets);

        const bucketAggr = bucketEvents.map((bucketEvent) => bucketAggregatorFunction(bucketEvent.events.map((event) => event.value)));

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
        // values will be sorted in a desc order
        const filteredEvents = events.filter((event) => event.createdAt >= bucket.startTime && event.createdAt <= bucket.endTime);

        return {
            kind: bucket.kind,
            startTime: bucket.startTime,
            endTime: bucket.endTime,
            events: filteredEvents,
        };
    });
    return bucketsWithEvents;
};
