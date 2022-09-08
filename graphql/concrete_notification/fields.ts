import { Concrete_notification as ConcreteNotification, Notification } from '../generated';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';

@Resolver((of) => ConcreteNotification)
export class ExtendedFieldsConcreteNotificationResolver {
    @FieldResolver((returns) => Notification)
    @Authorized(Role.UNAUTHENTICATED)
    async notification(@Root() concreteNotification: ConcreteNotification) {
        return await prisma.notification.findUnique({ where: { id: concreteNotification.notificationID } });
    }
}
