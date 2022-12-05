import { MessageType } from './messageTypes';

// only actionPath or url is optionally allowed but not both
type NotificationAction = { actionPath?: string; url?: undefined } | { url: string; actionPath?: undefined };
type Template = {
    header: string;
    body: string;
    messageType: MessageType;
} & NotificationAction;

type TemplateVariables = {
    [key: string]: string;
};

export const getNotification = (notificationId: number, s: TemplateVariables): Template => {
    const templates: { [key: number]: Template } = {
        1: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            actionPath: `somepath/${s.pathVar1}/${s.pathVar2}`,
            messageType: MessageType.APPOINTMENT,
        },
        2: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            actionPath: `somepath/${s.pathVar1}/${s.pathVar2}`,
            messageType: MessageType.APPOINTMENT,
        },
        3: {
            header: `bla bla ${s.firstname}`,
            body: `bla bla ${s.firstname} bla bla ${s.lastname}`,
            messageType: MessageType.MATCH,
        },
    };
    return templates[notificationId];
};
