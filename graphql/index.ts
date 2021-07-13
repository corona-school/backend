import { FindManyCourseResolver, applyResolversEnhanceMap, ResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver } from "./generated/resolvers/crud";
import { authorizationEnhanceMap } from "./authorizations";
import { ActivatePupilResolver } from "./pupil/activate";

// TODO: Authentication / Authorization?

applyResolversEnhanceMap(authorizationEnhanceMap);

const schema = buildSchemaSync({
    resolvers: [
        /* Course */
        FindManyCourseResolver,
        /* Pupil */
        FindManyPupilResolver,
        ActivatePupilResolver,
        /* Match */
        FindManyMatchResolver
    ]
});

export default schema;