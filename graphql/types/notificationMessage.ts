import { ObjectType, Field, InputType } from 'type-graphql';
import type { MessageTemplate } from '../../common/notification/messages';
import type { NotificationMessage } from '../../common/notification/messages';

@ObjectType('NotificationMessage')
export abstract class NotificationMessageType implements NotificationMessage {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String)
    messageType: string;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
    @Field((_type) => Boolean, { nullable: true })
    isUrlExternal?: boolean;
    @Field((_type) => String, { nullable: true })
    error?: string;
}

@InputType('MessageTemplate')
export abstract class MessageTemplateType implements MessageTemplate {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
}
