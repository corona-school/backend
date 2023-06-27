import { ObjectType, Field, InputType } from 'type-graphql';
import type { TranslationTemplate, NotificationMessage } from '../../common/notification/types';
import { NotificationType } from '../../common/entity/Notification';

@InputType('MessageTemplate')
export abstract class MessageTemplateType implements TranslationTemplate {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String, { nullable: true })
    modalText?: string;
}

@ObjectType('NotificationMessage')
export abstract class NotificationMessageType implements NotificationMessage {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String, { nullable: true })
    modalText?: string;
    @Field((_type) => String)
    type: NotificationType;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
}
