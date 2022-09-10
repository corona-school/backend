import { User } from '../user';
import { secret as Secret } from '@prisma/client';
import { prisma } from '../prisma';
import { getLogger } from 'log4js';
import { SecretType } from '../entity/Secret';

export * from './password';
export * from './token';

const logger = getLogger('Secret');

export async function getSecrets(user: User): Promise<{}[]> {
    const result = await prisma.secret.findMany({
        where: {
            userId: user.userID,
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        },
        select: { createdAt: true, expiresAt: true, id: true, lastUsed: true, type: true, userId: true },
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
