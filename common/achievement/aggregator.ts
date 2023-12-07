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
            return elements.length;
        },
    },
    // this aggregator should be used to check if min one event exist in a bucket, i.e. if one event happend in one week / one month
    presenceOfEvents: {
        function: (elements): number => {
            return elements.length > 0 ? 1 : 0;
        },
    },
    streak: {
        function: (elements): number => {
            let value = 0;
            let afterNull = false;
            for (const element of elements) {
                if (element === 0) {
                    afterNull = true;
                    break;
                }

                if (afterNull) {
                    value += element;
                }
            }
            return value;
        },
    },
};
