import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* This definition just exists because of the double maintenance of TypeORM and Prisma.
   For queries, use Prisma! */

// From each notification, a concrete notification might be sent multiple times to the user
// The concrete notification tracks the current progress
@Entity()
export class ConcreteNotification {
    // non-natural primary key
    @PrimaryGeneratedColumn()
    id: number;

    // total disjoint relationship to user
    @Column()
    userId: string;

    @Column()
    notificationID: number;

    // Sometimes an action gets taken multiple times, and we want to prevent the email from being sent multiple times
    // For that we generate a unique contextID out of the context (e.g. for a course email the course name)
    // with which we can find duplicates
    @Column({ nullable: true })
    contextID?: string;

    // For DRAFT, DELAYED and PENDING notifications we also store the context, to be able to resend
    // notifications in the future
    @Column({ type: 'json' })
    context: any;

    @Column({ nullable: true })
    attachmentGroupId: string;

    // sentAt a.k.a. "sendAt" conveys the following meaning depending on the state:
    // DELAYED - the time at which the notification is supposed to be sent
    // PENDING - the time at which the notification was supposed to be sent out
    // SENT    - the time at which the notification was actually sent
    // ERROR   - the time at which the error was reported back from the channel
    // ACTION_TAKEN - the time at which the action was taken by the user
    @Column({ type: 'timestamp' })
    sentAt: Date;

    @Column()
    state: ConcreteNotificationState;

    // If the notification failed, we might retrieve some information on what went wrong
    @Column({ nullable: true })
    error?: string;
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
