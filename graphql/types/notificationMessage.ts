import { ObjectType, Field, InputType } from 'type-graphql';
import type { MessageTemplate, NotificationMessage } from '../../common/notification/messages';

@InputType('MessageTemplate')
export abstract class MessageTemplateType implements MessageTemplate {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
}

@ObjectType('NotificationMessage')
export abstract class NotificationMessageType extends MessageTemplateType implements NotificationMessage {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String)
    messageType: string;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
}
