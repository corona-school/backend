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
    @Column()
    recipient: NotificationRecipient;
    // If a user triggers an action, this Notification will be sent, or if it is a reminder it gets scheduled for the future
    @Column('text', { array: true })
    onActions: string[];
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
    // Can be used to manually fill these fields (i.e. during campaigns) when creating concrete notifications
    // Can also be used to test notifications
    // In the future, this could also be used to validate actionTaken(...) calls against all notifications triggered
    @Column({ type: 'json', nullable: true })
    sample_context?: any;

    @OneToMany((type) => MessageTranslation, (messageTranslation) => messageTranslation.notification, {
        eager: true,
    })
    messageTranslations: MessageTranslation[];
}
