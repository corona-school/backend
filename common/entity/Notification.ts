import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageTranslation } from './MessageTranslation';

/* This definition just exists because of the double maintenance of TypeORM and Prisma.
   For queries, use Prisma! */

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
}

export type NotificationTypeValue = typeof NotificationType[keyof typeof NotificationType];

// A Notification is actually something maintained in one or multiple external systems, e.g. a Mailjet Template
// Yet we have to store some meta information for a Notification, which we do in this model:
@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    // Template IDs per Channel
    @Column({ type: 'int', nullable: true })
    mailjetTemplateId?: number;

    @Column()
    description: string;

    // In case of emergency we might want to quickly switch of some notifications, also some might be at "draft" stage first
    @Column()
    active: boolean;

    // Sometimes we want to send an Email not to the user directly, but to another email that is in a 1 to 1 relationship to the user
    // Currently unused though, was initially planned for 'Teacher' and 'Parent' Accounts
    @Column()
    recipient: NotificationRecipient;
    // If a user triggers an action, this Notification will be sent, or if it is a reminder it gets scheduled for the future
    // If this is empty, the notification is either 'unreachable', or if a sample_context is set, it can be sent out manually
    //  by admins as a campaign
    @Column('text', { array: true })
    onActions: string[];

    // The Notification type is visually indicated to the user, also they can maintain per type whether they want to receive
    // notifications of a certain type via a certain Channel
    @Column({
        type: 'enum',
        enum: NotificationType,
        nullable: false,
        default: NotificationType.LEGACY,
    })
    type: NotificationType;

    // Reminders additionally have these attributes set:
    // If the user takes one of these actions, the reminder gets cancelled
    @Column('text', { array: true })
    cancelledOnAction: string[];
    @Column({ type: 'int', nullable: true })
    delay?: number; /* in hours */
    @Column({ type: 'int', nullable: true })
    interval?: number; /* in hours */

    // Some emails are supposed to be sent out by email addresses other than support@lern-fair.de,
    //  as users can directly respond to the team responsible
    @Column({ nullable: true, type: 'enum', enum: NotificationSender })
    sender?: NotificationSender;

    // A hook is a piece of code that is run when before the notification is sent out
    // This allows for user specific scheduling of code, which happens when the user is informed about it
    @Column({ nullable: true })
    hookID?: string;

    // A sample context containing all the variables used in the templates for this notification
    // Can be used to manually fill these fields - during campaigns - when creating concrete notifications
    // NOTE: If the sample_context is set, this is a Campaign Notification that is sent out manually,
    //       if this is not set, the notification context is the subset of all sampleContexts of all actions in onActions,
    //       as the notification is then instantiated via Notification.actionTaken
    @Column({ type: 'json', nullable: true })
    sample_context?: any;

    // A message is a title and a body sent to the user as notification,
    //  it is shown in the User-App's notification inbox and might be used for other Channels such as Web-Push or other messengers in the future
    // The messages are localized, though currently only german is maintained
    // When a Notification is instantiated to a ConcreteNotification,
    //  the message translation template can be instantiated (rendered) to a concrete message
    @OneToMany((type) => MessageTranslation, (messageTranslation) => messageTranslation.notification, {
        eager: true,
    })
    messageTranslations: MessageTranslation[];
}
