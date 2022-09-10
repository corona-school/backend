import { Role } from '../authorizations';
import { ObjectType, Field, Resolver, Query, Authorized, FieldResolver, Root } from 'type-graphql';
import { bulkRuns } from '../../common/notification/bulk';
import { Notification } from '../generated';
import { getHookDescription } from '../../common/notification';

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
}
