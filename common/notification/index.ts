import { Person } from '../entity/Person';
import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, Notification, ConcreteNotification, ConcreteNotificationState } from './types';
import { prisma } from '../prisma';
import { debug, info, warn } from 'console';
import { getNotification, getNotifications } from './notification';
import { getUserId, getUser } from '../user';

// This is the main extension point of notifications: Implement the Channel interface, then add the channel here
const channels = [mailjetChannel];

/* -------------------------------- Public API exposed to other components ----------------------------------------------------------- */

/* sends one specific notification with a very specific notification context to the user.
   Using this directly is an intermediate solution, prefer actions ("actionTaken") instead */
export async function sendNotification(id: NotificationID, user: Person, notificationContext: NotificationContext): Promise<void> {
    const notification = await getNotification(id);

    const { authToken, ...userData } = user;
    const context: Context = {
        ...notificationContext,
        user: { ...userData, fullName: user.fullName() }
    };

    // We allow duplicates here, as the caller of sendNotification is supposed to make sure that this method is only called once for the user
    const concreteNotification = await createConcreteNotification(notification, user, context, /* allowDuplicates: */ true);

    await deliverNotification(concreteNotification, notification, user, context);
}


/* Triggers all notification sending, scheduling and unscheduling of the emails for a certain action
   Call actionTaken whenever some user action gets performed where in the future, a notification might be useful
   If 'allowDuplicates' is set, the same action may be sent multiple times by the same user
*/
export async function actionTaken(user: Person, actionId: string, notificationContext: NotificationContext, allowDuplicates = false) {
    // TODO: Error handling and fire and forget

    const { authToken, ...userData } = user;
    const context = { ...notificationContext, user: { ...userData, fullName: user.fullName() } };

    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        return;
    }


    // prevent sending of now unnecessary notifications
    await prisma.concrete_notification.updateMany({
        data: {
            state: ConcreteNotificationState.ACTION_TAKEN,
            sentAt: new Date()
        },
        where: {
            notificationID: {
                in: relevantNotifications.toCancel.map(it => it.id)
            },
            state: ConcreteNotificationState.DELAYED,
            userId: getUserId(user)
        }
    });

    const reminders = relevantNotifications.toSend.filter(it => it.delay);
    const directSends = relevantNotifications.toSend.filter(it => !it.delay);

    // Trigger notifications that are supposed to be directly sent on this action
    for (const directSend of directSends) {
        const concreteNotification = await createConcreteNotification(directSend, user, context, allowDuplicates);
        await deliverNotification(concreteNotification, directSend, user, context);
    }

    // Insert reminders into concrete_notification table so that a cron job can deliver them in the future
    if (reminders.length) {
        await prisma.concrete_notification.createMany({
            data: reminders.map(it => ({
                notificationID: it.id,
                state: ConcreteNotificationState.DELAYED,
                sentAt: new Date(Date.now() + it.delay),
                userId: getUserId(user),
                contextID: notificationContext.uniqueId,
                context: notificationContext
            }))
        });
    }
}


export async function checkReminders() {
    // TODO: Error handling

    debug(`Checking for pending notification reminders`);
    const start = Date.now();

    const remindersToSend = await prisma.concrete_notification.findMany({
        where: {
            state: ConcreteNotificationState.DELAYED,
            sentAt: { lte: new Date }
        }
    });

    for (const reminder of remindersToSend) {
        if (!reminder.context) {
            throw new Error(`Notification(${reminder.id}) was supposed to contain a context when sending out reminders`);
        }

        const notification = await getNotification(reminder.notificationID);
        const user = await getUser(reminder.userId);
        await deliverNotification(reminder, notification, user, reminder.context as Context);

        // TODO: What about intervals?
    }

    info(`Sent ${remindersToSend.length} reminders in ${Date.now() - start}ms`);

}

// TODO: function for user preferences "categories"
// TODO: Check queue state, find pending emails and ones with errors, report to Admins, resend / cleanup utilities

/* --------------------------- Concrete Notification "Queue" ----------------------------------- */

/* Creates an entry in the concrete_notifications table, to track the notification */
async function createConcreteNotification(notification: Notification, user: Person, context: Context, allowDuplicates: boolean): Promise<ConcreteNotification> {
    if (!allowDuplicates) {
        const existingNotification = await prisma.concrete_notification.findFirst({
            where: {
                notificationID: notification.id,
                userId: getUserId(user),
                contextID: context.uniqueId
            }
        });

        if (existingNotification) {
            throw new Error(`Duplicate Notification(${notification.id}) for User(${user.id}) with Context(${context.uniqueId})`);
        }
    }

    // First of all we commit the notification to the database, which allows us to recover if the backend crashes
    const concreteNotification = await prisma.concrete_notification.create({
        data: {
            // the unique id is automatically created by the database
            notificationID: notification.id,
            state: ConcreteNotificationState.PENDING,
            userId: getUserId(user),
            sentAt: new Date(),
            contextID: context.uniqueId,
            context
        }
    });

    return concreteNotification;
}

async function deliverNotification(concreteNotification: ConcreteNotification, notification: Notification, user: Person, context: Context): Promise<void> {
    debug(`Sending ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`);

    try {
        const channel = channels.find(it => it.canSend(notification.id));
        if (!channel) {
            throw new Error(`No fitting channel found for Notification(${notification.id})`);
        }

        // TODO: Check if user silenced this notification

        await channel.send(notification.id, context);
        await prisma.concrete_notification.update({
            data: {
                state: ConcreteNotificationState.SENT,
                sentAt: new Date(),
                // drop the context, as it is irrelevant from now on, and only eats up memory
                context: null
            },
            where: {
                id: concreteNotification.id
            }
        });

        info(`Succesfully sent ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`);

    } catch (error) {
        warn(`Failed to send ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`, error);

        await prisma.concrete_notification.update({
            data: {
                sentAt: new Date(),
                state: ConcreteNotificationState.ERROR,
                error: error.message
            },
            where: {
                id: concreteNotification.id
            }
        });

        // TODO: What about e.g. hard bouncing emails?
        // TODO: Check if user has lot of errors, disable account?
    }
}

