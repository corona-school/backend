import { getLogger } from '../../logger/logger';
import { prisma } from '../../prisma';
import { User } from '../../user';

const logger = getLogger('Push');

export async function removeAllSubcriptions(user: User) {
    await prisma.push_subscription.deleteMany({
        where: { userID: user.userID },
    });

    logger.info(`Removed all Subcriptions of User(${user.userID})`);
}
