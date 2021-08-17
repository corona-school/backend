import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import * as Notification from "../../common/notification/notification";
import { NotificationCreateInput } from "../generated";

@Resolver(of => GraphQLModel.Notification)
export class MutateNotificationResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async notificationCreate(@Arg("notification") notification: NotificationCreateInput): Promise<boolean> {
        await Notification.create(notification);
        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async notificationActivate(@Arg("notificationId") notificationId: number, @Arg("active") active: boolean): Promise<boolean> {
        await Notification.activate(notificationId, active);
        return true;
    }
}