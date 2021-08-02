import type { PrismaClient } from "@prisma/client";
import { Role } from "./authorizations";
import { prisma } from "../common/prisma";
import { getLogger } from "log4js";
import * as basicAuth from "basic-auth";
import * as crypto from "crypto";

/* time safe comparison adapted from
    https://github.com/LionC/express-basic-auth/blob/master/index.js
    https://github.com/Bruce17/safe-compare/blob/master/index.js
*/
function timingSafeCompare(a: string, b: string) {
    const aLen = Buffer.byteLength(a);
    const bLen = Buffer.byteLength(b);

    const bufA = Buffer.alloc(aLen, 0, 'utf8');
    bufA.write(a);
    const bufB = Buffer.alloc(aLen, 0, 'utf8');
    bufB.write(b);

    return crypto.timingSafeEqual(bufA, bufB) && aLen === bLen;
}

export interface GraphQLContext {
    user: { roles: Role[] };
    prisma: PrismaClient;
}

const authLogger = getLogger("GraphQL Authentication");

if (!process.env.ADMIN_AUTH_TOKEN) {
    authLogger.warn("Missing ADMIN_AUTH_TOKEN, Admin API access is disabled");
}

export default function injectContext({ req }) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const auth = basicAuth.parse(req);

    let roles: Role[] = [];

    // TODO: REMOVE SECRET!
    authLogger.debug(` Authorization Header`, req.headers.authorization, `Basic Auth Header`, auth);

    if (process.env.ADMIN_AUTH_TOKEN && auth && auth.name === "admin") {
        if (!timingSafeCompare(process.env.ADMIN_AUTH_TOKEN, auth.pass)) {
            authLogger.warn(`Admin failed to authenticate from ${ip}`);
            throw new Error("Invalid Admin Password");
        }

        roles.push(Role.ADMIN);
        authLogger.info(`Admin authenticated from ${ip}`);
    } else {
        authLogger.info(`Unauthenticated access from ${ip}`);
    }

    const user = { roles };

    const context: GraphQLContext = { user, prisma };
    return context;
}