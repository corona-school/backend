import type { PrismaClient } from '@prisma/client';
import { prisma } from '../common/prisma';
import { getLogger } from '../common/logger/logger';
import basicAuth from 'basic-auth';
import * as crypto from 'crypto';
import { getUserForSession, GraphQLUser, loginAsUser, toPublicToken, UNAUTHENTICATED_USER } from './authentication';
import { AuthenticationError } from 'apollo-server-errors';
import { loginPassword } from '../common/secret';
import { Request, Response } from 'express';
import { attachSession, Session, startTransaction, Transaction } from '../common/session';
import { Role } from '../common/user/roles';

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

export interface GraphQLContext extends Session {
    user: Readonly<GraphQLUser>;
    sessionToken?: string;
    prisma: PrismaClient;
    deferredRequiredRoles?: Role[];
    ip: string;
    setCookie(key: string, value: string);
}

type GraphQLUserStudent = GraphQLUser & { studentId: number };
type GraphQLUserPupil = GraphQLUser & { pupilId: number };
type GraphQLUserScreener = GraphQLUser & { screenerId: number };

export type GraphQLContextStudent = GraphQLContext & { user: Readonly<GraphQLUserStudent> };
export type GraphQLContextPupil = GraphQLContext & { user: Readonly<GraphQLUserPupil> };
export type GraphQLContextScreener = GraphQLContext & { user: Readonly<GraphQLUserScreener> };

const authLogger = getLogger('GraphQL Authentication');

if (!process.env.ADMIN_AUTH_TOKEN) {
    authLogger.warn('Missing ADMIN_AUTH_TOKEN, Admin API access is disabled');
}

export default async function injectContext({ req, res }: { req: Request; res: Response }) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const auth = basicAuth(req);

    const context: GraphQLContext = {
        user: UNAUTHENTICATED_USER,
        prisma,
        sessionToken: undefined,
        sessionID: '?',
        ip,
        setCookie: (key, value) => res.cookie(key, value, { secure: true }),
    };

    if (process.env.ADMIN_AUTH_TOKEN && auth && auth.name === 'admin') {
        if (!timingSafeCompare(process.env.ADMIN_AUTH_TOKEN, auth.pass)) {
            authLogger.warn(`Admin failed to authenticate from ${ip}`);
            throw new AuthenticationError('Invalid Admin Password');
        }

        context.user = {
            userID: 'admin/',
            firstname: 'Ed',
            lastname: 'Min',
            email: 'test@lern-fair.de',
            roles: [Role.ADMIN, Role.UNAUTHENTICATED],
            lastLogin: new Date(),
            active: true,
            secretID: undefined,
        };
        context.sessionID = 'ADMIN';

        authLogger.info(`Admin authenticated from ${ip}`);
    } else if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
        context.sessionToken = req.headers['authorization'].slice('Bearer '.length);
        context.sessionID = toPublicToken(context.sessionToken);

        if (context.sessionToken.length < 20) {
            throw new AuthenticationError('Session Tokens must have at least 20 characters');
        }

        const sessionUser = await getUserForSession(context.sessionToken);

        if (!sessionUser) {
            authLogger.info(`Unauthenticated Session(${context.sessionID}) started from ${ip}`);
        } else {
            context.user = sessionUser;
        }
    } else if (req.cookies['LERNFAIR_SESSION']) {
        context.sessionToken = req.cookies['LERNFAIR_SESSION'];
        context.sessionID = toPublicToken(context.sessionToken);

        if (context.sessionToken.length < 20) {
            throw new AuthenticationError('Session Tokens must have at least 20 characters');
        }

        const sessionUser = await getUserForSession(context.sessionToken);

        if (!sessionUser) {
            authLogger.info(`Unauthenticated Session(${context.sessionID}) started from ${ip}`);
        } else {
            context.user = sessionUser;
        }
    } else {
        authLogger.info(`Unauthenticated access from ${ip}`);
    }

    attachSession(context);

    return context;
}
