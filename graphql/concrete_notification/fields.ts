import { Concrete_notification as ConcreteNotification, Notification } from '../generated';
import { Authorized, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { JSONResolver } from 'graphql-scalars';
import { ConcreteNotificationState } from '../../common/entity/ConcreteNotification';

@ObjectType()
class Campaign {
    // 'Primary Key':
    @Field((type) => Int)
    notificationID: number;
    @Field((type) => String)
    contextID: string;

    @Field((type) => JSONResolver)
    context: {};

    @Field((type) => Int)
    drafted: number;
    @Field((type) => Int)
    scheduled: number;
    @Field((type) => Int)
    sent: number;
    @Field((type) => Int)
    error: number;
    @Field((type) => Int)
    canceled: number;
}

@Resolver((of) => ConcreteNotification)
export class ExtendedFieldsConcreteNotificationResolver {
    @FieldResolver((returns) => Notification)
    @Authorized(Role.UNAUTHENTICATED)
    async notification(@Root() concreteNotification: ConcreteNotification) {
        return await prisma.notification.findUnique({ where: { id: concreteNotification.notificationID } });
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER, Role.ADMIN)
    async headline(@Root() concreteNotification: ConcreteNotification) {
        return `Mock Headline ${concreteNotification.id}`;
    }

    @Query((returns) => [Campaign])
    @Authorized(Role.ADMIN)
    async concreteNotificationCampaign() {
        const campaignMails = await prisma.notification.findMany({
            select: { id: true },
            where: { category: { has: 'campaign' } },
        });

        const aggregated = await prisma.concrete_notification.groupBy({
            _count: true,
            by: ['notificationID', 'contextID', 'state'],
            where: { notificationID: { in: campaignMails.map((it) => it.id) } },
        });

        const byCampaign: { [key: string]: Campaign } = {};

        for (const { _count, contextID, notificationID, state } of aggregated) {
            const key = notificationID + '/' + contextID;
            if (!byCampaign[key]) {
                const context = await prisma.concrete_notification.findFirst({
                    select: { context: true },
                    where: { notificationID, contextID },
                });

                byCampaign[key] = {
                    context,
                    notificationID,
                    contextID,
                    drafted: 0,
                    error: 0,
                    scheduled: 0,
                    sent: 0,
                    canceled: 0,
                };
            }

            switch (state) {
                case ConcreteNotificationState.DELAYED:
                    byCampaign[key].scheduled = _count;
                    break;
                case ConcreteNotificationState.DRAFTED:
                    byCampaign[key].drafted = _count;
                    break;
                case ConcreteNotificationState.ERROR:
                    byCampaign[key].error = _count;
                    break;

                case ConcreteNotificationState.SENT:
                    byCampaign[key].sent = _count;
                    break;

                case ConcreteNotificationState.ACTION_TAKEN:
                    byCampaign[key].canceled = _count;
                    break;

                default:
                    throw new Error(`Unexpected state ${state}`);
            }
        }

        return Object.values(byCampaign);
    }
}
