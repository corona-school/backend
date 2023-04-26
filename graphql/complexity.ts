import { createMethodDecorator } from 'type-graphql';
import { ResolversEnhanceMap } from './generated';
import { GraphQLResolveInfo } from 'graphql';
import { ValidationError } from 'apollo-server-errors';

/* We expose the whole Prisma query functionality to GraphQL users.
   As such they can write queries that fetch thousands of entries
   By annotating a resolver with @LimitedQuery(), the number of results must be limited, e.g.
   query { pupils(take: 100) { ... }}
   query { pupils(where: { id: { equals: 1 }}) { ... } }

   For nested resolvers the cardinality can also lead to large results even with limitations:
   query { pupils(take: 100) { subcourses(take: 100) { } }} -> 10.000 results max
   thus the result set of all takes must be below 1000

   This is not bulletproof, so some queries might still be heavy, though this should prevent most unintended uses */

type LimitedQueryContext = {
    limits?: {
        [path: string]: number;
    };
};

export const ACCUMULATED_LIMIT = 1000;

function enforceAccumulatedLimit(info: GraphQLResolveInfo, context: LimitedQueryContext, cardinality: number) {
    if (!context.limits) {
        context.limits = {};
    }

    /* In a nested query such as pupils { subcourses { ... } } this will be called twice,
       once for the pupil (annotated with LimitedQuery) and then for each pupil for the subcourses (annotated with LimitEstimated).
       Thus this function will be executed once for the pupil, and the limit (specified by TAKE) will be stored in the context.limits
       In the subcourse, the path is { key: "subcourses", prev: { key: 0, prev: { key: "pupils"}}}, thus with .prev.prev one can access the limit of the previous association.
       If the query retrieves 100 pupils, and 10 subcourses for each pupil, by multiplying we get the maximum number of pupils 100 * 10. On that we enforce the limit
       NOTE: Keys of different paths could collide in a query, however we hope that nobody writes such query :)
    */
    let accumulatedLimit = (info.path?.prev?.prev && context.limits[info.path.prev.prev.key]) ?? 1;
    accumulatedLimit *= cardinality;

    context.limits[info.path.key] = accumulatedLimit;

    if (accumulatedLimit > ACCUMULATED_LIMIT) {
        const limitInfo = Object.entries(context.limits)
            .map(([key, limit]) => `${key}:${limit}`)
            .join(', ');

        throw new ValidationError(`Overcomplex Query: The nested query might return more than 1000 entries (${limitInfo})`);
    }
}

export function LimitedQuery(limit = 100) {
    return createMethodDecorator<LimitedQueryContext>(({ args, root, info, context }, next) => {
        // mutations are always fine, we only worry about queries
        if (info.operation.operation === 'mutation') {
            return next();
        }

        const numberLimited = !!args.take;
        const numberLimitedLow = args.take <= limit;
        const isIDQuery = !!args.where?.id;

        if (numberLimited && !numberLimitedLow) {
            throw new ValidationError(`Overcomplex Query: Please reduce the TAKE arg to less than ${limit} entries`);
        }

        if (!isIDQuery && !numberLimitedLow) {
            throw new ValidationError(`Overcomplex Query: Please implement pagination with TAKE and SKIP`);
        }

        const cardinality = isIDQuery ? 1 : args.take;
        enforceAccumulatedLimit(info, context, cardinality);

        return next();
    });
}

/* For nested field resolvers one can still give a brief estimation about the entries expected */
export function LimitEstimated(cardinality: number) {
    return createMethodDecorator(({ info, context }, next) => {
        enforceAccumulatedLimit(info, context, cardinality);

        return next();
    });
}

export const complexityEnhanceMap: ResolversEnhanceMap = {
    Bbb_meeting: { bbb_meetings: [LimitedQuery()] },
    Concrete_notification: { concrete_notifications: [LimitedQuery()] },
    Course: { courses: [LimitedQuery()] },
    Log: { logs: [LimitedQuery()] },
    Pupil: { pupils: [LimitedQuery()] },
    Match: { matches: [LimitedQuery()] },
    Project_match: { project_matches: [LimitedQuery()] },
};
