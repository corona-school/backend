import { Concrete_notification as ConcreteNotification, Notification } from '../generated';
import { Arg, Authorized, FieldResolver, Int, Mutation, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { ConcreteNotificationState } from '../../common/entity/ConcreteNotification';
import {
    bulkCreateNotifications,
    cancelDrafted,
    cancelNotification,
    publishDrafted,
    rescheduleNotification,
    sendNotification,
    validateContext,
} from '../../common/notification';
import { getUsers } from '../util';
import { getNotification } from '../../common/notification/notification';
import { getUser } from '../../common/user';

@Resolver((of) => ConcreteNotification)
export class MutateConcreteNotificationsResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationCancel(@Arg('id') id: number) {
        const notification = await prisma.concrete_notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new Error(`ConcreteNotification(${id}) not found`);
        }

        await cancelNotification(notification);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationReschedule(@Arg('id') id: number, @Arg('sendAt') sendAt: Date) {
        const notification = await prisma.concrete_notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new Error(`ConcreteNotification(${id}) not found`);
        }

        await rescheduleNotification(notification, sendAt);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationBulkCreate(
        @Arg('notificationId', (type) => Int) notificationId: number,
        @Arg('userIds', (_type) => [String]) userIds: string[],
        @Arg('context') context: string,
        @Arg('skip_draft') skipDraft: boolean = false
    ) {
        const notification = await getNotification(notificationId);
        const users = await getUsers(userIds);

        const parsedContext = JSON.parse(context);
        validateContext(notification, parsedContext);

        await bulkCreateNotifications(notification, users, parsedContext, skipDraft ? ConcreteNotificationState.DELAYED : ConcreteNotificationState.DRAFTED);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationPublishDraft(@Arg('notificationId', (type) => Int) notificationId: number) {
        const notification = await getNotification(notificationId);
        await publishDrafted(notification);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationCancelDraft(@Arg('notificationId', (type) => Int) notificationId: number) {
        const notification = await getNotification(notificationId);
        await cancelDrafted(notification);
        return true;
    }
}
