import { User } from '../user';
import { prisma } from '../prisma';
import { v4 as uuid } from 'uuid';
import { hashToken } from '../util/hashing';
import { Moment } from 'moment';
import { secret_type_enum as SecretType } from '@prisma/client';
import { getLogger } from '../logger/logger';

const logger = getLogger('Token');

// The token returned by this function MAY NEVER be persisted and may only be sent to the user by email
// If newEmail ist set, the token MUST be sent to that new email

// TODO: we should create a dedicated field for newEmail
export async function createSecretEmailToken(user: User, newEmail?: string, expiresAt?: Moment): Promise<string> {
    const token = uuid();
    const hash = hashToken(token);

    const result = await prisma.secret.create({
        data: {
            type: SecretType.EMAIL_TOKEN,
            userId: user.userID,
            secret: hash,
            expiresAt: expiresAt?.toDate(),
            lastUsed: null,
            description: newEmail,
        },
    });

    logger.info(`Created a new email token Secret(${result.id}) for User(${user.userID}) with email change ${newEmail ?? '-'}`);

    return token;
}
