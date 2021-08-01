import { Resolver, Mutation, Root, Arg, Authorized } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import * as Notification from "../../common/notification/notification";
import { NotificationRecipient } from "../../common/entity/Notification";

@Resolver(of => GraphQLModel.Notification)
export class MutateNotificationResolver {

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async notificationCreate(@Arg("description") description: string, @Arg("recipient") recipient: NotificationRecipient, @Arg("mailjetTemplateId") mailjetTemplateId: number, @Arg("category") category: string[], @Arg("onActions") onActions: string[], @Arg("cancelledOnAction") cancelledOnAction: string[], @Arg("delay") delay?: number, interval?: number): Promise<boolean> {
        await Notification.create({
            cancelledOnAction,
            category,
            delay,
            description,
            interval,
            mailjetTemplateId,
            onActions,
            recipient
        });

        return true;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async notificationActivate(@Arg("notificationId") notificationId: number, @Arg("active") active: boolean): Promise<boolean> {
        await Notification.activate(notificationId, active);
        return true;
    }
}