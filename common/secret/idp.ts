import { prisma } from '../prisma';
import { secret_type_enum as SecretType } from '@prisma/client';
import { getLogger } from '../logger/logger';

const logger = getLogger('IDP');

export const createIDPLogin = async (userId: string, sub: string, clientId: string) => {
    const result = await prisma.secret.create({
        data: {
            type: SecretType.IDP,
            userId,
            secret: sub,
            idpClientId: clientId,
        },
    });

    logger.info(`User(${userId}) created IDPLogin`);

    return result;
};

export const userHasIDPLogin = async (userId: string, sub: string, clientId: string) => {
    const result = await prisma.secret.count({ where: { type: SecretType.IDP, userId, idpClientId: clientId, secret: sub } });
    return result > 0;
};

export const getUserIdFromIDPLogin = async (sub: string, clientId: string) => {
    const result = await prisma.secret.findFirst({ where: { type: SecretType.IDP, idpClientId: clientId, secret: sub } });
    if (!result?.userId) {
        throw new Error(`Unknown User(${sub})`);
    }
    return result.userId;
};

export const isSSOUser = async (userId: string) => {
    const result = await prisma.secret.count({ where: { type: SecretType.IDP, userId } });
    return result > 0;
};
