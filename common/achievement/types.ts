export type Metric = {
    id: number;
    metricName: string;
    onActions: string[];
    formulaId: string;
};

export type EventValue = number | string | boolean;

export type Context = {
    subcourse?: {
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
    weeks?: number;
};

export type FormulaFunction = (context: Context) => number | string | boolean;

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
