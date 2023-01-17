import { ObjectType, Field, InputType } from 'type-graphql';
import type { TranslationTemplate, NotificationMessage } from '../../common/notification/types';
import { NotificationTypeValue } from '../../common/entity/Notification';

@InputType('MessageTemplate')
export abstract class MessageTemplateType implements TranslationTemplate {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
}

@ObjectType('NotificationMessage')
export abstract class NotificationMessageType extends MessageTemplateType implements NotificationMessage {
    @Field((_type) => String)
    type: NotificationTypeValue;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
}
