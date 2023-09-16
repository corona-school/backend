import { Role } from '../authorizations';
import { ObjectType, Field, Resolver, Query, Authorized, FieldResolver, Root, Arg } from 'type-graphql';
import { bulkRuns } from '../../common/notification/bulk';
import {
    Message_translation as MessageTranslation,
    NestedBoolFilter,
    Notification,
    message_translation_language_enum as TranslationLanguage,
} from '../generated';
import { getHookDescription } from '../../common/notification';
import { getNotificationActions, NotificationAction } from '../../common/notification/actions';
import { JSONResolver } from 'graphql-scalars';
import { prisma } from '../../common/prisma';
import { getSampleContextVariables } from '../../common/notification/notification';
@ObjectType()
class BulkRunNotificationCount {
    @Field()
    notificationID: number;
    @Field()
    count: number;
}
@ObjectType()
class BulkRun {
    @Field()
    name: string;
    @Field()
    count: number;
    @Field()
    progress: number;
    @Field()
    apply: boolean;
    @Field((type) => [BulkRunNotificationCount])
    notificationCount: BulkRunNotificationCount[];
    @Field((type) => [String])
    errors: string[];
    @Field((type) => String, { nullable: true })
    currentUser?: string;
    @Field()
    startedAt: string;
    @Field((type) => String, { nullable: true })
    finishedAt?: string;
}

@ObjectType()
class NotificationActionType implements NotificationAction {
    @Field((type) => String)
    id: string;
    @Field((type) => String)
    description: string;
    @Field((type) => JSONResolver, { nullable: true })
    sampleContext?: any;
    @Field((type) => [String], { nullable: true })
    recommendedCancelations?: string[];
}

@Resolver((of) => BulkRun)
export class NotificationBulkRunResolver {
    @Query((returns) => [BulkRun])
    @Authorized(Role.ADMIN)
    notificationBulkRuns() {
        return bulkRuns.map((it) => ({
            ...it,
            notificationCount: Object.entries(it.notificationCount).map(([notificationID, count]) => ({ notificationID: +notificationID, count })),
        }));
    }
}

@Resolver((of) => Notification)
export class NotificationExtendedFieldsResolver {
    @FieldResolver((returns) => String, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    hookDescription(@Root() notification: Notification) {
        return getHookDescription(notification.hookID);
    }

    @FieldResolver((returns) => [MessageTranslation], {
        description:
            "The message translation will be rendered in the user's language with a concrete notification context to produce the message the user sees",
    })
    @Authorized(Role.UNAUTHENTICATED)
    async messageTranslations(@Root() notification: Notification) {
        return await prisma.message_translation.findMany({
            where: { notificationId: notification.id },
        });
    }

    @Authorized(Role.USER)
    async messageTranslation(@Root() notification: Notification, @Arg('language', { defaultValue: TranslationLanguage.de }) language: TranslationLanguage) {
        return await prisma.message_translation.findMany({
            where: { notificationId: notification.id, language },
        });
    }

    @FieldResolver((returns) => [[String]], {
        description:
            "Returns an array of tuples ['nested.path', 'example value']\n" +
            'These Variables can be used inside the messages and Mailjet Templates created for this notification, like:\n' +
            " ['user.firstname', 'Jonas'] -> Mailjet: {{var:user.firstname}}, Message: {{user.firstname}}              \n" +
            'Additionally they can be set when manually sending out the concrete notification by passing in a context: \n' +
            " { user: { firstname: 'Jeff' } }",
    })
    @Authorized(Role.ADMIN)
    variables(@Root() notification: Required<Notification>) {
        return getSampleContextVariables(notification);
    }

    @Query((returns) => [NotificationActionType])
    @Authorized(Role.UNAUTHENTICATED)
    notificationActions() {
        return getNotificationActions();
    }
}
