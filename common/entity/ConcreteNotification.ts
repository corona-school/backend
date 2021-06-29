import {Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

/* This definition just exists because of the double maintenance of TypeORM and Prisma.
   For queries, use Prisma! */

// From each notification, a concrete notification might be sent multiple times to the user
// The concrete notification tracks the current progress
class ConcreteNotification {
    // non-natural primary key
    @PrimaryGeneratedColumn()
    id: number;

    // total disjoint relationship to user
    @Column()
    userId: string;

    @Column()
    notificationID: string;

    // Sometimes an action gets taken multiple times, and we want to prevent the email from being sent multiple times
    // For that we generate a unique contextID out of the context (e.g. for a course email the course name)
    // with which we can find duplicates
    @Column()
    contextID: string;

    // For DELAYED and PENDING notifications we also store the context, to be able to resend
    // notifications in the future
    @Column({ type: "json" })
    context: any;

    // sentAt a.k.a. "sendAt" conveys the following meaning depending on the state:
    // DELAYED - the time at which the notification is supposed to be sent
    // PENDING - the time at which the notification was supposed to be sent out
    // SENT    - the time at which the notification was actually sent
    // ERROR   - the time at which the error was reported back from the channel
    // ACTION_TAKEN - the time at which the action was taken by the user
    @Column({ type: "datetime" })
    sentAt: Date;

    @Column()
    state: ConcreteNotificationState;

    // If the notification failed, we might retrieve some information on what went wrong
    @Column({ nullable: true })
    error?: string;
}

  enum ConcreteNotificationState {
    DELAYED, // the action was called but there is a delay set (it's a Reminder)
    PENDING, // notification was sent, not sure if arrived
    SENT, // we're pretty sure the notification arrived (no bounce, no API error)
    ERROR, // the notification bounced (TODO: and now?)
    ACTION_TAKEN, // the user took an action which cancelled the pending reminder
    REMINDER_SENT // a reminder was sent, as such a new SentNotification exists which can be used to trigger recurring reminders
  }