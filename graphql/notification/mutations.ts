import { Resolver, Mutation, Root, Arg, Authorized, InputType, Field, Int } from "type-graphql";
import * as GraphQLModel from "../generated/models";
import { Role } from "../authorizations";
import * as Notification from "../../common/notification/notification";
import { NotificationCreateInput, NotificationUpdateInput } from "../generated";

@InputType()
class NotificationInput { // Notification Model as Input type, see https://github.com/MichalLytek/type-graphql/issues/62
  @Field(_type => Int, { nullable: false })
  id!: number;
  @Field(_type => Int, { nullable: false })
  mailjetTemplateId?: number;
  @Field(_type => String, { nullable: false })
  description!: string;
  @Field(_type => Boolean, { nullable: false })
  active!: boolean;
  @Field(_type => Int, { nullable: false })
  recipient!: number;
  @Field(_type => [String], { nullable: false })
  onActions!: string[];
  @Field(_type => [String], { nullable: false })
  category!: string[];
  @Field(_type => [String], { nullable: false })
  cancelledOnAction!: string[];
  @Field(_type => Int, { nullable: true })
  delay?: number | null;
  @Field(_type => Int, { nullable: true })
  interval?: number | null;
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
        return await Notification.importNotifications(notifications, force);
    }
}