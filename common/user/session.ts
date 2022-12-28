// This interface is close to what might be a user entity in the future

import { Role } from './roles';
import Keyv from 'keyv';
import { User } from '.';
import { v4 as uuid } from 'uuid';
import { DEFAULT_PREFERENCES } from '../../notifications/defaultPreferences';

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
    return userSessions.get(sessionToken);
}
