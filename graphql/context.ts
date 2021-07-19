import type { PrismaClient } from "@prisma/client";
import { Role } from "./authorizations";
import { prisma } from "../common/prisma";
import { getLogger } from "log4js";

export interface GraphQLContext {
    user: { roles: Role[] };
    prisma: PrismaClient;
}

const logger = getLogger("ApolloContext");

if (!process.env.ADMIN_AUTH_TOKEN)
    logger.warn("Missing ADMIN_AUTH_TOKEN, Admin API is disabled");

export default function injectContext({ req }) {
    const token = req.headers.authorization || '';

    let roles: Role[] = [];

    if (process.env.ADMIN_AUTH_TOKEN && token === process.env.ADMIN_AUTH_TOKEN) {
        roles.push(Role.ADMIN);
        logger.debug("Admin authenticated");
    }

    const user = { roles };

    const context: GraphQLContext = { user, prisma };
    return context;
}