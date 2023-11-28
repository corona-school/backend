import { Achievement_event } from '../../graphql/generated';
import { AggregatorFunction } from './types';

type Aggregator = Record<string, AggregatorFunction>;

// Aggregators are needed to aggregate event values (achievement_event.value) or buckets for evaluation (like sum, count, max, min, avg)

export const aggregators: Aggregator = {
    sum: {
        function: (values: number[]): number => {
            return values.reduce((total, num) => total + num, 0);
        },
    },
    count: {
        function: (events: number[]): number => {
            return events.length;
        },
    },
};
