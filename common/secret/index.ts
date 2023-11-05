import { User } from '../user';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { secret_type_enum as SecretType } from '@prisma/client';

export * from './password';
export * from './token';
export * from './emailToken';

const logger = getLogger('Secret');

export async function getSecrets(user: User): Promise<object[]> {
    const result = await prisma.secret.findMany({
        where: {
            userId: user.userID,
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        },
        select: { createdAt: true, expiresAt: true, id: true, lastUsed: true, type: true, userId: true, description: true },
    });

    logger.info(`User(${user.userID}) retrieved ${result.length} secrets`);
    return result;
}

export async function cleanupSecrets() {
    const result = await prisma.secret.deleteMany({
        where: {
            expiresAt: { lte: new Date() },
        },
    });

    logger.info(`Cleaned up ${result.count} expired secrets`);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const unusedResult = await prisma.secret.deleteMany({
        where: {
            lastUsed: { lte: threeMonthsAgo },
            type: { in: [SecretType.TOKEN, SecretType.EMAIL_TOKEN] },
        },
    });

    logger.info(`Cleaned up ${unusedResult.count} tokens that haven't been used for three months`);

    const neverUsed = await prisma.secret.deleteMany({
        where: {
            createdAt: { lte: threeMonthsAgo },
            lastUsed: null,
            type: { in: [SecretType.TOKEN, SecretType.EMAIL_TOKEN] },
        },
    });

    logger.info(`Cleaned up ${neverUsed.count} tokens that have never been used since three months`);
}

export enum LoginOption {
    email = 'email',
    password = 'password',
    none = 'none', // in case the user cannot be logged in
}

export async function determinePreferredLoginOption(user: User): Promise<LoginOption> {
    const hasPassword =
        (await prisma.secret.count({
            where: {
                type: SecretType.PASSWORD,
                OR: [{ expiresAt: null }, { expiresAt: { lte: new Date() } }],
                userId: user.userID,
            },
        })) > 0;

    return hasPassword ? LoginOption.password : LoginOption.email;
}
