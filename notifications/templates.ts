import { Concrete_notification as ConcreteNotification } from '../graphql/generated';
import { User } from '../common/user';
import { NotificationMessage } from '../common/notification/messages';

// TODO: Migrate to common/notification/index.ts getMessage(...)
export const getMessage = (concreteNotification: ConcreteNotification, user?: User): NotificationMessage => {
    const { firstname, lastname } = user ? user : { firstname: '', lastname: '' };
    const { notificationID, context } = concreteNotification;

    const templates: { [key: number]: NotificationMessage } = {
        1: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: 'account',
        },
        2: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: 'onboarding',
        },
        3: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: 'course',
        },
        4: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: `http://www.somewhere`,
            isUrlExternal: true,
            messageType: 'appointment',
        },
        5: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            navigateTo: 'welcome',
            messageType: 'call',
        },
        6: {
            headline: `bla bla ${firstname}`,
            body: `bla bla ${firstname} bla bla ${lastname}`,
            messageType: 'advice',
        },
        29: {
            headline: `User Login Notification ${concreteNotification.id}`,
            body: `Hello ${firstname} ${lastname} template ${concreteNotification.notificationID} :)`,
            messageType: 'event',
        },
        30: {
            headline: 'Neuer Kurs online',
            body: `Kursvorschlag für dich, ${firstname}!`,
            navigateTo: 'welcome',
            messageType: 'request',
        },
        31: {
            headline: 'Noch freie Plätze im Kurs',
            body: `Sei schnell! Es sind noch Plätze frei im Kurs: ${firstname}`,
            navigateTo: 'welcome',
            messageType: 'news',
        },
    };

    if (templates.hasOwnProperty(notificationID)) {
        return templates[notificationID];
    }

    return {
        headline: `Message ${concreteNotification.id} not found`,
        body: `Error: template ${concreteNotification.notificationID} not found.`,
        messageType: 'suggestion',
        error: 'Template for notification does not exist',
    };
};
