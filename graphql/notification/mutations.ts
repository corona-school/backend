import { Resolver, Mutation, Root, Arg, Authorized, InputType, Field, Int } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import * as Notification from "../../common/notification/notification";
import { NotificationCreateInput, NotificationUpdateInput } from "../generated";

@InputType()
class NotificationInput extends NotificationCreateInput {
    @Field(type => Int)
    id: number;
}
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

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async notificationUpdate(@Arg("notificationId") notificationId: number, @Arg("update") update: NotificationUpdateInput): Promise<boolean> {
        if ("active" in update) {
            throw new Error("Cannot change active field through update");
        }

        await Notification.update(notificationId, update as any);
        return true;
    }

    @Mutation(returns => String)
    @Authorized(Role.ADMIN)
    async notificationImport(@Arg("notifications", type => [NotificationInput]) notifications: NotificationInput[], @Arg("force", { nullable: true }) force: boolean = false) {
        for (const notification of notifications) {
            if (!notification.mailjetTemplateId) {
                throw new Error("Mailjet Template ID is required");
            }
        }

        return await Notification.importNotifications(notifications as any, force);
    }
}