import { Achievement_event } from '../../graphql/generated';
import { Bucket, BucketEvents, BucketEventsWithAggr, ConditionDataAggregations, Metric } from './types';
import { prisma } from '../prisma';
import { NotificationContext } from '../notification/types';
import { aggregators } from './aggregator';
import swan from '@onlabsorg/swan-js';
import { bucketCreatorDefs } from './bucket';

export async function evaluateAchievement(condition: string, dataAggregation: ConditionDataAggregations, metrics: string[]): Promise<boolean> {
    console.log('01 EVALUATE - METRICS', metrics);
    const achievementEvents = await prisma.achievement_event.findMany({ where: { metric: { in: metrics } } });

    // EVENT ARRAY
    const valuesByMetric: Record<string, Achievement_event[]> = {}; // Hier speichern wir Werte pro Metric
    for (const event of achievementEvents) {
        if (!valuesByMetric[event.metric]) {
            valuesByMetric[event.metric] = [];
        }
        valuesByMetric[event.metric].push(event);
    }

    console.log('_________________');
    console.log('02 EVALUATE - VALUES BY METRIC:', JSON.stringify(valuesByMetric));
    console.log('_________________');

    const resultObject: Record<string, number | string | boolean> = {};

    for (const key in dataAggregation) {
        console.log('_________________');
        console.log('0000 EVALUATE - KEY DATA AGGREGATION:', key, JSON.stringify(dataAggregation), dataAggregation[key]);
        console.log('_________________');

        if (dataAggregation[key]) {
            const dataAggregationObject = dataAggregation[key];
            const metricId = dataAggregationObject.metric;

            const bucketCreator = dataAggregationObject.createBuckets || 'default';
            const bucketAggregator = dataAggregationObject.bucketAggregator || 'count';

            const aggregator = dataAggregationObject.aggregator;

            const valuesForMetric = valuesByMetric[metricId];

            if (valuesForMetric) {
                const bucketCreatorFunction = bucketCreatorDefs[bucketCreator].function;
                const bucketAggregatorFunction = aggregators[bucketAggregator].function;
                const aggFunction = aggregators[aggregator].function;

                const buckets = await bucketCreatorFunction(valuesForMetric[0].relation);
                const bucketEvents = createBucketEvents(valuesForMetric, buckets);

                console.log('_________________');
                console.log('03 EVALUATE - BUCKET EVENTS:', JSON.stringify(bucketEvents));
                console.log('_________________');

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

    console.log('_________________');
    console.log('04 EVALUATE - CONDITION:', condition);
    console.log('_________________');

    const evaluate = swan.parse(condition);
    console.log('_________________');
    console.log('_________________');
    const value: boolean = await evaluate(resultObject);

    console.log('_________________');
    console.log('06 EVALUATE - VALUE:', value);
    console.log('_________________');

    return value;
}

export function createBucketEvents(events: Achievement_event[], buckets: Bucket[]): BucketEvents[] {
    // If there a no buckets, we are just creating one bucket for each event
    if (buckets.length === 0) {
        const sortedEvents = events.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

        console.log('_________________');
        console.log('CREATE BUCKETS - SORTED:', JSON.stringify(sortedEvents));
        console.log('_________________');

        return sortedEvents.map((event) => ({
            startTime: event.createdAt!,
            endTime: event.createdAt!,
            events: [event],
        }));
    }
}
