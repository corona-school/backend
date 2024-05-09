import { Push_subscription as PushSubscription } from '../../../graphql/generated';
import { getLogger } from '../../logger/logger';
import { prisma } from '../../prisma';
import { User } from '../../user';
import { RedundantError } from '../../util/error';

const logger = getLogger('Push');

// ------------ Subscription Management -------------------------
// Users can register and remove push subscriptions, to which push notifications are sent

export { PushSubscription };
export type CreatePushSubscription = Omit<PushSubscription, 'id' | 'userID'>;

export async function getPushSubscriptions(user: User) {
    return await prisma.push_subscription.findMany({
        where: {
            userID: user.userID,
            // Exclude expired subscriptions:
            OR: [{ expirationTime: { gte: new Date() } }, { expirationTime: null }],
        },
    });
}

export async function addPushSubcription(user: User, subscription: CreatePushSubscription): Promise<PushSubscription> {
    const result = await prisma.push_subscription.create({
        data: { ...subscription, userID: user.userID },
    });

    logger.info(`User(${user.userID}) added Subscription(${result.id})`, { subscription });
    return result;
}

export async function removePushSubscription(user: User, id: number) {
    const { count } = await prisma.push_subscription.deleteMany({
        where: { id, userID: user.userID },
    });

    if (!count) {
        throw new RedundantError(`Subcription(${id}) no longer exists`);
    }

    logger.info(`User(${user.userID}) deleted Subcription(${id})`);
}

export async function removeAllPushSubcriptions(user: User) {
    await prisma.push_subscription.deleteMany({
        where: { userID: user.userID },
    });

    logger.info(`Removed all Subcriptions of User(${user.userID})`);
}
