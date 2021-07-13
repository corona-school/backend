import { FindManyCourseResolver, applyResolversEnhanceMap, ResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver } from "./generated/resolvers/crud";
import { authorizationEnhanceMap } from "./authorizations";
import { MutatePupilResolver } from "./pupil/mutations";

// TODO: Authentication / Authorization?

applyResolversEnhanceMap(authorizationEnhanceMap);

const schema = buildSchemaSync({
    resolvers: [
        /* Course */
        FindManyCourseResolver,
        /* Pupil */
        FindManyPupilResolver,
        MutatePupilResolver,
        /* Match */
        FindManyMatchResolver
    ]
});

export default schema;