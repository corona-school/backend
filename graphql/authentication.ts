import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from './roles';
import { student as Student, pupil as Pupil, screener as Screener } from '@prisma/client';
import Keyv from 'keyv';
import { v4 as uuid } from 'uuid';
import type { GraphQLContext } from './context';
import { assert } from 'console';
import { Deprecated, getPupil, getScreener, getStudent } from './util';
import { prisma } from '../common/prisma';
import { hashPassword, hashToken, verifyPassword } from '../common/util/hashing';
import { getLogger } from 'log4js';
import { AuthenticationError, ForbiddenError } from './error';
import { logInContext } from './logging';
import { User, userForPupil, userForScreener, userForStudent } from '../common/user';
import { loginPassword, loginToken } from '../common/secret';
import { evaluatePupilRoles, evaluateScreenerRoles, evaluateStudentRoles } from './roles';
import { defaultScreener } from '../common/entity/Screener';
import { UserType } from './types/user';

const logger = getLogger('GraphQL Authentication');

// This interface is close to what might be a user entity in the future
// As it is persisted in the session, it should only contain commonly accessed fields that are rarely changed
export interface GraphQLUser extends User {
    roles: Role[];
}

export const UNAUTHENTICATED_USER = {
    email: '-',
    firstname: '',
    lastname: '',
    userID: '-/-',
    roles: [Role.UNAUTHENTICATED],
};

/* As we only have one backend, and there is probably no need to scale in the near future,
   a small in memory cache is sufficient. If multitenancy is needed, keyv supports other backing stores such as Redis.
   This has the advantage over JWTs that the session can stay persistent even during registration / login and we can trace users even better */
const SESSION_DURATION = 1000 * 60 * 60 * 24; /* one day */
const userSessions = new Keyv<GraphQLUser>({ ttl: SESSION_DURATION });

/* We generate session tokens clientside as we can then use the same session token for all GraphQL requests without changing HTTP headers.
   Nevertheless the backend can suggest secure tokens */
export const suggestToken = () => uuid();

// Logging the session token would allow admins with access to the logs to impersonate users
// By logging only part of the token, we can identify users whilst preventing session takeover
export const toPublicToken = (token: string) => token.slice(0, -5);

export async function getUserForSession(sessionToken: string) {
    return userSessions.get(sessionToken);
}

export async function updateSessionUser(context: GraphQLContext, user: User) {
    // Only update the session user if the user updated was the user associated to the session (and e.g. not a screener or admin)
    if (context.user.userID === user.userID) {
        await loginAsUser(user, context);
    }
}

export function getSessionUser(context: GraphQLContext): GraphQLUser | never {
    if (!context.user) {
        throw new AuthenticationError('Unauthenticated! Please log in');
    }

    return context.user;
}

/* In a lot of scenarios, Admins and Screeners can perform actions on behalf of the user, that's what we call 'elevated' */
export function isElevated(context: GraphQLContext) {
    const { roles } = getSessionUser(context);
    return roles.includes(Role.ADMIN) || roles.includes(Role.SCREENER);
}

export function assertElevated(context: GraphQLContext) {
    if (!isElevated(context)) {
        throw new Error(`Only Admins or Screeners can override the session pupil`);
    }
}

export const isSessionStudent = (context: GraphQLContext) => getSessionUser(context).studentId !== undefined;
export const isSessionPupil = (context: GraphQLContext) => getSessionUser(context).pupilId !== undefined;
export const isSessionScreener = (context: GraphQLContext) => getSessionUser(context).screenerId !== undefined;

export async function getSessionStudent(context: GraphQLContext, studentIdOverride?: number): Promise<Student | never> {
    if (studentIdOverride !== undefined) {
        assertElevated(context);
        return await getStudent(studentIdOverride);
    }

    const { studentId } = getSessionUser(context);

    if (!studentId) {
        throw new ForbiddenError('Expected user to be student or if elevated, a studentId must be passed in');
    }
    return await getStudent(studentId);
}

export async function getSessionPupil(context: GraphQLContext, pupilIdOverride?: number): Promise<Pupil | never> {
    const { pupilId } = getSessionUser(context);

    if (pupilIdOverride !== undefined) {
        assertElevated(context);
        return await getPupil(pupilIdOverride);
    }

    if (!pupilId) {
        throw new ForbiddenError('Expected user to be pupil or if elevated, a pupilId must be passed in');
    }

    return await getPupil(pupilId);
}

export async function getSessionScreener(context: GraphQLContext): Promise<Screener | never> {
    if (context.user.roles.includes(Role.ADMIN)) {
        return await defaultScreener;
    }

    const { screenerId } = getSessionUser(context);
    if (!screenerId) {
        throw new ForbiddenError('Expected user to be screener');
    }
    return await getScreener(screenerId);
}

function ensureSession(context: GraphQLContext) {
    if (!context.sessionToken) {
        throw new AuthenticationError(
            `No session token is present\n\n` +
                `If you are using the GraphQL UI, paste the following into the HTTP Headers field\n` +
                `{ "authorization": "Bearer ${suggestToken()}" }`
        );
    }
}

export async function loginAsUser(user: User, context: GraphQLContext, noSession = false) {
    if (!noSession) {
        ensureSession(context);
    }

    context.user = { ...user, roles: [] };

    if (user.studentId) {
        const student = await getStudent(user.studentId);
        await evaluateStudentRoles(student, context);
    }

    if (user.pupilId) {
        const pupil = await getPupil(user.pupilId);
        await evaluatePupilRoles(pupil, context);
    }

    if (user.screenerId) {
        await evaluateScreenerRoles(user, context);
    }

    if (!noSession) {
        userSessions.set(context.sessionToken, context.user);
        logger.info(`[${context.sessionToken}] User(${user.userID}) successfully logged in`);
    }
}

@Resolver((of) => UserType)
export class AuthenticationResolver {
    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => String)
    suggestSessionToken() {
        return suggestToken();
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    @Deprecated('use loginPassword or loginToken instead')
    async loginLegacy(@Ctx() context: GraphQLContext, @Arg('authToken') authToken: string) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);

        const pupil = await prisma.pupil.findFirst({
            where: {
                // This drops support for unhashed tokens as present in the REST authentication
                authToken: hashToken(authToken),
                active: true,
            },
        });

        if (pupil) {
            if (!pupil.verifiedAt) {
                /* Previously there was an extra database field for verifying the E-Mail.
                   I do not see the purpose of that, as presenting a valid authToken is also proof that the account exists.
                   This can co-exist with the current "verification" implementation.
                   TODO: Drop the verification column once we moved to GraphQL on the frontend */
                logger.info(`Pupil(${pupil.id}) did not verify their e-mail yet, but presented legacy token (thus proved their ownership)`);
                await prisma.pupil.update({
                    data: {
                        verification: null,
                        verifiedAt: new Date(),
                    },
                    where: { id: pupil.id },
                });
            }

            await loginAsUser(userForPupil(pupil), context);

            return true;
        }

        const student = await prisma.student.findFirst({
            where: {
                authToken: hashToken(authToken),
                active: true,
            },
        });

        if (student) {
            if (!student.verifiedAt) {
                /* Previously there was an extra database field for verifying the E-Mail.
                   I do not see the purpose of that, as presenting a valid authToken is also proof that the account exists.
                   This can co-exist with the current "verification" implementation.
                   TODO: Drop the verification column once we moved to GraphQL on the frontend */
                logger.info(`Student(${student.id}) did not verify their e-mail yet, but presented legacy token (thus proved their ownership)`);
                await prisma.student.update({
                    data: {
                        verification: null,
                        verifiedAt: new Date(),
                    },
                    where: { id: student.id },
                });
            }

            await loginAsUser(userForStudent(student), context);

            return true;
        }

        logger.warn(`Invalid authToken`);
        throw new AuthenticationError('Invalid authToken');
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    @Deprecated('Use loginPassword instead')
    async loginPasswordLegacy(@Ctx() context: GraphQLContext, @Arg('email') email: string, @Arg('password') password: string) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);

        const screener = await prisma.screener.findFirst({
            where: {
                email,
                active: true,
            },
        });

        const passwordValid = screener && (await verifyPassword(password, screener.password));

        if (!screener || !passwordValid) {
            logger.warn(`Invalid email (${email}) or password`);
            throw new AuthenticationError('Invalid email or password');
        }

        await loginAsUser(userForScreener(screener), context);

        return true;
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    createCookieSession(@Ctx() context: GraphQLContext) {
        context.sessionToken = suggestToken();
        context.setCookie('LERNFAIR_SESSION', context.sessionToken);
        return true;
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    async loginPassword(@Ctx() context: GraphQLContext, @Arg('email') email: string, @Arg('password') password: string) {
        ensureSession(context);

        try {
            const user = await loginPassword(email, password);
            await loginAsUser(user, context);

            return true;
        } catch (error) {
            throw new AuthenticationError('Invalid E-Mail or Password');
        }
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    async loginToken(@Ctx() context: GraphQLContext, @Arg('token') token: string) {
        try {
            const user = await loginToken(token);
            await loginAsUser(user, context);
            return true;
        } catch (error) {
            throw new AuthenticationError('Invalid Token');
        }
    }

    @Authorized(Role.USER)
    @Mutation((returns) => Boolean)
    logout(@Ctx() context: GraphQLContext) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);

        if (!context.user) {
            throw new ForbiddenError('User already logged out');
        }

        const deleted = userSessions.delete(context.sessionToken);
        assert(deleted, 'User session is successfully deleted');

        context.user = undefined;
        logger.info(`Successfully logged out`);

        return true;
    }
}
