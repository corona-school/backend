import { getLogger } from 'log4js';
import { prisma } from '../prisma';

const logger = getLogger('IDP');

export const createIDPLogin = async (userId: string, clientId: string) => {
    const result = await prisma.user_idp_login.create({
        data: {
            userId,
            clientId,
        },
    });

    logger.info(`User(${userId}) created IDPLogin`);

    return result;
};

export const userHasIDPLogin = async (userId: string, clientId: string) => {
    const result = await prisma.user_idp_login.count({ where: { userId, clientId } });
    return result > 0;
};
