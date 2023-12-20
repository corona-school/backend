import { Achievement_event } from '../../graphql/generated';
import { BucketConfig, BucketEvents, ConditionDataAggregations, EvaluationResult, GenericBucketConfig, TimeBucket } from './types';
import { prisma } from '../prisma';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';
import { getLogger } from '../logger/logger';
import { getBucketContext } from './util';
import tracer from '../logger/tracing';

const logger = getLogger('Achievement');

export const evaluateAchievement = tracer.wrap('achievement.evaluateAchievement', _evaluateAchievement);

async function _evaluateAchievement(
    userId: string,
    condition: string,
    dataAggregation: ConditionDataAggregations,
    metrics: string[],
    recordValue: number,
    relation?: string | null
): Promise<EvaluationResult> {
    // filter: wenn wir eine richtige relation haben -> filtern nach relation
    const achievementEvents = await prisma.achievement_event.findMany({
        where: {
            userId,
            metric: { in: metrics },
            AND: relation ? { relation: { equals: relation } } : {},
        },
        orderBy: { createdAt: 'desc' },
    });

    const eventsByMetric: Record<string, Achievement_event[]> = {};
    for (const event of achievementEvents) {
        if (!eventsByMetric[event.metric]) {
            eventsByMetric[event.metric] = [];
        }
        eventsByMetric[event.metric].push(event);
    }

    const resultObject: Record<string, number> = {};
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
        // we take the relation from the first event, that posesses one, in order to create buckets from it, if needed

        const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
        const bucketAggregatorFunction = aggregators[bucketAggregator].function;

        const aggregatorFunction = aggregators[aggregator].function;

        if (!bucketCreatorFunction || !bucketAggregatorFunction || !aggregatorFunction) {
            logger.error(
                `No bucket creator or aggregator function found for ${bucketCreator}, ${aggregator} or ${bucketAggregator} during the evaluation of achievement`
            );
            return;
        }

        const bucketContext = await getBucketContext(userId, relation);
        const buckets = bucketCreatorFunction({ recordValue, context: bucketContext });

        const bucketEvents = createBucketEvents(eventsForMetric, buckets);
        const bucketAggr = bucketEvents.map((bucketEvent) => bucketAggregatorFunction(bucketEvent.events.map((event) => event.value)));

        const value = aggregatorFunction(bucketAggr);
        resultObject[key] = value;
    }
    // TODO: return true if the condition is empty (eg. a student finishes a course and automatically receives an achievement)
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
            return createDefaultBuckets(events);
        case 'time':
            return createTimeBuckets(events, bucketConfig);
        default:
            return createDefaultBuckets(events);
    }
}

const createDefaultBuckets = (events: Achievement_event[]): BucketEvents[] => {
    return events.map((event) => ({
        kind: 'default',
        events: [event],
    }));
};

const createTimeBuckets = (events: Achievement_event[], bucketConfig: BucketConfig): BucketEvents[] => {
    const { buckets } = bucketConfig;
    const bucketsWithEvents: BucketEvents[] = buckets.map((bucket) => {
        // values will be sorted in a desc order
        let filteredEvents = events.filter((event) => event.createdAt >= bucket.startTime && event.createdAt <= bucket.endTime);
        if (bucket.relation) {
            filteredEvents = filteredEvents.filter((event) => event.relation === bucket.relation);
        }

        return {
            kind: bucket.kind,
            startTime: bucket.startTime,
            endTime: bucket.endTime,
            events: filteredEvents,
        };
    });
    return bucketsWithEvents;
};
