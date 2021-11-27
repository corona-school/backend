// We have very few entities were caching is actually reasonable (courses)
// As such most caching solutions for GraphQL are simply overkill for our purpose
// The following sets cache hints as documented in https://www.apollographql.com/docs/apollo-server/performance/caching
// The actual caching is then done by the apollo-server-plugin-response-cache plugin

import { createMethodDecorator } from "type-graphql";
import { GraphQLContext } from "./context";
import { createHash } from "crypto";


export function PublicCache(duration: number = 60 /*s*/) {
    let lastResults = new Map();

    setInterval(() => lastResults.clear(), duration * 1000);

    return createMethodDecorator<GraphQLContext>(async ({ args, root, info, context }, next) => {
        const query = JSON.stringify({ args, query: info.operation });
        const queryUUID = createHash('sha1')
            .update(query)
            .digest('base64');


        if (lastResults.has(queryUUID)) {
            console.log(`Cache hit with UUID: ${queryUUID}`);
            return lastResults.get(queryUUID);
        }

        console.log(`Cache miss with UUID: ${queryUUID}`);

        const result = await next();
        lastResults.set(queryUUID, result);

        console.log(`Cached result: `, result);

        return result;
    });
}





