import { Arg, Authorized, Ctx, FieldResolver, Resolver } from "type-graphql";
import { Role } from "./authorizations";
import { student as Student, pupil as Pupil } from "@prisma/client";
import Keyv from "keyv";
import { v4 as uuid } from "uuid";
import { GraphQLContext } from "./context";
import { assert } from "console";
import { getPupil, getScreener, getStudent } from "./util";

// This interface is close to what might be a user entity in the future
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

export function getUserForSession(sessionToken: string) {
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


@Resolver()
class AuthenticationResolver {
    @Authorized(Role.ADMIN)
    @FieldResolver()
    async loginLegacy(@Ctx() context: GraphQLContext, @Arg("authToken") authToken: string) {
        // TODO: Real implementation
        const user: GraphQLUser = {
            firstName: "Hallo",
            lastName: "Welt",
            roles: [Role.PUPIL, Role.STUDENT]
        };

        context.user = user;

    }

    @Authorized(Role.ADMIN)
    async loginScreener(@Ctx() context: GraphQLContext, @Arg("email") email: string, @Arg("password") password: string) {
        ensureSession(context);
    }

    @Authorized(Role.ADMIN)
    async logout(@Ctx() context: GraphQLContext) {
        ensureSession(context);

        if (!context.user) {
            throw new Error("User already logged out");
        }

        const deleted = userSessions.delete(context.sessionToken);
        assert(deleted, "User session is successfully deleted");

        context.user = undefined;
    }
}