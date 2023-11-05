import { getUser, updateUser, User } from '../user';
import { prisma } from '../prisma';
import { v4 as uuid } from 'uuid';
import { hashToken } from '../util/hashing';
import * as Notification from '../notification';
import { getLogger } from '../logger/logger';
import { isDev, isTest, USER_APP_DOMAIN } from '../util/environment';
import { validateEmail } from '../../graphql/validators';
import { Email } from '../notification/types';
import { isEmailAvailable } from '../user/email';
import { secret_type_enum as SecretType } from '@prisma/client';
import { createSecretEmailToken } from './emailToken';

const logger = getLogger('Token');

export async function revokeToken(user: User | null, id: number) {
    const result = await prisma.secret.deleteMany({ where: { id, userId: user?.userID } });
    if (result.count !== 1) {
        throw new Error(`Failed to revoke token, does not exist`);
    }

    logger.info(`User(${user?.userID}) revoked token Secret(${id})`);
}

// One can revoke any token that is known - i.e. one can also revoke a token if the token was leaked
export async function revokeTokenByToken(token: string) {
    const hash = hashToken(token);
    const secret = await prisma.secret.findFirst({
        where: { secret: hash, type: { in: [SecretType.EMAIL_TOKEN, SecretType.TOKEN] } },
    });
    if (!secret) {
        throw new Error(`Secret not found`);
    }

    await prisma.secret.delete({ where: { id: secret.id } });

    logger.info(`Token Secret(${secret.id}) was revoked`);
}

// The token returned by this function MAY NEVER be persisted and may only be sent to the user
export async function createToken(user: User, expiresAt: Date | null = null, description: string | null = null): Promise<string> {
    const token = uuid();
    const hash = hashToken(token);

    const result = await prisma.secret.create({
        data: {
            type: SecretType.TOKEN,
            userId: user.userID,
            secret: hash,
            expiresAt,
            lastUsed: null,
            description,
        },
    });

    logger.info(`User(${user.userID}) created token Secret(${result.id})`);

    return token;
}

// NOTE: Only use for testing purposes
export async function _createFixedToken(user: User, token: string): Promise<void> {
    const hash = hashToken(token);

    const result = await prisma.secret.create({
        data: {
            type: SecretType.TOKEN,
            userId: user.userID,
            secret: hash,
            expiresAt: null,
            lastUsed: null,
        },
    });
    logger.info(`User(${user.userID}) created token Secret(${result.id})`);
}

// Sends the token to the user via E-Mail using one of the supported Notification actions (to distinguish the user messaging around the token login)
// Also a redirectTo URL is provided which is passed through to the frontend
export async function requestToken(
    user: User,
    action: 'user-verify-email' | 'user-authenticate' | 'user-password-reset' | 'user-email-change',
    redirectTo?: string,
    newEmail?: string
) {
    newEmail = validateEmail(newEmail);

    if (action !== 'user-email-change' && newEmail != undefined) {
        throw new Error('Email may only be changed with the user-email-change token request');
    }

    const token = await createSecretEmailToken(user, newEmail);

    if (redirectTo) {
        // Ensures that the user is not redirected to a potential third party
        const { host } = new URL(redirectTo, `https://${USER_APP_DOMAIN}/`);
        if (!isDev && !isTest && !host.endsWith('lern-fair.de')) {
            throw new Error(`Invalid redirectTo host '${host}'`);
        }

        // Base64 encode, as the redirectTo might be placed as a query parameter in an URL
        redirectTo = Buffer.from(redirectTo, 'utf-8').toString('base64');
    }

    await Notification.actionTaken(user, action, { token, redirectTo: redirectTo ?? '', overrideReceiverEmail: newEmail as Email });
}

export async function loginToken(token: string): Promise<User | never> {
    const secret = await prisma.secret.findFirst({
        where: {
            secret: hashToken(token),
            type: { in: [SecretType.EMAIL_TOKEN, SecretType.TOKEN] },
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        },
    });

    if (!secret) {
        throw new Error(`Invalid Token`);
    }

    let user = await getUser(secret.userId, /* active */ true);

    if (secret.type === SecretType.EMAIL_TOKEN) {
        if (!secret.expiresAt) {
            // Sometimes users fail to perform the desired action with the token and retry by clicking the email again,
            //  or they try to use the same link on multiple devices. Thus we allow the link to be used more than once,
            //  but only expire it soon to not reduce the possibility that eavesdroppers use the token
            const inOneHour = new Date();
            inOneHour.setHours(inOneHour.getHours() + 1);
            await prisma.secret.update({ where: { id: secret.id }, data: { expiresAt: inOneHour, lastUsed: new Date() } });
            logger.info(`User(${user.userID}) logged in with email token Secret(${secret.id}), token will be revoked in one hour`);
        } else {
            await prisma.secret.update({ data: { lastUsed: new Date() }, where: { id: secret.id } });
            logger.info(`User(${user.userID}) logged in with email token Secret(${secret.id}) it will expire at ${secret.expiresAt.toISOString()}`);
        }

        if (secret.description) {
            // For EMAIL_TOKEN secrets, the description field is used to store the email the token was sent to
            // Thus if a token was sent to a different email than the users email, we assume that the user wants to change their email:
            const newEmail = secret.description;

            if (!(await isEmailAvailable(newEmail))) {
                throw new Error(`User(${user.userID}) tried to change their email to ${newEmail}, but this is already used`);
            }

            user = await updateUser(secret.userId, { email: newEmail });
            logger.info(`User(${user.userID}) changed their email to ${newEmail} via email token login`);
        }
    } else {
        await prisma.secret.update({ data: { lastUsed: new Date() }, where: { id: secret.id } });
        logger.info(`User(${user.userID}) logged in with persistent token Secret(${secret.id})`);
    }

    if (secret.type === SecretType.EMAIL_TOKEN) {
        await verifyEmail(user);
    }

    return user;
}

export async function verifyEmail(user: User) {
    if (user.studentId) {
        const { verifiedAt, verification } = await prisma.student.findUniqueOrThrow({
            where: { id: user.studentId },
            select: { verifiedAt: true, verification: true },
        });
        if (!verifiedAt || verification) {
            await prisma.student.update({
                data: { verifiedAt: new Date(), verification: null },
                where: { id: user.studentId },
            });

            logger.info(`Student(${user.studentId}) verified their e-mail by logging in with an e-mail token`);
        }
    }

    if (user.pupilId) {
        const { verifiedAt, verification } = await prisma.pupil.findUniqueOrThrow({
            where: { id: user.pupilId },
            select: { verifiedAt: true, verification: true },
        });
        if (!verifiedAt || verification) {
            await prisma.pupil.update({
                data: { verifiedAt: new Date(), verification: null },
                where: { id: user.pupilId },
            });

            logger.info(`Pupil(${user.pupilId}) verified their e-mail by logging in with an e-mail token`);
        }
    }
}
