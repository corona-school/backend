import { gql, makeExecutableSchema } from "apollo-server-express";

const typeDefs = gql`
    type ExampleQuery{
        hello: String
    }
`;

const resolvers = {
    ExampleQuery: {
        hello: 'Hello World!'
    }
};

const schema = makeExecutableSchema({
    typeDefs, resolvers
});

export default schema;