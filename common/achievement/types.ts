import { Achievement_event } from '../../graphql/generated';
import { ActionID, SpecificNotificationContext } from '../notification/actions';

// type ActionIDUnion<A extends ActionID[]> = A[number];
// formula: FormulaFunction<ActionIDUnion<Metric['onActions']>>;

export type Metric = {
    metricName: string;
    onActions: ActionID[];
    formula: FormulaFunction<ActionID>;
};

export type FormulaFunction<ID extends ActionID> = (context: SpecificNotificationContext<ID>) => number;

export type EventValue = number | string | boolean;

// A bucket is seen as for a period of time
export interface Bucket {
    startTime: Date;
    endTime: Date;
}

export interface BucketEvents extends Bucket {
    events: Achievement_event[];
}
export interface BucketEventsWithAggr extends BucketEvents {
    aggregation: EventValue;
}

type BucketFormulaFunction = (relation?: string) => Bucket[] | Promise<Bucket[]>;

export type BucketFormula = {
    function: BucketFormulaFunction;
};

export type AggregatorFunction = {
    function: (elements: EventValue[]) => number;
};

export type ConditionDataAggregations = {
    [key: string]: {
        metricId: number;
        aggregator: string;
        // These two are used to first create all the needed buckets and then aggregate the events that fall into these
        // Default: count
        bucketAggregator?: string;
        // Default: one bucket / event
        createBuckets?: string;
    };
};
