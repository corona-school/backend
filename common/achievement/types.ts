export type Metric = {
    id: number;
    metricName: string;
    onActions: string[];
    formula: FormulaFunction;
};

export type EventValue = number | string | boolean;

// match, pool, openMatchRequestCount, screening, firstMatchRequest
export type Context = {
    subcourse?: {
        id: number;
        lectures: {
            start: Date;
        }[];
    };
    match?: {
        id: number;
        lectures: {
            start: Date;
        }[];
    };
    appointment?: {
        id: number;
        duration?: number;
        match?: number;
        subcourse?: number;
    };
    user?: {
        id: number;
    };
};

export type FormulaFunction = (context: Context) => number | string | boolean;

// A bucket is seen as a period of time
export interface Bucket {
    startTime: Date;
    endTime: Date;
}

export interface BucketEvents extends Bucket {
    events: TrackEvent[];
}
export interface BucketEventsWithAggr extends BucketEvents {
    aggregation: EventValue;
}

type BucketFormulaFunction = (context: Context) => Bucket[];

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
