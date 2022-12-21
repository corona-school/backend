import { MessageType } from './messageTypes';
import { Concrete_notification as ConcreteNotification } from '../graphql/generated';
import { NotificationMessage } from '../graphql/types/notificationMessage';
import { User } from '../common/user';

export const getMessage = (concreteNotification: ConcreteNotification, user?: User): NotificationMessage => {
    const { firstname, lastname } = user ? user : { firstname: '', lastname: '' };
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: NotificationMessage } = {
        1: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageType.appointment,
        },
        2: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.course,
        },
        3: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageType.chat,
        },
        4: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageType.alternativeoffer,
        },
        5: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.news,
        },
        6: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageType.survey,
        },
    };

    if (templates.hasOwnProperty(notificationID)) {
        return templates[notificationID];
    }

    return {
        headline: `Message ${concreteNotification.id} not found`,
        body: `Error: template ${concreteNotification.notificationID} not found.`,
        messageType: MessageType.match,
        error: 'Template for notification does not exist',
    };
};
