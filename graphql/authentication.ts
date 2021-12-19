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
import { logInContext } from "./logging";

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
        throw new Error("Expected user to be student or if elevated, a studentId must be passed in");
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
        throw new Error("Expected user to be pupil or if elevated, a pupilId must be passed in");
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

export async function logInAsPupil(pupil: Pupil, context: GraphQLContext) {
    ensureSession(context);

    context.user = {
        firstname: pupil.firstname,
        lastname: pupil.lastname,
        email: pupil.email,
        pupilId: pupil.id,
        roles: []
    };

    userSessions.set(context.sessionToken, context.user);
    logger.info(`[${context.sessionToken}] Pupil(${pupil.id}) successfully logged in and has USER and PUPIL role`);

    await evaluatePupilRoles(pupil, context);
}

export async function evaluatePupilRoles(pupil: Pupil, context: GraphQLContext) {
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user.roles = [Role.UNAUTHENTICATED, Role.USER, Role.PUPIL];

    if (pupil.isPupil) {
        context.user.roles.push(Role.TUTEE);
        logger.info(`Pupil(${pupil.id}) has TUTEE role`);
    }

    if (pupil.isParticipant) {
        context.user.roles.push(Role.PARTICIPANT);
        logger.info(`Pupil(${pupil.id}) has PARTICIPANT role`);
    }

    if (pupil.isProjectCoachee) {
        context.user.roles.push(Role.PROJECT_COACHEE);
        logger.info(`Pupil(${pupil.id}) has PROJECT_COACHEE role`);
    }
}

export async function logInAsStudent(student: Student, context: GraphQLContext) {
    ensureSession(context);
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user = {
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        studentId: student.id,
        roles: []
    };

    logger.info(`Student(${student.id}) successfully logged in`);

    userSessions.set(context.sessionToken, context.user);
    await evaluateStudentRoles(student, context);
}

export async function evaluateStudentRoles(student: Student, context: GraphQLContext) {
    const logger = logInContext(`GraphQL Authentication`, context);

    context.user.roles = [Role.UNAUTHENTICATED, Role.USER, Role.STUDENT];

    // In general we only trust users who have validated their email to perform advanced actions (e.g. as an INSTRUCTOR)
    // NOTE: Due to historic reasons, there are users with both unset verifiedAt and verification
    if (!student.verifiedAt && student.verification) {
        return;
    }

    if (student.isStudent || student.isProjectCoach) {
        // the user wants to be a tutor or project coach, let's check if they were screened and are authorized to do so
        const wasScreened = await prisma.screening.count({ where: { studentId: student.id, success: true }}) > 0;
        if (wasScreened) {
            logger.info(`Student(${student.id}) was screened and has TUTOR role`);
            context.user.roles.push(Role.TUTOR);
        }
    }

    if (student.isProjectCoach) {
        const wasCoachScreened = await prisma.project_coaching_screening.count({ where: { studentId: student.id, success: true }}) > 0;
        if (wasCoachScreened) {
            logger.info(`Student(${student.id}) was screened and has PROJECT_COACH role`);
            context.user.roles.push(Role.PROJECT_COACH);
        }
    }

    if (student.isInstructor) {
        // the user wants to be a course instructor, let's check if they were screened and are authorized to do so
        const wasInstructorScreened = await prisma.instructor_screening.count({ where: { studentId: student.id, success: true }}) > 0;
        if (wasInstructorScreened) {
            logger.info(`Student(${student.id}) was instructor screened and has INSTRUCTOR role`);
            context.user.roles.push(Role.INSTRUCTOR);
        }
    }
}


@Resolver(of => Me)
export class AuthenticationResolver {
    @Authorized(Role.UNAUTHENTICATED)
    @Mutation(returns => Boolean)
    async loginLegacy(@Ctx() context: GraphQLContext, @Arg("authToken") authToken: string) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);

        const pupil = await prisma.pupil.findFirst({
            where: {
                // This drops support for unhashed tokens as present in the REST authentication
                authToken: hashToken(authToken),
                active: true
            }
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
                        verifiedAt: new Date()
                    },
                    where: { id: pupil.id }
                });
            }

            await logInAsPupil(pupil, context);

            return true;
        }

        const student = await prisma.student.findFirst({
            where: {
                authToken: hashToken(authToken),
                active: true
            }
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
                        verifiedAt: new Date()
                    },
                    where: { id: student.id }
                });
            }

            await logInAsStudent(student, context);

            return true;
        }

        logger.warn(`Invalid authToken`);
        throw new Error("Invalid authToken");
    }

    @Authorized(Role.UNAUTHENTICATED)
    @Mutation(returns => Boolean)
    async loginPassword(@Ctx() context: GraphQLContext, @Arg("email") email: string, @Arg("password") password: string) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);

        const screener = await prisma.screener.findFirst({
            where: {
                email,
                active: true
            }
        });

        const passwordValid = screener && await verifyPassword(password, screener.password);

        if (!screener || !passwordValid) {
            logger.warn(`Invalid email (${email}) or password`);
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
        logger.info(`Screener(${screener.id}) successfully logged in`);

        return true;
    }

    @Authorized(Role.PUPIL, Role.STUDENT, Role.SCREENER)
    @Mutation(returns => Boolean)
    logout(@Ctx() context: GraphQLContext) {
        ensureSession(context);
        const logger = logInContext(`GraphQL Authentication`, context);


        if (!context.user) {
            throw new Error("User already logged out");
        }

        const deleted = userSessions.delete(context.sessionToken);
        assert(deleted, "User session is successfully deleted");

        context.user = undefined;
        logger.info(`Successfully logged out`);

        return true;
    }
}