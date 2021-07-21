import type { PrismaClient } from "@prisma/client";
import { Role } from "./authorizations";
import { prisma } from "../common/prisma";
import { getLogger } from "log4js";

export interface GraphQLContext {
    user: { roles: Role[] };
    prisma: PrismaClient;
}

const authLogger = getLogger("GraphQL Authentication");

if (!process.env.ADMIN_AUTH_TOKEN) {
    authLogger.warn("Missing ADMIN_AUTH_TOKEN, Admin API access is disabled");
}

export default function injectContext({ req }) {
    const token = req.headers.authorization || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let roles: Role[] = [];

    if (process.env.ADMIN_AUTH_TOKEN && token === process.env.ADMIN_AUTH_TOKEN) {
        roles.push(Role.ADMIN);
        authLogger.info(`Admin authenticated from ${ip}`);
    } else {
        authLogger.info(`Unauthenticated access from ${ip}`);
    }

    const user = { roles };

    const context: GraphQLContext = { user, prisma };
    return context;
}