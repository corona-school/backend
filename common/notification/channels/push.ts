import assert from 'assert';
import { Push_subscription as PushSubscription } from '../../../graphql/generated';
import { AttachmentGroup } from '../../attachments';
import { getLogger } from '../../logger/logger';
import { prisma } from '../../prisma';
import { User } from '../../user';
import { RedundantError } from '../../util/error';
import { Channel, Context, Notification } from '../types';
import WebPush from 'web-push';

const logger = getLogger('Push');

// Feature toggle for push notifications:
const enabled = process.env.WEBPUSH_ENABLED;

// The public key used by the push service to authenticate messages sent by us
export const publicKey = process.env.WEBPUSH_PUBLIC_KEY;

if (enabled) {
    // KEEP THIS PRIVATE!
    const privateKey = process.env.WEBPUSH_PRIVATE_KEY;

    WebPush.setVapidDetails(
        // Contact information in case a Web Push Provider wants to get back to us:
        'mailto:backend@lern-fair.de',
        // The key pair we sign push notifications with (to prove it is us):
        publicKey,
        privateKey
    );

    logger.info(`Enabled WebPush`);
}

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
    const existing = await prisma.push_subscription.findFirst({
        where: { userID: user.userID, endpoint: subscription.endpoint },
    });

    if (existing) {
        logger.info(`User(${user.userID}) added existing subscription`, { subscription, existing });
        return existing;
    }

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

// ------------ Push Channel -------------------------
export const webpushChannel: Channel = {
    type: 'push',

    async canSend(notification: Notification, user: User) {
        if (!enabled) {
            return false;
        }

        const subscriptions = await getPushSubscriptions(user);
        const canSend = subscriptions.length > 0;
        logger.debug(`Can send Notification(${notification.id}) to User(${user.userID}) - ${canSend}`);
        return canSend;
    },

    async send(notification: Notification, to: User, context: Context, concreteID: number, attachments?: AttachmentGroup) {
        assert(enabled);

        const subscriptions = await getPushSubscriptions(to);

        for (const subscription of subscriptions) {
            logger.info(`Sending ConcreteNotification(${concreteID}) to Subscription(${subscription.id}) of User(${to.userID})`);
            const result = await WebPush.sendNotification(
                { endpoint: subscription.endpoint, keys: subscription.keys as any },
                JSON.stringify({
                    // As we use the keys of the client to encrypt the message, we could potentially include
                    // more details here, as only the user's device will be able to read it
                    // For now the concrete notification id should be enough, the client can then fetch further data
                    concreteNotificationId: concreteID,
                })
            );

            logger.info(`Sent ConcreteNotification(${concreteID}) to Subscription(${subscription.id}) of User(${to.userID})`, {
                result,
            });
        }
    },
};
