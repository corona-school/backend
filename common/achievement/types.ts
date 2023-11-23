import { Achievement_event, Achievement_template, achievement_type_enum } from '../../graphql/generated';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { User } from '../user';

// type ActionIDUnion<A extends ActionID[]> = A[number];
// formula: FormulaFunction<ActionIDUnion<Metric['onActions']>>;

export type Metric = {
    metricName: string;
    onActions: ActionID[];
    formula: FormulaFunction<ActionID>;
};

export type FormulaFunction<ID extends ActionID> = (context: SpecificNotificationContext<ID>) => number;

export type EventValue = number[] | Achievement_event[];

// A bucket is seen as for a period of time
export interface Bucket {
    startTime: Date;
    endTime: Date;
}

export interface BucketEvents extends Bucket {
    events: Achievement_event[];
}
export interface BucketEventsWithAggr extends BucketEvents {
    aggregation: number;
}

type BucketFormulaFunction = (relation?: string) => Promise<Bucket[]>;

export type BucketFormula = {
    function: BucketFormulaFunction;
};

export type AggregatorFunction = {
    function: (elements: number[]) => number;
};

export type ConditionDataAggregations = {
    [key: string]: {
        metric: string;
        aggregator: string;
        // These two are used to first create all the needed buckets and then aggregate the events that fall into these
        // Default: count
        bucketAggregator?: string;
        // Default: one bucket / event
        createBuckets?: string;
    };
};

export type UserAchievementContext = {
    matchId?: number;
    subcourseId?: number;
    match_partner?: string;
};

export type UserAchievementTemplate = {
    id: number;
    userId: string;
    context: UserAchievementContext;
    template: Achievement_template;
};

export type ActionEvent<ID extends ActionID> = {
    actionId: ActionID;
    at: Date;
    user: User;
    context: SpecificNotificationContext<ID>;
};
export type Achievement_Event = {
    userId?: string;
    metric: string;
    value: EventValue;
    action?: string;
    relation?: string; // e.g. "user/10", "subcourse/15", "match/20"
};
