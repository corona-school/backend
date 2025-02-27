import { Concrete_notification as ConcreteNotification, Notification } from '../generated';
import { Arg, Authorized, FieldResolver, Int, Mutation, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import {
    actionTakenAt,
    bulkCreateConcreteNotifications,
    cancelDraftedAndDelayed,
    cancelNotification,
    publishDrafted,
    rescheduleNotification,
    validateContext,
    validateContextForAction,
} from '../../common/notification';
import { Deprecated, getUsers } from '../util';
import { getNotification } from '../../common/notification/notification';
import { getUser } from '../../common/user';
import { GraphQLJSON, JSONResolver } from 'graphql-scalars';
import { asActionID } from '../../common/notification/actions';
import { getLogger } from '../../common/logger/logger';
import { GraphQLBoolean } from 'graphql';
import { ConcreteNotificationState } from '../../common/notification/types';

const logger = getLogger('MutateConcreteNotificationResolver');

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
        @Arg('context', (_type) => JSONResolver) context: any,
        @Arg('skipDraft', () => GraphQLBoolean) skipDraft = false,
        @Arg('startAt') startAt: Date
    ) {
        const notification = await getNotification(notificationId);
        const users = await getUsers(userIds);

        if (typeof context !== 'object' || Object.values(context).some((it) => typeof it !== 'string')) {
            throw new Error(`Context must be an object with string values`);
        }

        validateContext(notification, context);

        await bulkCreateConcreteNotifications(
            notification,
            users,
            context,
            skipDraft ? ConcreteNotificationState.DELAYED : ConcreteNotificationState.DRAFTED,
            startAt
        );

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationPublishDraft(@Arg('notificationId', (type) => Int) notificationId: number, @Arg('contextID') contextID: string) {
        const notification = await getNotification(notificationId);
        await publishDrafted(notification, contextID);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationCancelDraft(@Arg('notificationId', (type) => Int) notificationId: number, @Arg('contextID') contextID: string) {
        const notification = await getNotification(notificationId);
        await cancelDraftedAndDelayed(notification, contextID);
        return true;
    }

    @Mutation((returns) => GraphQLJSON, { nullable: true })
    @Authorized(Role.ADMIN)
    @Deprecated('TEST ONLY, DO NOT USE!')
    async _actionTakenAt(
        @Arg('action') action: string,
        @Arg('userID') userID: string,
        @Arg('context', (_type) => JSONResolver) context: any,
        @Arg('at') at: Date,
        @Arg('dryRun') dryRun: boolean,
        @Arg('noDuplicates', { nullable: true }) noDuplicates: boolean
    ) {
        const actionID = asActionID(action);
        validateContextForAction(actionID, context);

        const user = await getUser(userID);

        logger.info(`Admin triggered Action ${actionID} for User(${userID})`);
        return await actionTakenAt(at, user, actionID, context, dryRun, noDuplicates);
    }
}
