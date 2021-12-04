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
import { hashPassword, hashToken, verifyPassword } from "../common/util/hashing";
import { getLogger } from "log4js";
import { Me } from "./me/fields";

const logger = getLogger("GraphQL Authentication");

// This interface is close to what might be a user entity in the future
// As it is persisted in the session, it should only contain commonly accessed fields that are rarely changed
export interface GraphQLUser {
    roles: Role[];

    firstname?: string;
    lastname?: string;
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
                // This drops support for unhashed tokens as present in the REST authentication
                authToken: hashToken(authToken),
                active: true
            }
        });

        if (pupil) {
            user = {
                firstname: pupil.firstname,
                lastname: pupil.lastname,
                email: pupil.email,
                pupilId: pupil.id,
                roles: [Role.USER, Role.PUPIL, Role.UNAUTHENTICATED]
            };

            logger.info(`[${context.sessionToken}] Pupil(${pupil.id}) successfully logged in`);
        }

        const student = await prisma.student.findFirst({
            where: {
                authToken: hashToken(authToken),
                active: true
            }
        });

        if (student) {
            assert(!user, "AuthTokens may not collide");

            user = {
                firstname: student.firstname,
                lastname: student.lastname,
                email: student.email,
                studentId: student.id,
                roles: [Role.USER, Role.STUDENT, Role.UNAUTHENTICATED]
            };

            logger.info(`[${context.sessionToken}] Student(${student.id}) successfully logged in`);

            if (student.isStudent || student.isProjectCoach) {
                // the user wants to be a tutor or project coach, let's check if they were screened and are authorized to do so
                const wasScreened = await prisma.screening.count({ where: { studentId: student.id, success: true }}) > 0;
                if (wasScreened && student.isStudent) { // "isStudent" means the student wants to be a tutor
                    logger.info(`[${context.sessionToken}] Student(${student.id}) was screened and has TUTOR role`);
                    user.roles.push(Role.TUTOR);
                }

                if (wasScreened && student.isProjectCoach) {
                    logger.info(`[${context.sessionToken}] Student(${student.id}) was screened and has PROJECT_COACH role`);
                    user.roles.push(Role.PROJECT_COACH);
                }
            }

            if (student.isInstructor) {
                // the user wants to be a course instructor, let's check if they were screened and are authorized to do so
                const wasInstructorScreened = await prisma.instructor_screening.count({ where: { studentId: student.id, success: true }}) > 0;
                if (wasInstructorScreened) {
                    logger.info(`[${context.sessionToken}] Student(${student.id}) was instructor screened and has INSTRUCTOR role`);
                    user.roles.push(Role.INSTRUCTOR);
                }
            }
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
    async loginPassword(@Ctx() context: GraphQLContext, @Arg("email") email: string, @Arg("password") password: string) {
        ensureSession(context);

        const screener = await prisma.screener.findFirst({
            where: {
                email,
                active: true
            }
        });

        const passwordValid = screener && await verifyPassword(password, screener.password);

        if (!screener || !passwordValid) {
            logger.warn(`[${context.sessionToken}] Invalid email (${email}) or password`);
            throw new Error("Invalid email or password");
        }

        const user: GraphQLUser = {
            firstname: screener.firstname,
            lastname: screener.lastname,
            email: screener.email,
            roles: [Role.USER, Role.SCREENER, Role.UNAUTHENTICATED],
            screenerId: screener.id
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