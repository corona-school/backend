import { MessageCategories } from './messageCategories';
import { Concrete_notification as ConcreteNotification } from '../graphql/generated';
import { NotificationMessage } from '../graphql/types/notificationMessage';
import { User } from '../common/user';

// TODO: rename messageType to messageCategory (requires changes in frontend)

export const getMessage = (concreteNotification: ConcreteNotification, user?: User): NotificationMessage => {
    const { firstname, lastname } = user ? user : { firstname: '', lastname: '' };
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: NotificationMessage } = {
        1: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageCategories.appointment,
        },
        2: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageCategories.course,
        },
        3: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageCategories.chat,
        },
        4: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: MessageCategories.alternativeoffer,
        },
        5: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: MessageCategories.news,
        },
        6: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: MessageCategories.survey,
        },
        29: {
            headline: `User Login Notification ${concreteNotification.id}`,
            body: `Hello ${firstname} ${lastname} template ${concreteNotification.notificationID} :)`,
            messageType: MessageCategories.match,
        },
        30: {
            headline: 'Neuer Kurs online',
            body: `Kursvorschlag für dich, ${firstname}!`,
            navigateTo: 'welcome',
            messageType: MessageCategories.news,
        },
        31: {
            headline: 'Noch freie Plätze im Kurs',
            body: `Sei schnell! Es sind noch Plätze frei im Kurs: ${firstname}`,
            navigateTo: 'welcome',
            messageType: MessageCategories.news,
        },
    };

    if (templates.hasOwnProperty(notificationID)) {
        return templates[notificationID];
    }

    return {
        headline: `Message ${concreteNotification.id} not found`,
        body: `Error: template ${concreteNotification.notificationID} not found.`,
        messageType: MessageCategories.match,
        error: 'Template for notification does not exist',
    };
};
