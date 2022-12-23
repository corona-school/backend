import { MessageType } from './messageTypes';
import { GraphQLUser } from '../common/user/session';
import { Concrete_notification as ConcreteNotification } from '../graphql/generated';
import { NotificationMessage } from '../graphql/types/notificationMessage';

export const getMessage = (concreteNotification: ConcreteNotification, user: GraphQLUser): NotificationMessage => {
    const { firstname, lastname } = user;
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: NotificationMessage } = {
        1: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageType.APPOINTMENT,
        },
        2: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.COURSE,
        },
        3: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageType.MESSAGE,
        },
        4: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageType.CHAT,
        },
        5: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.NEWS,
        },
        6: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageType.SURVEY,
        },
        30: {
            headline: 'Neuer Kurs online',
            body: `Kursvorschlag für dich, ${firstname}!`,
            navigateTo: 'welcome',
            messageType: MessageType.NEWS,
        },
        31: {
            headline: 'Noch freie Plätze im Kurs',
            body: `Sei schnell! Es sind noch Plätze frei im Kurs: ${firstname}`,
            navigateTo: 'welcome',
            messageType: MessageType.NEWS,
        },
    };

    if (templates.hasOwnProperty(notificationID)) {
        return templates[notificationID];
    }

    return {
        headline: `Message not found`,
        body: `Error: message details not found. Message for ${firstname} ${lastname}`,
        messageType: MessageType.MATCH,
        error: 'Template for notification does not exist',
    };
};
