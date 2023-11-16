import { Concrete_notification as ConcreteNotification, Notification, message_translation_language_enum as TranslationLanguage } from '../generated';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Role } from '../authorizations';
import { JSONResolver } from 'graphql-scalars';
import { GraphQLContext } from '../context';
import { getSessionUser } from '../authentication';
import { NotificationMessageType } from '../types/notificationMessage';
import { getMessage } from '../../common/notification/messages';
import { ConcreteNotificationState } from '../../common/notification/types';

@ObjectType()
class Campaign {
    // 'Primary Key':
    @Field((type) => Int)
    notificationID: number;
    @Field((type) => String)
    contextID: string;

    @Field((type) => JSONResolver)
    context: object;

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
    @Field((type) => Int)
    archived: number;
}

@Resolver((of) => ConcreteNotification)
export class ExtendedFieldsConcreteNotificationResolver {
    @FieldResolver((returns) => Notification)
    @Authorized(Role.UNAUTHENTICATED)
    async notification(@Root() concreteNotification: ConcreteNotification) {
        return await prisma.notification.findUnique({ where: { id: concreteNotification.notificationID } });
    }

    @FieldResolver((returns) => NotificationMessageType, { nullable: true })
    @Authorized(Role.OWNER, Role.ADMIN)
    async message(
        @Root() concreteNotification: Required<ConcreteNotification>,
        @Arg('language', { defaultValue: TranslationLanguage.de }) language: TranslationLanguage
    ): Promise<NotificationMessageType | null> {
        return await getMessage(concreteNotification, language);
    }

    @Query((returns) => ConcreteNotification, { nullable: true })
    @Authorized(Role.USER)
    async concrete_notification(@Ctx() context: GraphQLContext, @Arg('concreteNotificationId', (type) => Int) concreteNotificationId: number) {
        return await prisma.concrete_notification.findFirst({ where: { id: concreteNotificationId, userId: getSessionUser(context).userID } });
    }

    @Query((returns) => [Campaign])
    @Authorized(Role.ADMIN)
    async concreteNotificationCampaign() {
        const campaignMails = await prisma.notification.findMany({
            select: { id: true },
            where: { sample_context: { not: undefined } },
        });

        const aggregated = await prisma.concrete_notification.groupBy({
            _count: true,
            by: ['notificationID', 'contextID', 'state'],
            where: { notificationID: { in: campaignMails.map((it) => it.id) } },
        });

        const byCampaign: { [key: string]: Campaign } = {};

        for (const { _count, contextID, notificationID, state } of aggregated) {
            if (!contextID) {
                continue;
            }

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
                    archived: 0,
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

                case ConcreteNotificationState.ARCHIVED:
                    byCampaign[key].archived = _count;
                    break;

                default:
                    throw new Error(`Unexpected state ${state}`);
            }
        }

        return Object.values(byCampaign);
    }
}
