import { Concrete_notification as ConcreteNotification, Notification } from "../generated";
import { Arg, Authorized, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";
import { ConcreteNotificationState } from "../../common/entity/ConcreteNotification";
import { cancelNotification } from "../../common/notification";

@Resolver(of => ConcreteNotification)
export class MutateConcreteNotificationsResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    async concreteNotificationCancel(@Arg("id") id: number) {
        const notification = await prisma.concrete_notification.findUnique({
            where: { id }
        });
        if (!notification) {
            throw new Error(`ConcreteNotification(${id}) not found`);
        }

        await cancelNotification(notification);
        return true;
    }
}