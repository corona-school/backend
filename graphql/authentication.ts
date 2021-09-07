import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Role } from "./authorizations";
import { student as Student, pupil as Pupil } from "@prisma/client";
import Keyv from "keyv";
import { v4 as uuid } from "uuid";
import { GraphQLContext } from "./context";
import { assert } from "console";
import { getPupil, getScreener, getStudent } from "./util";
import { Screener } from "./generated";
import { prisma } from "../common/prisma";
import { hashToken } from "../common/util/hashing";
import { getLogger } from "log4js";
import { Me } from "./me/fields";

const logger = getLogger("GraphQL Authentication");

// This interface is close to what might be a user entity in the future
// As it is persisted in the session, it should only contain commonly accessed fields that are rarely changed
export interface GraphQLUser {
    roles: Role[];

    firstName?: string;
    lastName?: string;
    email?: string;

    studentId?: number;
    pupilId?: number;
    screenerId?: number;
}

/* As we only have one backend, and there is probably no need to scale in the near future,
   a small in memory cache is sufficient. If multitenancy is needed, keyv supports other backing stores such as Redis.
   This has the advantage over JWTs that the session can stay persistent even during registration / login and we can trace users even better */
const SESSION_DURATION = 1000 * 60 * 60 * 24 /* one day */;
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

export function getSessionUser(context: GraphQLContext): GraphQLUser | never {
    if (!context.user) {
        throw new Error("Unauthenticated! Please log in");
    }

    return context.user;
}

export async function getSessionStudent(context: GraphQLContext): Promise<Student | never> {
    const { studentId } = getSessionUser(context);
    if (!studentId) {
        throw new Error("Expected user to be student");
    }
    return await getStudent(studentId);
}

export async function getSessionPupil(context: GraphQLContext): Promise<Pupil | never> {
    const { pupilId } = getSessionUser(context);
    if (!pupilId) {
        throw new Error("Expected user to be pupil");
    }
    return await getPupil(pupilId);
}

export async function getSessionScreener(context: GraphQLContext): Promise<Screener | never> {
    const { screenerId } = getSessionUser(context);
    if (!screenerId) {
        throw new Error("Expected user to be screener");
    }
    return await getScreener(screenerId);
}

function ensureSession(context: GraphQLContext) {
    if (!context.sessionToken) {
        throw Error(
            `No session token is present\n\n` +
            `If you are using the GraphQL UI, paste the following into the HTTP Headers field\n` +
            `{ "authorization": "Bearer ${suggestToken()}" }`
        );
    }
}


@Resolver(of => Me)
export class AuthenticationResolver {
    @Authorized(Role.UNAUTHENTICATED)
    @Mutation(returns => Boolean)
    async loginLegacy(@Ctx() context: GraphQLContext, @Arg("authToken") authToken: string) {
        ensureSession(context);

        let user: GraphQLUser;

        const pupil = await prisma.pupil.findFirst({
            where: {
                OR: [
                    { authToken: hashToken(authToken) },
                    { authToken }
                ],
                active: true
            }
        });

        if (pupil) {
            user = {
                firstName: pupil.firstname,
                lastName: pupil.lastname,
                email: pupil.email,
                roles: [Role.PUPIL]
            };

            logger.info(`[${context.sessionToken}] Pupil(${pupil.id}) successfully logged in`);
        }

        const student = await prisma.student.findFirst({
            where: {
                OR: [
                    { authToken: hashToken(authToken) },
                    { authToken }
                ],
                active: true
            }
        });

        if (student) {
            assert(!user, "AuthTokens may not collide");

            user = {
                firstName: student.firstname,
                lastName: student.lastname,
                email: student.email,
                roles: [Role.STUDENT]
            };

            logger.info(`[${context.sessionToken}] Student(${student.id}) successfully logged in`);
        }

        if (!user) {
            logger.warn(`[${context.sessionToken}] Invalid authToken`);
            throw new Error("Invalid authToken");
        }

        context.user = user;
        userSessions.set(context.sessionToken, user);

        return true;
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation(returns => Boolean)
    async loginScreener(@Ctx() context: GraphQLContext, @Arg("email") email: string, @Arg("password") password: string) {
        ensureSession(context);

        const screener = await prisma.screener.findFirst({
            where: {
                email,
                password // TODO: Plaintext?
            }
        });

        if (!screener) {
            logger.info(`[${context.sessionToken}] Invalid screener email or password`);
            throw new Error("Invalid email or password");
        }

        const user: GraphQLUser = {
            firstName: screener.firstname,
            lastName: screener.lastname,
            email: screener.email,
            roles: [Role.SCREENER]
        };

        context.user = user;
        userSessions.set(context.sessionToken, user);
        logger.info(`[${context.sessionToken}] Screener(${screener.id}) successfully logged in`);

        return true;
    }

    @Authorized(Role.PUPIL, Role.STUDENT, Role.SCREENER)
    @Mutation(returns => Boolean)
    async logout(@Ctx() context: GraphQLContext) {
        ensureSession(context);

        if (!context.user) {
            throw new Error("User already logged out");
        }

        const deleted = userSessions.delete(context.sessionToken);
        assert(deleted, "User session is successfully deleted");

        context.user = undefined;

        return true;
    }
}