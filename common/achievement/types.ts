import { Prisma } from '@prisma/client';
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

export type EventValue = number[] | Achievement_event[];
export type FormulaFunction<ID extends ActionID> = (context: SpecificNotificationContext<ID>) => number;

// Used to destinguish between different types of buckets
export type GenericBucketConfig<T extends Bucket> = {
    bucketKind: T['kind'];
    buckets: T[];
};
// Combines all possible bucket configs
export type BucketConfig = GenericBucketConfig<TimeBucket> | GenericBucketConfig<FilterBucket> | GenericBucketConfig<DefaultBucket>;

export type DefaultBucket = {
    kind: 'default';
};
// Bucket containing events from a specific time frame
export type TimeBucket = {
    kind: 'time';
    startTime: Date;
    endTime: Date;
};
// Bucket containing events that match a specific actionName
export type FilterBucket = {
    kind: 'filter';
    actionName: string;
};
// A bucket is seen as for a period of time
export type Bucket = DefaultBucket | TimeBucket | FilterBucket;

export type BucketEvents = Bucket & {
    events: Achievement_event[];
};
export type BucketEventsWithAggr = BucketEvents & {
    aggregation: number;
};

type BucketFormulaFunction = (relation?: string) => Promise<BucketConfig>;

export type BucketFormula = {
    function: BucketFormulaFunction;
};

export type AggregatorFunction = {
    function: (elements: BucketEvents[]) => number;
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
    achievedAt: Date;
    context: UserAchievementContext;
    template: Achievement_template;
    recordValue?: number;
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

export type AchievementToCheck = {
    userId: string;
    id: number;
    achievedAt: Date;
    context: Prisma.JsonValue;
    template: Achievement_template;
};

export type EvaluationResult = {
    conditionIsMet: boolean;
    resultObject: Record<string, string | number | boolean>;
};

export type RelationContextType = {
    match?: {
        id: number;
        lecture: {
            start: Date;
            duration: number;
        };
    };
    subcourse?: {
        id: number;
        lecture: {
            start: Date;
            duration: number;
        };
    };
    actionNames?: string[];
};
