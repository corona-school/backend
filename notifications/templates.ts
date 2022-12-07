import { MessageType } from './messageTypes';
import { GraphQLUser } from '../common/user/session';
import { Concrete_notification as ConcreteNotification } from '../graphql/generated';

// only actionPath or url is optionally allowed but not both
type NotificationAction = { navigateTo?: string; url?: undefined } | { url: string; navigateTo?: undefined };
export type MessageTemplate = {
    header: string;
    body: string;
    messageType: MessageType;
    error?: string;
} & NotificationAction;

export const getMessage = (concreteNotification: ConcreteNotification, user: GraphQLUser): MessageTemplate => {
    const { firstname, lastname } = user;
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: MessageTemplate } = {
        1: {
            header: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `somepath`,
            messageType: MessageType.APPOINTMENT,
        },
        2: {
            header: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.APPOINTMENT,
        },
        3: {
            header: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageType.MATCH,
        },
    };

    if (templates.hasOwnProperty(notificationID)) {
        return templates[notificationID];
    }

    return {
        header: `Message not found`,
        body: `Error: message details not found. Message for ${firstname} ${lastname}`,
        messageType: MessageType.MATCH,
        error: 'Template for notification does not exist',
    };
};
