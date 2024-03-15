import { BucketConfig, BucketEvents, ConditionDataAggregations, EvaluationResult, GenericBucketConfig, TimeBucket } from './types';
import { prisma } from '../prisma';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';
import { getLogger } from '../logger/logger';
import { getBucketContext, removeBucketsBefore, removeBucketsAfter } from './util';
import tracer from '../logger/tracing';
import { achievement_event } from '@prisma/client';

const logger = getLogger('Achievement');

export const evaluateAchievement = tracer.wrap('achievement.evaluateAchievement', _evaluateAchievement);

async function _evaluateAchievement(
    userId: string,
    condition: string,
    dataAggregation: ConditionDataAggregations,
    recordValue?: number,
    relation?: string,
    skipAchievementBucketsBefore?: Date,
    skipAchievementBucketsAfter?: Date
): Promise<EvaluationResult | undefined> {
    // We only care about metrics that are used for the data aggregation
    const metrics = Object.values(dataAggregation).map((entry) => entry.metric);
    const achievementEvents = await prisma.achievement_event.findMany({
        where: {
            userId,
            metric: { in: metrics },
        },
        orderBy: { createdAt: 'desc' },
    });

    const eventsByMetric: Record<string, achievement_event[]> = {};
    for (const event of achievementEvents) {
        if (!eventsByMetric[event.metric]) {
            eventsByMetric[event.metric] = [];
        }
        eventsByMetric[event.metric].push(event);
    }

    const resultObject: Record<string, number> = {};
    if (recordValue !== undefined) {
        resultObject['recordValue'] = recordValue;
    }

    for (const key in dataAggregation) {
        if (!dataAggregation[key]) {
            continue;
        }
        const dataAggregationObject = dataAggregation[key];
        const metricName = dataAggregationObject.metric;

        const bucketCreator = dataAggregationObject.createBuckets || 'default';
        const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

        const aggregator = dataAggregationObject.aggregator;

        const eventsForMetric = eventsByMetric[metricName] ?? [];
        // we take the relation from the first event, that posesses one, in order to create buckets from it, if needed

        if (!bucketCreatorDefs[bucketCreator] || !aggregators[bucketAggregator] || !aggregators[aggregator]) {
            logger.error(`No bucket creator or aggregator function found during the evaluation of achievement`, null, {
                bucketCreator,
                aggregator,
                bucketAggregator,
                dataKey: key,
                metric: metricName,
            });
            return;
        }
        logger.info('Using aggregator functions', { bucketCreator, aggregator, bucketAggregator, dataKey: key, metric: metricName });

        const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
        const bucketAggregatorFunction = aggregators[bucketAggregator].function;

        const aggregatorFunction = aggregators[aggregator].function;

        const bucketContext = await getBucketContext(userId, relation);
        const buckets = bucketCreatorFunction({ recordValue, context: bucketContext });
        // We have to ensure that time buckets are always sorted in the same way (start time ascending)
        if (buckets.bucketKind === 'time') {
            buckets.buckets.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        }

        let bucketEvents = createBucketEvents(eventsForMetric, buckets);
        // This will remove all buckets that are before the given date
        // but only if they don't have any events associated with them.
        if (skipAchievementBucketsBefore) {
            bucketEvents = removeBucketsBefore(skipAchievementBucketsBefore, bucketEvents, true);
        }
        // This will remove all buckets that are after the current date
        // but only if they don't have any events associated with them.
        if (skipAchievementBucketsAfter) {
            bucketEvents = removeBucketsAfter(skipAchievementBucketsAfter, bucketEvents, true);
        }
        const bucketAggr = bucketEvents.map((bucketEvent) => bucketAggregatorFunction(bucketEvent.events.map((event) => event.value)));

        const value = aggregatorFunction(bucketAggr);
        resultObject[key] = value;
    }
    // TODO: return true if the condition is empty (eg. a student finishes a course and automatically receives an achievement)
    const evaluate = swan.parse(condition);
    const value = await evaluate(resultObject);
    if (typeof value !== 'boolean') {
        logger.error(`Failed to evaluate achievement condition`, undefined, { condition, resultObject, value });
        throw new Error(`Achievement Condition did not evaluate to a boolean but ${value}`);
    }

    return {
        conditionIsMet: value,
        resultObject,
    };
}

export function createBucketEvents(events: achievement_event[], bucketConfig: BucketConfig): BucketEvents[] {
    switch (bucketConfig.bucketKind) {
        case 'default':
            return createDefaultBuckets(events);
        case 'time':
            return createTimeBuckets(events, bucketConfig);
        default:
            return createDefaultBuckets(events);
    }
}

const createDefaultBuckets = (events: achievement_event[]): BucketEvents[] => {
    return events.map((event) => ({
        kind: 'default',
        events: [event],
    }));
};

const createTimeBuckets = (events: achievement_event[], bucketConfig: GenericBucketConfig<TimeBucket>): BucketEvents[] => {
    const { buckets } = bucketConfig;
    const bucketsWithEvents: BucketEvents[] = buckets.map((bucket) => {
        // values will be sorted in a desc order
        let filteredEvents = events.filter((event) => event.createdAt >= bucket.startTime && event.createdAt <= bucket.endTime);
        if (bucket.relation) {
            // Events that don't have a relation should count for all buckets it falls in.
            // Buckets without a relation, which can happen if we create buckets based on weeks or months, should keep all events as well.
            // If both have a relation the other side, events should only count for the bucket with the same one.
            filteredEvents = filteredEvents.filter((event) => !event.relation || !bucket.relation || event.relation === bucket.relation);
        }

        return {
            kind: bucket.kind,
            startTime: bucket.startTime,
            endTime: bucket.endTime,
            relation: bucket.relation,
            events: filteredEvents,
        };
    });
    return bucketsWithEvents;
};
