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
    presenceOfEvents: {
        function: (elements): number => {
            return elements.filter((num) => num != 0).length > 0 ? 1 : 0;
        },
    },
    lastStreakLength: {
        function: (elements): number => {
            // elements are sorted desc, i.e. [KW 52, KW 51, KW 50]
            let value = 0;
            for (const element of elements) {
                if (element === 0) {
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
