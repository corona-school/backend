// Prisma exports lowercase types, but we want capitalized types
import { concrete_notification as ConcreteNotification, notification as Notification, student as Student, pupil as Pupil } from '.prisma/client';
import { AttachmentGroup } from '../attachments';
import { User } from '../user';
import { ActionID } from './actions';

export type NotificationID = number; // either our own or we reuse them from Mailjet. Maybe we can structure them a bit better
export type CategoryID = string; // categories as means to opt out from a certain category of mails
// An action is something the user does. One action might trigger / cancel multiple notifications
export type { ActionID } from './actions';
export type Email = `${string}@${string}.${string}`;

export { ConcreteNotification, Notification };

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
    attachments?: Attachment[];

    // The notification is sent out as part of a certain campaign,
    // This will be used by Mailjet to show statistics for all notifications with the same campaign
    // The campaign should also be set as the 'uniqueId' to properly prevent campaigns being sent to the same users multiple times
    campaign?: string;

    // ---------------------------------------------------------------

    // ATTENTION: These override attributes of the Notification in a Concrete Notification and should
    // be used with extreme care, as they might come with unintended consequences

    // For Campaigns, support sending custom Mailjet Templates / with a different Type per Campaign,
    // without having to create a new Notification for each campaign
    overrideMailjetTemplateID?: string;
    overrideType?: NotificationType;

    // Sometimes it makes sense to send to some other email than the user's
    // (i.e. when verifying an email change, or when testing mails)
    // BE CAREFUL: This might otherwise send an email with an auth token to someone else!
    overrideReceiverEmail?: Email;
    // For Achievements, the match or subcourse is needed as a relation to allocate events to a specific user achievement
    relation?: string;
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

export enum ConcreteNotificationState {
    DELAYED = 0, // the action was called but there is a delay set (it's a Reminder)
    PENDING = 1, // notification was sent, not sure if arrived
    SENT = 2, // we're pretty sure the notification arrived (no bounce, no API error)
    ERROR = 3, // the notification bounced
    ACTION_TAKEN = 4, // the user took an action which cancelled the pending reminder
    ARCHIVED = 5, // the notification was archived after some months due to privacy reasons (might contain data of other users)
    DRAFTED = 6, // the notification was drafted and is not supposed to be sent out yet (mainly during campaigns)
}

export enum NotificationRecipient {
    USER,
    TEACHER,
    PARENT,
}

export enum NotificationSender {
    SUPPORT = 'SUPPORT',
    CERTIFICATE_OF_CONDUCT = 'CERTIFICATE_OF_CONDUCT',
}

export enum NotificationType {
    CHAT = 'chat',
    SURVEY = 'survey',
    APPOINTMENT = 'appointment',
    ADVICE = 'advice',
    SUGGESTION = 'suggestion',
    ANNOUNCEMENT = 'announcement',
    CALL = 'call',
    NEWS = 'news',
    EVENT = 'event',
    REQUEST = 'request',
    ALTERNATIVE = 'alternative',
    ACCOUNT = 'account',
    ONBOARDING = 'onboarding',
    MATCH = 'match',
    COURSE = 'course',
    CERTIFICATE = 'certificate',
    LEGACY = 'legacy',
    ACHIEVEMENT = 'achievement',
}
