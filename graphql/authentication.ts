import { Arg, Authorized, Ctx, Mutation, registerEnumType, Resolver } from 'type-graphql';
import { student as Student, pupil as Pupil, screener as Screener } from '@prisma/client';
import type { GraphQLContext, GraphQLContextPupil, GraphQLContextScreener, GraphQLContextStudent } from './context';
import { assert } from 'console';
import { Deprecated, getPupil, getScreener, getStudent } from './util';
import { prisma } from '../common/prisma';
import { verifyPassword } from '../common/util/hashing';
import { getLogger } from '../common/logger/logger';
import { AuthenticationError, ForbiddenError } from './error';
import { getUser, getUserByEmail, updateLastLogin, User, userForScreener } from '../common/user';
import { determinePreferredLoginOption, isImpersonationToken, LoginOption, loginPassword, loginToken, verifyEmail } from '../common/secret';
import { UserType } from './types/user';
import { GraphQLUser, suggestToken, userSessions } from '../common/user/session';
import { validateEmail } from './validators';
import { defaultScreener } from '../common/util/screening';
import { evaluateUserRoles } from '../common/user/evaluate_roles';
import { Role } from '../common/user/roles';
import { actionTaken } from '../common/notification';
import { authenticateWithIDP } from '../common/idp';
import { createIDPLogin, getUserIdFromIDPLogin, userHasIDPLogin } from '../common/secret/idp';
import { isEmailAvailable } from '../common/user/email';
import { PrerequisiteError } from '../common/util/error';

export { GraphQLUser, toPublicToken, UNAUTHENTICATED_USER, getUserForSession } from '../common/user/session';

const logger = getLogger('GraphQL Authentication');

export async function updateSessionUser(context: GraphQLContext, user: User, deviceId: string | null) {
    // Only update the session user if the user updated was the user associated to the session (and e.g. not a screener or admin)
    if (context.user.userID === user.userID) {
        await loginAsUser(user, context, deviceId);
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

export function isScreener(context: GraphQLContext) {
    const { roles } = getSessionUser(context);
    return roles.includes(Role.SCREENER);
}

export function isAdmin(context: GraphQLContext) {
    const { roles } = getSessionUser(context);
    return roles.includes(Role.ADMIN);
}

export function assertElevated(context: GraphQLContext) {
    if (!isElevated(context)) {
        throw new Error(`Only Admins or Screeners can override the session pupil/student`);
    }
}

export const isSessionStudent = (context: GraphQLContext): context is GraphQLContextStudent => getSessionUser(context).studentId !== undefined;
export const isSessionPupil = (context: GraphQLContext): context is GraphQLContextPupil => getSessionUser(context).pupilId !== undefined;
export const isSessionScreener = (context: GraphQLContext): context is GraphQLContextScreener => getSessionUser(context).screenerId !== undefined;

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

export async function loginAsUser(user: User, context: GraphQLContext, deviceId: string | null, isImpersonation?: boolean) {
    ensureSession(context);
    const roles = await evaluateUserRoles(user);
    context.user = { ...user, deviceId, roles };

    await userSessions.set(context.sessionToken, context.user);
    logger.info(`[${context.sessionToken}] User(${user.userID}) successfully logged in`);
    if (!isImpersonation) {
        await updateLastLogin(user);
    }
}

enum SSOAuthStatus {
    success,
    register,
    error,
    link,
}

registerEnumType(SSOAuthStatus, {
    name: 'SSOAuthStatus',
});

@Resolver((of) => UserType)
export class AuthenticationResolver {
    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => String)
    suggestSessionToken() {
        return suggestToken();
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    @Deprecated('Use loginPassword instead')
    async loginPasswordLegacy(@Ctx() context: GraphQLContext, @Arg('email') email: string, @Arg('password') password: string) {
        email = validateEmail(email);

        ensureSession(context);

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

        await loginAsUser(userForScreener(screener), context, undefined);

        return true;
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    createCookieSession(@Ctx() context: GraphQLContext) {
        context.sessionToken = suggestToken();
        context.setCookie('LERNFAIR_SESSION', context.sessionToken);
        return true;
    }

    @Authorized(Role.UNAUTHENTICATED, Role.SSO_REGISTERING_USER)
    @Mutation((returns) => Boolean)
    async loginPassword(
        @Ctx() context: GraphQLContext,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('deviceId', { nullable: true }) deviceId: string | null
    ) {
        const sessionUser = context.user;
        email = validateEmail(email);

        ensureSession(context);

        /** User is trying to link their Lern-Fair account with an IDP */
        const isSSO = context.user.roles.includes(Role.SSO_REGISTERING_USER);

        if (isSSO && (!sessionUser.idpClientId || !sessionUser.idpSub)) {
            throw new Error(`Cannot complete request without an IDP ClientID / IDP Sub`);
        }

        try {
            const user = await loginPassword(email, password);
            await loginAsUser(user, context, deviceId);

            if (user.studentId) {
                await actionTaken(user, 'student_login', {});
            } else if (user.pupilId) {
                await actionTaken(user, 'pupil_login', {});
            }

            // Now that the user confirmed their identity, we can complete linking process
            if (isSSO) {
                await createIDPLogin(user.userID, sessionUser.idpSub, sessionUser.idpClientId);
                await userSessions.set(context.sessionToken, {
                    ...context.user,
                    roles: context.user.roles.concat(Role.SSO_USER),
                });
            }

            return true;
        } catch (error) {
            throw new AuthenticationError('Invalid E-Mail or Password');
        }
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => Boolean)
    async loginToken(@Ctx() context: GraphQLContext, @Arg('token') token: string, @Arg('deviceId', { nullable: true }) deviceId: string | null) {
        try {
            const [user, isImpersonation] = await loginToken(token, deviceId);
            await loginAsUser(user, context, deviceId, isImpersonation);
            if (user.studentId) {
                await actionTaken(user, 'student_login', {});
            } else if (user.pupilId) {
                await actionTaken(user, 'pupil_login', {});
            }
            return true;
        } catch (error) {
            logger.info(`Failed to log in with token: ${error}`);
            throw new AuthenticationError('Invalid Token');
        }
    }

    @Authorized(Role.USER)
    @Mutation((returns) => Boolean)
    async loginRefresh(@Ctx() context: GraphQLContext) {
        const sessionUser = getSessionUser(context);
        await updateSessionUser(context, sessionUser, sessionUser.deviceId);
        return true;
    }

    @Authorized(Role.ADMIN)
    @Mutation((returns) => Boolean)
    async _verifyEmail(@Arg('userID') userID: string) {
        const user = await getUser(userID);
        await verifyEmail(user);
        return true;
    }

    @Authorized(Role.USER, Role.SSO_REGISTERING_USER)
    @Mutation((returns) => Boolean)
    logout(@Ctx() context: GraphQLContext) {
        ensureSession(context);

        if (!context.user) {
            throw new ForbiddenError('User already logged out');
        }

        const deleted = userSessions.delete(context.sessionToken);
        assert(deleted, 'User session is successfully deleted');

        context.user = undefined;
        logger.info(`Successfully logged out`);

        return true;
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation((returns) => SSOAuthStatus)
    async loginWithSSO(@Ctx() context: GraphQLContext, @Arg('code') code: string, @Arg('referrer') referrer: string) {
        const { email, firstname, lastname, clientId, sub } = await authenticateWithIDP({ code, referrer });
        if (!email || !firstname) {
            throw new Error('Invalid token payload: Missing required fields (email/name)');
        }

        const setSSORegisteringUser = async () => {
            const newRoles = new Set(context.user.roles.concat(Role.SSO_REGISTERING_USER));
            await userSessions.set(context.sessionToken, {
                ...context.user,
                roles: Array.from(newRoles),
                email,
                firstname,
                lastname,
                idpClientId: clientId,
                idpSub: sub,
            });
        };

        try {
            // Get our userId using IDP sub/clientId
            const userId = await getUserIdFromIDPLogin(sub, clientId);
            const user = await getUser(userId, true);
            // A user with the given IDP sub/clientId was found
            await loginAsUser(user, context, getSessionUser(context).deviceId);
            return SSOAuthStatus.success;
        } catch (error) {
            // No credentials with the given sub/clientId, check if the email is available
            if (await isEmailAvailable(email)) {
                // User is not registered. They'll have to complete the registration flow
                await setSSORegisteringUser();
                return SSOAuthStatus.register;
            }

            // If email is already taken, we'll try to link it with the given sub/clientId
            const user = await getUserByEmail(email);
            const preferredLoginOption = await determinePreferredLoginOption(user);

            if (preferredLoginOption === LoginOption.password) {
                await setSSORegisteringUser();
                return SSOAuthStatus.link;
            }
            // For now we don't allow IDP linking for this type of authentication (magic link)
            throw new PrerequisiteError('Account linking with an Identity Provider requires a password. Please set a password first');
        }
    }
}
