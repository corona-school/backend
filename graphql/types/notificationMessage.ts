import { MessageType } from '../../notifications/messageTypes';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export abstract class NotificationMessage {
    headline: string;
    body: string;
    messageType: MessageType;
    navigateTo?: string;
    isUrlExternal?: boolean;
    error?: string;
}
