// We have very few entities were caching is actually reasonable (courses)
// As such most caching solutions for GraphQL are simply overkill for our purpose
// The following sets cache hints as documented in https://www.apollographql.com/docs/apollo-server/performance/caching
// The actual caching is then done by the apollo-server-plugin-response-cache plugin

import { createMethodDecorator, Directive } from "type-graphql";
import { GraphQLContext } from "./context";
import { CacheScope } from "apollo-cache-control";
import { ModelsEnhanceMap } from "./generated";

export function PublicCache(duration: number = 60 /*s*/) {
    return createMethodDecorator<GraphQLContext>(({ args, root, info, context }, next) => {
        info.cacheControl.setCacheHint({
            maxAge: duration,
            scope: CacheScope.Public
        });

        return next();
    });
}

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