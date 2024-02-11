// This interface is close to what might be a user entity in the future

import { Role } from './roles';
import Keyv from 'keyv';
import { User } from '.';
import { v4 as uuid } from 'uuid';
import { DEFAULT_PREFERENCES } from '../notification/defaultPreferences';
import { getLogger } from '../logger/logger';
import { evaluateUserRoles } from './evaluate_roles';

const logger = getLogger('Session');

// As it is persisted in the session, it should only contain commonly accessed fields that are rarely changed
export interface GraphQLUser extends User {
    roles: Role[];
}

export const UNAUTHENTICATED_USER = {
    email: '-',
    firstname: '',
    lastname: '',
    userID: '-/-',
    lastTimeCheckedNotifications: new Date(),
    notificationPreferences: DEFAULT_PREFERENCES,
    roles: [Role.UNAUTHENTICATED],
    lastLogin: new Date(),
    active: false,
};

/* As we only have one backend, and there is probably no need to scale in the near future,
   a small in memory cache is sufficient. If multitenancy is needed, keyv supports other backing stores such as Redis.
   This has the advantage over JWTs that the session can stay persistent even during registration / login and we can trace users even better */
const SESSION_DURATION = 1000 * 60 * 60 * 24; /* one day */
export const userSessions = new Keyv<GraphQLUser>({ ttl: SESSION_DURATION });

/* We generate session tokens clientside as we can then use the same session token for all GraphQL requests without changing HTTP headers.
   Nevertheless the backend can suggest secure tokens */
export const suggestToken = () => uuid();

// Logging the session token would allow admins with access to the logs to impersonate users
// By logging only part of the token, we can identify users whilst preventing session takeover
export const toPublicToken = (token: string) => token.slice(0, -5);

export async function getUserForSession(sessionToken: string) {
    return await userSessions.get(sessionToken);
}

// As roles are only evaluated once per session, sometimes it makes sense to update sessions roles in-flight
// so that clients directly see the new roles once the client updates (i.e. the user app caches it till a refresh happens)
export async function updateSessionRolesOfUser(userID: string) {
    const sessionsToUpdate: string[] = [];
    // This for sure is O(n) with the number of authenticated users - but as this is rather rare,
    // I guess there is no need yet to maintain a userID -> session bimap
    for await (const [sessionToken, user] of userSessions.iterator() as AsyncIterable<[string, GraphQLUser]>) {
        if (user.userID === userID) {
            sessionsToUpdate.push(sessionToken);
        }
    }

    for (const sessionToken of sessionsToUpdate) {
        const user = await userSessions.get(sessionToken);
        if (user) {
            // session might have been deleted in the meantime
            user.roles = await evaluateUserRoles(user);
            // as keyv serializes entries, we need to explicitly set(...) to reflect the update:
            await userSessions.set(sessionToken, user);

            logger.info(`Updated Roles of Session(${sessionToken}) of User(${userID})`);
        }
    }
}
