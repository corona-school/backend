import { MessageType } from '../../notifications/messageTypes';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType('NotificationMessage')
export abstract class NotificationMessage {
    @Field((_type) => String)
    headline: string;
    @Field((_type) => String)
    body: string;
    @Field((_type) => String)
    messageType: keyof typeof MessageType;
    @Field((_type) => String, { nullable: true })
    navigateTo?: string;
    @Field((_type) => Boolean, { nullable: true })
    isUrlExternal?: boolean;
    @Field((_type) => String, { nullable: true })
    error?: string;
}
