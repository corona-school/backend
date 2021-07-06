import {
    addSchemaLevelResolveFunction, AuthenticationError,
    gql,
    makeExecutableSchema
} from "apollo-server-express";
import { FindManyCourseResolver } from "./generated";
import { buildSchemaSync } from "type-graphql";

// TODO: Authentication / Authorization?

const schema = buildSchemaSync({
    resolvers: [
        FindManyCourseResolver
    ]
});

export default schema;