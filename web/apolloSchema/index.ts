import {
    addSchemaLevelResolveFunction, AuthenticationError,
    gql,
    makeExecutableSchema
} from "apollo-server-express";

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: (parent, args, context, info) => {
            if (context.user.roles.includes('ADMIN')) {
                return 'Hello World!';
            } else {
                throw new AuthenticationError("Not authorized for 'hello'");
            }
        }
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;