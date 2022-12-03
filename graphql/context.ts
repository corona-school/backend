import type { PrismaClient } from '@prisma/client';
import { prisma } from '../common/prisma';
import { getLogger } from 'log4js';
import basicAuth from 'basic-auth';
import * as crypto from 'crypto';
import { getUserForSession, GraphQLUser, toPublicToken, UNAUTHENTICATED_USER } from './authentication';
import { AuthenticationError } from 'apollo-server-errors';
import { Role } from './roles';

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
    user?: GraphQLUser;
    sessionToken?: string;
    prisma: PrismaClient;
    deferredRequiredRoles?: Role[];
    ip: string;
}

const authLogger = getLogger('GraphQL Authentication');

if (!process.env.ADMIN_AUTH_TOKEN) {
    authLogger.warn('Missing ADMIN_AUTH_TOKEN, Admin API access is disabled');
}

export default async function injectContext({ req }) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const auth = basicAuth(req);

    let user: GraphQLUser = UNAUTHENTICATED_USER;

    let sessionToken: string | undefined = undefined;

    if (process.env.ADMIN_AUTH_TOKEN && auth && auth.name === 'admin') {
        if (!timingSafeCompare(process.env.ADMIN_AUTH_TOKEN, auth.pass)) {
            authLogger.warn(`Admin failed to authenticate from ${ip}`);
            throw new AuthenticationError('Invalid Admin Password');
        }

        user = {
            userID: 'admin/',
            firstname: 'Ed',
            lastname: 'Min',
            email: 'test@lern-fair.de',
            roles: [Role.ADMIN, Role.UNAUTHENTICATED],
        };

        authLogger.info(`Admin authenticated from ${ip}`);
    } else if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
        sessionToken = req.headers['authorization'].slice('Bearer '.length);

        if (sessionToken.length < 20) {
            throw new AuthenticationError('Session Tokens must have at least 20 characters');
        }

        const sessionUser = await getUserForSession(sessionToken);

        if (!sessionUser) {
            authLogger.info(`Unauthenticated Session(${toPublicToken(sessionToken)}) started from ${ip}`);
        } else {
            user = sessionUser;
        }
    } else {
        authLogger.info(`Unauthenticated access from ${ip}`);
    }

    const context: GraphQLContext = { user, prisma, sessionToken, ip };
    return context;
}
