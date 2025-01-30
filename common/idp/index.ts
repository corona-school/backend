import { getLogger } from 'log4js';
import { prisma } from '../prisma';

const logger = getLogger('IDP');

interface CreateIDPLoginArgs {
    userId: string;
    clientId: string;
}

export const createIDPLogin = async ({ userId, clientId }: CreateIDPLoginArgs) => {
    const result = await prisma.user_idp_login.create({
        data: {
            userId,
            clientId,
        },
    });

    logger.info(`User(${userId}) created IDPLogin`);

    return result;
};
