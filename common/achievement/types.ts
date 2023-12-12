import { Prisma } from '@prisma/client';
import { Achievement_event, Achievement_template, Lecture } from '../../graphql/generated';
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

// Used to destinguish between different types of buckets
export type GenericBucketConfig<T extends Bucket> = {
    bucketKind: T['kind'];
    buckets: T[];
};
// Combines all possible bucket configs
export type BucketConfig = GenericBucketConfig<TimeBucket> | GenericBucketConfig<DefaultBucket>;

export type DefaultBucket = {
    kind: 'default';
};
// Bucket containing events from a specific time frame
export type TimeBucket = {
    kind: 'time';
    startTime: Date;
    endTime: Date;
};
// A bucket is seen as for a period of time
export type Bucket = DefaultBucket | TimeBucket;

export type BucketEvents = Bucket & {
    events: Achievement_event[];
};

export type BucketEventsWithAggr = BucketEvents & {
    aggregation: number;
};

type BucketCreatorContext = { periodLength: number; context: AchievementContextType };
type BucketFormulaFunction = (bucketContext: BucketCreatorContext) => BucketConfig;

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
        // For tiered achievements we need the number (max value) that can be achieved (for the resolver)
        valueToAchieve?: number;
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

export type AchievementToCheck = {
    userId: string;
    id: number;
    achievedAt: Date;
    context: Prisma.JsonValue;
    template: Achievement_template;
};

export type EvaluationResult = {
    conditionIsMet: boolean;
    resultObject: Record<string, number>;
};

export type RelationTypes = 'match' | 'subcourse';

type ContextLecture = Pick<Lecture, 'start' | 'duration'>;

export type AchievementContextType = {
    type: RelationTypes;
    user?: User;
    match?: {
        id: number;
        lecture: ContextLecture[];
    };
    subcourse?: {
        id: number;
        lecture: ContextLecture[];
    };
};
