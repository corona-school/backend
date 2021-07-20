import { FindManyCourseResolver, applyResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver, FindManyProject_matchResolver } from "./generated/resolvers/crud";
import { authChecker, authorizationEnhanceMap } from "./authorizations";
import { MutatePupilResolver } from "./pupil/mutations";
import injectContext from "./context";
import { ApolloServer } from "apollo-server-express";
import { GraphQLLogger } from "./logging";
import { plugin as apolloTracing } from "apollo-tracing";
import { PluginDefinition } from "apollo-server-core";
import { ExtendFieldsPupilResolver } from "./pupil/fields";

// TODO: Authentication / Authorization?

applyResolversEnhanceMap(authorizationEnhanceMap);

const schema = buildSchemaSync({
    resolvers: [
        /* Course */
        FindManyCourseResolver,
        /* Pupil */
        FindManyPupilResolver,
        ExtendFieldsPupilResolver,
        MutatePupilResolver,
        /* Match */
        FindManyMatchResolver,
        /* Projects */
        FindManyProject_matchResolver
    ],
    authChecker
});

const plugins: PluginDefinition[] = [GraphQLLogger as any];
const isDev = process.env.NODE_ENV === "dev";

if (isDev) {
    plugins.push( apolloTracing() );
}
export const apolloServer = new ApolloServer({
    schema,
    context: injectContext,
    plugins
});