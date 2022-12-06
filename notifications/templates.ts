import { MessageType } from './messageTypes';

// only actionPath or url is optionally allowed but not both
type NotificationAction = { navigateTo?: string; url?: undefined } | { url: string; navigateTo?: undefined };
export type MessageTemplate = {
    header: string;
    body: string;
    messageType: MessageType;
} & NotificationAction;

type TemplateVariables = {
    [key: string]: string;
};

export const getMessage = (notificationId: number, s: TemplateVariables): MessageTemplate => {
    const templates: { [key: number]: MessageTemplate } = {
        1: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            navigateTo: `somepath/${s.pathVar1}/${s.pathVar2}`,
            messageType: MessageType.APPOINTMENT,
        },
        2: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            navigateTo: 'welcome',
            messageType: MessageType.APPOINTMENT,
        },
        3: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            messageType: MessageType.MATCH,
        },
        // 0 used as fallback
        0: {
            header: `Message not found`,
            body: `Error: message details not found. Message for ${s.firstname} ${s.lastname}`,
            messageType: MessageType.MATCH,
            navigateTo: 'welcome',
        },
    };
    const key = templates.hasOwnProperty(notificationId) ? notificationId : 0;
    return templates[key];
};
