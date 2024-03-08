import { AggregatorFunction } from './types';

type Aggregator = Record<string, AggregatorFunction>;

// Aggregators are needed to aggregate event values (achievement_event.value) or buckets for evaluation (like sum, count, max, min, avg)

export const aggregators: Aggregator = {
    sum: {
        function: (elements): number => {
            return elements.reduce((total, num) => total + num, 0);
        },
    },
    count: {
        function: (elements): number => {
            return elements.filter((num) => num != 0).length;
        },
    },
    // this aggregator should be used to check if min one event exist in a bucket, i.e. if one event happend in one week / one month
    presence_of_events: {
        function: (elements): number => {
            return elements.filter((num) => num != 0).length > 0 ? 1 : 0;
        },
    },
    at_least_one_event_per_bucket: {
        function: (elements): number => {
            return elements.every((num) => num != 0) ? 1 : 0;
        },
    },
    last_streak_length: {
        function: (elements): number => {
            // elements are sorted asc, i.e. [KW 50, KW 51, KW 52]
            let value = 0;
            for (let i = elements.length - 1; i >= 0; i--) {
                if (elements[i] === 0) {
                    break;
                }
                value += 1;
            }
            return value;
        },
    },
};

export function isAggregator(name: string) {
    return name in aggregators;
}
