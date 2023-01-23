import { MessageTemplateType, NotificationMessageType } from '../types/notificationMessage';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Message_translation as MessageTranslation } from '../generated';
import { getNotification, getSampleContext } from '../../common/notification/notification';
import { renderTemplate } from '../../utils/helpers';
import { Role } from '../roles';

@Resolver((of) => MessageTranslation)
export class ExtendedFieldsMessageTranslationResolver {
    @FieldResolver((returns) => NotificationMessageType)
    @Authorized(Role.ADMIN)
    async sampleMessage(@Root() messageTranslation: MessageTranslation): Promise<NotificationMessageType> {
        const notification = await getNotification(messageTranslation.notificationId);
        const sampleContext = await getSampleContext(notification);
        return {
            body: renderTemplate((messageTranslation.template as any).body, sampleContext),
            headline: renderTemplate((messageTranslation.template as any).headline, sampleContext),
            type: notification.type as any,
            navigateTo: messageTranslation.navigateTo,
        };
    }
}
