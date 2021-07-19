import { FindManyCourseResolver, applyResolversEnhanceMap, ResolversEnhanceMap } from "./generated";
import { buildSchemaSync } from "type-graphql";
import { FindManyMatchResolver, FindManyPupilResolver } from "./generated/resolvers/crud";
import { authChecker, authorizationEnhanceMap } from "./authorizations";
import { MutatePupilResolver } from "./pupil/mutations";
import injectContext from "./context";
import { ApolloServer } from "apollo-server-express";
import { GraphQLLogger } from "./logging";

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
    ],
    authChecker
});

export const apolloServer = new ApolloServer({
    schema,
    context: injectContext,
    plugins: [
        GraphQLLogger
    ]
});