import { Role } from "../../graphql/authorizations";
import { prisma } from "../../common/prisma";
import { GraphQLContext } from "../../graphql/context";

export default function ApolloContext({ req }) {
    const token = req.headers.authorization || '';

    let roles: Role[] = [];

    if (token === process.env.ADMIN_AUTH_TOKEN) {
        roles.push(Role.ADMIN);
    }

    const user = { roles };

    const context: GraphQLContext = { user, prisma };
    return context;
}