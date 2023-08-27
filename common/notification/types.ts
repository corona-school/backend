// Prisma exports lowercase types, but we want capitalized types
import { concrete_notification as ConcreteNotification, notification as Notification, student as Student, pupil as Pupil } from '.prisma/client';
import { AttachmentGroup } from '../attachments';
import { User } from '../user';
import { NotificationType } from '../entity/Notification';
import { ActionID } from './actions';

export type NotificationID = number; // either our own or we reuse them from Mailjet. Maybe we can structure them a bit better
export type CategoryID = string; // categories as means to opt out from a certain category of mails
// An action is something the user does. One action might trigger / cancel multiple notifications
export type { ActionID } from './actions';
export type Email = `${string}@${string}.${string}`;

export { ConcreteNotification, Notification };

export { ConcreteNotificationState } from '../entity/ConcreteNotification';

interface Attachment {
    Filename: string;
    ContentType: 'image/png' | 'image/jpg' | 'application/pdf' | string; // MIME Type, see https://www.iana.org/assignments/media-types/media-types.xhtml
    Base64Content: string;
}

// Previously the templates had a lot of repeating fields, such as "userFirstName"
// by generalizing into a context that is partially available for each Notification, this was cleaned up
export interface NotificationContextExtensions {
    uniqueId?: string; // if present, the same context (by uniqueId) will not be sent to the same user twice
    student?: Student; // set if the pupil is notified, and a certain student is relevant, this property is set
    pupil?: Pupil; // if the pupil is notified and a certain student is somehow relevant, this property is set
    replyToAddress?: Email;
    // Sometimes it makes sense to send to some other email than the user's
    // (i.e. when verifying an email change, or when testing mails)
    overrideReceiverEmail?: Email;
    attachments?: Attachment[];
    // The notification is sent out as part of a certain campaign,
    // This will be used by Mailjet to show statistics for all notifications with the same campaign
    campaign?: string;
}

export interface NotificationContext extends NotificationContextExtensions {
    // As it is not quite useful to maintain the variable shape in the backend as a missmatch with the Mailjet template won't be detected anyways,
    // further props can be set at will
    [key: string]: any;
}

// The user is always known, also for notifications sent by Actions / Reminders
// The authToken is passed as a separate variable, as authentication might change in the future
export interface Context extends NotificationContext {
    user: User & { fullName: string };
    USER_APP_DOMAIN: string;
}

// Abstract away from the core: Channels are our Ports to external notification systems (Mailjet, SMS, ...)
export interface Channel {
    type: 'email' | 'inapp';
    send(notification: Notification, to: User, context: Context, concreteID: number, attachments?: AttachmentGroup): Promise<any>;
    canSend(notification: Notification, user: User): boolean;
}

export interface BulkAction<Entity> {
    name: string;
    action: ActionID;
    getData: () => Promise<Entity[]>;
    getUser: (entity: Entity) => Promise<User>;
    getContext: (entity: Entity) => Promise<NotificationContext>;
    getActionDate: (entity: Entity) => Date;
}

type Template = string;

export interface TranslationTemplate {
    headline: Template;
    body: Template;
    modalText?: Template;
}

export interface NotificationMessage extends TranslationTemplate {
    type: NotificationType;
    navigateTo?: string;
}
