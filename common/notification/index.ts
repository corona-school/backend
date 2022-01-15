import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, Notification, ConcreteNotification, ConcreteNotificationState, Person, BulkAction } from './types';
import { prisma } from '../prisma';
import { getNotification, getNotifications } from './notification';
import { getUserId, getUser, getFullName } from '../user';
import { getLogger } from 'log4js';
import { assert } from 'console';
import { bulkActions } from './bulk';

const logger = getLogger("Notification");

// This is the main extension point of notifications: Implement the Channel interface, then add the channel here
const channels = [mailjetChannel];

const HOURS_TO_MS = 60 * 60 * 1000;

/* -------------------------------- Public API exposed to other components ----------------------------------------------------------- */

/* sends one specific notification with a very specific notification context to the user.
   Using this directly is an intermediate solution, prefer actions ("actionTaken") instead */
export async function sendNotification(id: NotificationID, user: Person, notificationContext: NotificationContext): Promise<void> {
    const notification = await getNotification(id);

    const concreteNotification = await createConcreteNotification(notification, user, notificationContext);

    await deliverNotification(concreteNotification, notification, user, notificationContext);
}


/* Triggers all notification sending, scheduling and unscheduling of the emails for a certain action
   Call actionTaken whenever some user action gets performed where in the future, a notification might be useful
   If 'allowDuplicates' is set, the same action may be sent multiple times by the same user
*/
export async function actionTaken(user: Person, actionId: string, notificationContext: NotificationContext) {
    // Delivering notifications can be async while answering the API request continues
    (async function fireAndForget() {
        const startTime = Date.now();
        try {
            logger.debug(`Notification.actionTaken context for action '${actionId}'`, notificationContext);
            const notifications = await getNotifications();
            const relevantNotifications = notifications.get(actionId);

            if (!relevantNotifications) {
                logger.debug(`Notification.actionTaken found no notifications for action '${actionId}'`);
                return;
            }

            logger.debug(`Notification.actionTaken found notifications ${relevantNotifications.toCancel.map(it => it.id)} to cancel for action '${actionId}'`);

            // prevent sending of now unnecessary notifications
            const dismissed = await prisma.concrete_notification.updateMany({
                data: {
                    state: ConcreteNotificationState.ACTION_TAKEN,
                    sentAt: new Date()
                },
                where: {
                    notificationID: {
                        in: relevantNotifications.toCancel.map(it => it.id)
                    },
                    state: ConcreteNotificationState.DELAYED,
                    userId: getUserId(user),
                    // If a uniqueId is specified, e.g. the id of a course, only cancel reminders that are either not specific (have no contextID) or are for the same uniqueID
                    // If it is not specified, it'll apply to all reminders
                    ...(notificationContext.uniqueId ? {
                        OR: [{ contextID: null }, { contextID: notificationContext.uniqueId }]
                    } : {})
                }
            });

            logger.debug(`Notification.actionTaken dismissed ${dismissed.count} pending notifications`);

            const reminders = relevantNotifications.toSend.filter(it => it.delay);
            const directSends = relevantNotifications.toSend.filter(it => !it.delay);

            logger.debug(`Notification.actionTaken found reminders ${reminders.map(it => it.id)} and directSends ${directSends.map(it => it.id)}`);

            // Trigger notifications that are supposed to be directly sent on this action
            for (const directSend of directSends) {
                const concreteNotification = await createConcreteNotification(directSend, user, notificationContext);
                await deliverNotification(concreteNotification, directSend, user, notificationContext);
            }

            // Insert reminders into concrete_notification table so that a cron job can deliver them in the future
            if (reminders.length) {
                const remindersCreated = await prisma.concrete_notification.createMany({
                    data: reminders.map(it => ({
                        notificationID: it.id,
                        state: ConcreteNotificationState.DELAYED,
                        sentAt: new Date(Date.now() + (it.delay /* in hours */ * HOURS_TO_MS)),
                        userId: getUserId(user),
                        contextID: notificationContext.uniqueId,
                        context: notificationContext
                    }))
                });

                logger.debug(`Notification.actionTaken created ${remindersCreated.count} reminders`);
            }
        } catch (e) {
            logger.error(`Failed to perform Notification.actionTaken(${user.id}, "${actionId}") with `, e);
        }

        logger.debug(`Notification.actionTaken took ${Date.now() - startTime}ms`);
    })();
}


export async function checkReminders() {
    logger.debug(`Checking for pending notification reminders`);
    const start = Date.now();

    const remindersToSend = await prisma.concrete_notification.findMany({
        where: {
            state: ConcreteNotificationState.DELAYED,
            sentAt: { lte: new Date }
        }
    });

    for (const reminder of remindersToSend) {
        logger.debug(`Processing reminder`, reminder);

        if (!reminder.context) {
            throw new Error(`Notification(${reminder.id}) was supposed to contain a context when sending out reminders`);
        }

        const notification = await getNotification(reminder.notificationID);
        const user = await getUser(reminder.userId);
        await deliverNotification(reminder, notification, user, reminder.context as NotificationContext);

        // For recurring reminders, we simply create another DELAYED concrete notification
        // That way, the reminder will be sent again and again (a new concrete notification gets created when the previous one was sent out)
        // This ends once the user takes an action of the cancelOnActions
        if (notification.interval) {
            logger.debug(`Notification(${notification.id}) has interval set to ${notification.interval}h, thus another reminder gets scheduled to be sent out in the future`);

            if (notification.cancelledOnAction.length === 0) {
                logger.warn(`Notification(${reminder.id}) has an interval set but no cancelOnAction. Thus the user has no way to stop the reminders being sent!`);
            }

            const recurringReminder = await prisma.concrete_notification.create({
                data: {
                    notificationID: notification.id,
                    state: ConcreteNotificationState.DELAYED,
                    sentAt: new Date(Date.now() + (notification.interval /* in hours */ * HOURS_TO_MS)),
                    userId: getUserId(user),
                    contextID: reminder.contextID,
                    context: reminder.context
                }
            });

            logger.info(`Created recurring ConcreteNotification(${recurringReminder.id}) for Notification(${notification.id}) which will be sent at ${recurringReminder.sentAt}`);
        }
    }

    logger.info(`Sent ${remindersToSend.length} reminders in ${Date.now() - start}ms`);
}

// TODO: function for user preferences "categories"
// TODO: Check queue state, find pending emails and ones with errors, report to Admins, resend / cleanup utilities

/* --------------------------- Concrete Notification "Queue" ----------------------------------- */

/* Creates an entry in the concrete_notifications table, to track the notification */
async function createConcreteNotification(notification: Notification, user: Person, context: NotificationContext): Promise<ConcreteNotification> {
    if (context.uniqueId) {
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

    logger.debug(`Notification.createConcreteNotification succeeded for ConcreteNotification(${concreteNotification.id})`);

    return concreteNotification;
}

async function deliverNotification(concreteNotification: ConcreteNotification, notification: Notification, user: Person, notificationContext: NotificationContext): Promise<void> {
    logger.debug(`Sending ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`);

    const context: Context = {
        ...notificationContext,
        user: { ...user, fullName: getFullName(user) },
        authToken: user.authToken
    };

    try {
        const channel = channels.find(it => it.canSend(notification));
        if (!channel) {
            throw new Error(`No fitting channel found for Notification(${notification.id})`);
        }

        // TODO: Check if user silenced this notification

        await channel.send(notification, user, context, concreteNotification.id);
        await prisma.concrete_notification.update({
            data: {
                state: ConcreteNotificationState.SENT,
                sentAt: new Date()
                // drop the context, as it is irrelevant from now on, and only eats up memory
                // TODO: Clarify if in the future notifications should be shown in the user section
                // context: {}
            },
            where: {
                id: concreteNotification.id
            }
        });

        logger.info(`Succesfully sent ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`);

    } catch (error) {
        logger.warn(`Failed to send ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.id})`, error);

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

/* When introducing new notifications, it might sometimes make sense to schedule them "in retrospective" once for all existing users,
   as if the user took that action at actionDate */
export async function actionTakenAt(actionDate: Date, user: Person, actionId: string, notificationContext: NotificationContext, apply: boolean) {
    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        throw new Error(`Notification.actionTakenAt found no notifications for action '${actionId}'`);
    }

    const reminders = relevantNotifications.toSend.filter(it => it.delay);
    const remindersToCreate: Omit<ConcreteNotification, "id" | "error">[] = [];

    const userId = getUserId(user);

    for (const reminder of reminders) {
        if (reminder.delay * HOURS_TO_MS + +actionDate < Date.now() && !reminder.interval) {
            // Reminder was sent in the past and will not be sent in the future
            continue;
        }

        let sendAt = reminder.delay * HOURS_TO_MS + +actionDate;
        while (sendAt < Date.now()) {
            assert(reminder.interval > 0);
            sendAt += reminder.interval * HOURS_TO_MS;
        }

        remindersToCreate.push({
            notificationID: reminder.id,
            state: ConcreteNotificationState.DELAYED,
            sentAt: new Date(sendAt),
            userId,
            contextID: notificationContext.uniqueId,
            context: notificationContext
        });

    }

    if (apply && remindersToCreate.length > 0) {
        const remindersCreated = await prisma.concrete_notification.createMany({
            data: remindersToCreate
        });

        logger.info(`Notification.actionTakenAt scheduled ${remindersCreated.count} reminders for User(${userId}) at ${remindersToCreate.map(it => it.sentAt.toDateString())}`);
    }

    return remindersToCreate;
}
