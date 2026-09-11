import { Resolver, Mutation, Root, Arg, Authorized, InputType, Field, Int } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { Role } from '../authorizations';
import * as Notification from '../../common/notification/notification';
import { NotificationCreateInput, NotificationUpdateInput, message_translation_language_enum as TranslationLanguage } from '../generated';
import { runBulkAction } from '../../common/notification/bulk';
import { setMessageTranslation } from '../../common/notification/messages';
import { MessageTemplateType } from '../types/notificationMessage';
import { Prisma } from '@prisma/client';

/* import { notification_sender_enum } from '@prisma/client';
import { JSONResolver } from 'graphql-scalars';

@InputType()
class NotificationInput {
    // Notification Model as Input type, see https://github.com/MichalLytek/type-graphql/issues/62
    @Field((_type) => Int, { nullable: false })
    id!: number;
    @Field((_type) => Int, { nullable: false })
    mailjetTemplateId: number;
    @Field((_type) => String, { nullable: false })
    description!: string;
    @Field((_type) => Boolean, { nullable: false })
    active!: boolean;
    @Field((_type) => Int, { nullable: false })
    recipient!: number;
    @Field((_type) => [String], { nullable: false })
    onActions!: string[];
    @Field((_type) => [String], { nullable: false })
    category!: string[];
    @Field((_type) => [String], { nullable: false })
    cancelledOnAction!: string[];
    @Field((_type) => Int, { nullable: true })
    delay: number | null;
    @Field((_type) => Int, { nullable: true })
    interval: number | null;
    @Field((_type) => notification_sender_enum, { nullable: true })
    sender: notification_sender_enum | null;
    @Field((_type) => String, { nullable: true })
    hookID: string | null;
    @Field((_type) => JSONResolver)
    sample_context: any;
} */

@Resolver((of) => GraphQLModel.Notification)
export class MutateNotificationResolver {
    @Mutation((returns) => GraphQLModel.Notification)
    @Authorized(Role.ADMIN)
    async notificationCreate(
        @Arg('notification', () => NotificationCreateInput) notification: Prisma.notificationCreateInput
    ): Promise<GraphQLModel.Notification> {
        if (
            notification.sample_context &&
            (typeof notification.sample_context !== 'object' || Object.values(notification.sample_context).some((it) => typeof it !== 'string'))
        ) {
            throw new Error(`Sample context must be an object with string values`);
        }

        const result = await Notification.create(notification);
        return result;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async notificationActivate(@Arg('notificationId') notificationId: number, @Arg('active') active: boolean): Promise<boolean> {
        await Notification.activate(notificationId, active);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async notificationUpdate(@Arg('notificationId') notificationId: number, @Arg('update') update: NotificationUpdateInput): Promise<boolean> {
        if ('active' in update) {
            throw new Error('Cannot change active field through update');
        }

        if (update.sample_context && (typeof update.sample_context !== 'object' || Object.values(update.sample_context).some((it) => typeof it !== 'string'))) {
            throw new Error(`Sample context must be an object with string values`);
        }

        await Notification.update(notificationId, update as any);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async notificationDelete(@Arg('notificationId', (type) => Int) notificationId: number): Promise<boolean> {
        await Notification.deleteOne(notificationId);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async notificationSetMessageTranslation(
        @Arg('notificationId') notificationId: number,
        @Arg('language', { defaultValue: TranslationLanguage.de }) language: TranslationLanguage,
        @Arg('headline') headline: string,
        @Arg('body') body: string,
        @Arg('navigateTo') navigateTo: string,
        @Arg('modalText', { nullable: true }) modalText?: string
    ) {
        const notification = await Notification.getNotification(notificationId, /* allowDeactivated */ true);
        await setMessageTranslation({ notification, language, body, headline, modalText, navigateTo });

        return true;
    }

    // NOTE: This was unmaintained for a while, double check before reenabling
    /* @Mutation((returns) => String)
    @Authorized(Role.ADMIN)
    async notificationImport(
        @Arg('notifications', (type) => [NotificationInput]) notifications: NotificationInput[],
        @Arg('overwrite', { nullable: true }) overwrite: boolean = false,
        @Arg('apply', { nullable: true }) apply: boolean = false
    ) {
        return await Notification.importNotifications(notifications, overwrite, apply);
    } */

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async notificationBulkActionRun(@Arg('id') id: string, @Arg('apply') apply: boolean) {
        await runBulkAction(id, apply);
        return true;
    }
}
