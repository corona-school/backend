import { AggregatorFunction, BucketEventsWithAggr } from './types';

type Aggregator = Record<string, AggregatorFunction>;

// Aggregators are needed to aggregate event values (achievement_event.value) or buckets for evaluation (like sum, count, max, min, avg)

export const aggregators: Aggregator = {
    count: {
        function: (buckets): number => {
            const events = [];
            for (const bucket of buckets) {
                events.push(...bucket.events.map((event) => event.value));
            }
            return events.length;
        },
    },
    count_weeks: {
        function: (buckets): number => {
            let weeks = 0;
            for (const bucket of buckets) {
                if (bucket.events.length > 0) {
                    weeks = weeks + 1;
                } else {
                    break;
                }
            }
            return weeks;
        },
    },
};
