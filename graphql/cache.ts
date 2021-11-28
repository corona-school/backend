// We have very few entities were caching is actually reasonable (courses)
// As such most caching solutions for GraphQL are simply overkill for our purpose
// The following sets cache hints as documented in https://www.apollographql.com/docs/apollo-server/performance/caching
// The actual caching is then done by the apollo-server-plugin-response-cache plugin (a simple in memory response cache)

import { createMethodDecorator, Directive } from "type-graphql";
import { GraphQLContext } from "./context";
import { ModelsEnhanceMap } from "./generated";
import { CacheScope } from "apollo-server-types";

/* If a Query is annotated with @PublicCache AND all the entities involved in the query are marked with "cacheAllFields" in the enhancement map below,
    then further requests with exactly the same query are served from cache for (duration) seconds */
export function PublicCache(duration: number = 60 /*s*/) {
    return createMethodDecorator<GraphQLContext>(({ info }, next) => {
        info.cacheControl.setCacheHint({
            maxAge: duration,
            scope: CacheScope.Public
        });

        return next();
    });
}

// The caching time is inherited from the time specified in @PublicCache, which as such specifies the caching time of the overall query
const cacheAllFields = {
    fields: {
        _all: [Directive("@cacheControl(inheritMaxAge: true)")]
    }
};

export const cacheModelEnhancementMap: ModelsEnhanceMap = {
    Course: cacheAllFields,
    Subcourse: cacheAllFields,
    Lecture: cacheAllFields
};