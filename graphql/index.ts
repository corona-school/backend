import { FindManyCourseResolver, applyResolversEnhanceMap, ResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver } from "./generated/resolvers/crud";
import { authorizationEnhanceMap } from "./authorizations";

// TODO: Authentication / Authorization?

applyResolversEnhanceMap(authorizationEnhanceMap);

const schema = buildSchemaSync({
    resolvers: [
        FindManyCourseResolver,
        FindManyPupilResolver,
        FindManyMatchResolver
    ]
});

export default schema;