import { MessageType } from './messageTypes';
import { GraphQLUser } from '../common/user/session';
import { Concrete_notification as ConcreteNotification } from '../graphql/generated';

// using abstract class instead of interface to be used in @FieldResolver which does not allow TS types or interfaces for return type
export abstract class NotificationMessage {
    header: string;
    body: string;
    messageType: MessageType;
    navigateTo?: string;
    isUrlExternal?: boolean;
    error?: string;
}

export const getMessage = (concreteNotification: ConcreteNotification, user: GraphQLUser): NotificationMessage => {
    const { firstname, lastname } = user;
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: NotificationMessage } = {
        1: {
            header: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
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
