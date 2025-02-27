import { achievement_action_type_enum, achievement_event, achievement_template, achievement_type_enum, lecture } from '@prisma/client';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { User } from '../user';
import { prisma } from '../prisma';

// Reexport from Prisma with camelcase
export {
    achievement_type_enum as AchievementType,
    achievement_action_type_enum as AchievementActionType,
    achievement_template_for_enum as AchievementTemplateFor,
} from '@prisma/client';

// type ActionIDUnion<A extends ActionID[]> = A[number];
// formula: FormulaFunction<ActionIDUnion<Metric['onActions']>>;

async function getUserAchievementWithTemplate(id: number) {
    return await prisma.user_achievement.findUniqueOrThrow({
        where: { id },
        include: { template: true },
    });
}

export type Metric = {
    metricName: string;
    onActions: ActionID[];
    formula: FormulaFunction<ActionID>;
};

export type FormulaFunction<ID extends ActionID> = (context: SpecificNotificationContext<ID>) => number;

// Used to distinguish between different types of buckets
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
    relation?: string;
    startTime: Date;
    endTime: Date;
};
// A bucket is seen as for a period of time
export type Bucket = DefaultBucket | TimeBucket;

export type BucketEvents = Bucket & {
    events: achievement_event[];
};

export type BucketEventsWithAggr = BucketEvents & {
    aggregation: number;
};

// The recordValue is used as a reference for the time bucket creator on how many buckets to create. if the recordValue is 5, then 6 buckets will be created to check the last 6 weeks / months
export type BucketCreatorContext = { recordValue?: number; context: BucketContextType };
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

export type ActionEvent<ID extends ActionID> = {
    actionId: ActionID;
    at: Date;
    user: User;
    context: SpecificNotificationContext<ID>;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type achievement_with_template = ThenArg<ReturnType<typeof getUserAchievementWithTemplate>>;
export type AchievementToCheck = Pick<achievement_with_template, 'id' | 'userId' | 'achievedAt' | 'recordValue' | 'context' | 'template' | 'relation'>;

export type EvaluationResult = {
    conditionIsMet: boolean;
    resultObject: Record<string, number>;
};

export type ContextLecture = Pick<lecture, 'id' | 'start' | 'duration'>;
export type ContextMatch = {
    id: number;
    relation?: string; // will be null if searching for all matches
    lecture: ContextLecture[];
};
export type ContextSubcourse = {
    id: number;
    relation?: string; // will be null if searching for all subcourses
    lecture: ContextLecture[];
};

export type BucketContextType = {
    user?: User;
    match: ContextMatch[];
    subcourse: ContextSubcourse[];
};

export type TemplateContextType = {
    [key: string]: any;
};

export enum AchievementState {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

// The achievement exposed to users via the API,
// hiding internals of the achievement system
export interface PublicAchievement {
    id: number;
    tagline?: string;
    // TODO: remove optional
    title?: string;
    // TODO: delete after frontend is updated
    name: string;
    subtitle?: string;
    description: string;
    footer?: string;
    sequentialStepName?: string;
    image: string;
    alternativeText: string;
    actionType?: achievement_action_type_enum | null;
    achievementType: achievement_type_enum;
    achievementState: AchievementState;
    achievedText?: string;
    // TODO: delete after frontend is updated
    streakProgress?: string;
    steps?: PublicStep[] | null;
    maxSteps: number;
    currentStep?: number;
    isNewAchievement?: boolean | null;
    // TODO: delete after frontend is updated
    progressDescription?: string | null;
    actionName?: string | null;
    actionRedirectLink?: string | null;
}

export interface PublicStep {
    name: string;
    isActive?: boolean | null;
}
