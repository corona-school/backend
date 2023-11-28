import { AggregatorFunction } from './types';

type Aggregator = Record<string, AggregatorFunction>;

// Aggregators are needed to aggregate event values (achievement_event.value) or buckets for evaluation (like sum, count, max, min, avg)

export const aggregators: Aggregator = {
    sum: {
        function: (buckets): number => {
            const values = [];
            for (const bucket of buckets) {
                if (bucket.events.length > 0) {
                    values.push(bucket.events.reduce((total, event) => total + event.value, 0));
                }
            }
            return values.reduce((total, num) => total + num, 0);
        },
    },
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
