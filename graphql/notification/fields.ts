import { Role } from "../authorizations";
import { ObjectType, Field, Resolver, Query, Authorized } from "type-graphql";
import { bulkRuns } from "../../common/notification/bulk";

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
    @Field()
    notificationCount: { [id: number]: number };
    @Field()
    errors: string[];
}

@Resolver(of => BulkRun)
export class NotificationBulkRunResolver {
    @Query()
    @Authorized(Role.ADMIN)
    notificationBulkRuns() {
        return bulkRuns;
    }
}