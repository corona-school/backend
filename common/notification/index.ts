import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, Notification, ConcreteNotification, ConcreteNotificationState, Person } from './types';
import { prisma } from '../prisma';
import { getNotification, getNotifications } from './notification';
import { getUserIdTypeORM, getUserTypeORM, getFullName, getUserForTypeORM, User } from '../user';
import { getLogger } from 'log4js';
import { Student } from '../entity/Student';
import { v4 as uuid } from 'uuid';
import { AttachmentGroup, createAttachment, File, getAttachmentGroupByAttachmentGroupId, getAttachmentListHTML } from '../attachments';
import { Pupil } from '../entity/Pupil';
import { assert } from 'console';
import { triggerHook } from './hook';
import { USER_APP_DOMAIN } from '../util/environment';
import { inAppChannel } from './channels/inapp';

const logger = getLogger('Notification');

// This is the main extension point of notifications: Implement the Channel interface, then add the channel here
const channels = [mailjetChannel, inAppChannel];

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

export async function actionTaken(user: Person, actionId: string, notificationContext: NotificationContext, attachments?: AttachmentGroup) {
    if (!user.active) {
        logger.debug(`No action '${actionId}' taken for User(${getUserIdTypeORM(user)}) as the account is deactivated`);
        return;
    }

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

            logger.debug(
                `Notification.actionTaken found notifications ${relevantNotifications.toCancel.map((it) => it.id)} to cancel for action '${actionId}'`
            );

            // prevent sending of now unnecessary notifications
            const dismissed = await prisma.concrete_notification.updateMany({
                data: {
                    state: ConcreteNotificationState.ACTION_TAKEN,
                    sentAt: new Date(),
                },
                where: {
                    notificationID: {
                        in: relevantNotifications.toCancel.map((it) => it.id),
                    },
                    state: ConcreteNotificationState.DELAYED,
                    userId: getUserIdTypeORM(user),
                    // If a uniqueId is specified, e.g. the id of a course, only cancel reminders that are either not specific (have no contextID) or are for the same uniqueID
                    // If it is not specified, it'll apply to all reminders
                    ...(notificationContext.uniqueId
                        ? {
                              OR: [{ contextID: null }, { contextID: notificationContext.uniqueId }],
                          }
                        : {}),
                },
            });

            logger.debug(`Notification.actionTaken dismissed ${dismissed.count} pending notifications`);

            const reminders = relevantNotifications.toSend.filter((it) => it.delay);
            const directSends = relevantNotifications.toSend.filter((it) => !it.delay);

            logger.debug(`Notification.actionTaken found reminders ${reminders.map((it) => it.id)} and directSends ${directSends.map((it) => it.id)}`);

            // Trigger notifications that are supposed to be directly sent on this action
            for (const directSend of directSends) {
                const concreteNotification = await createConcreteNotification(directSend, user, notificationContext, attachments);
                await deliverNotification(concreteNotification, directSend, user, notificationContext, attachments);
            }

            // Insert reminders into concrete_notification table so that a cron job can deliver them in the future
            if (reminders.length) {
                const remindersCreated = await prisma.concrete_notification.createMany({
                    data: reminders.map((it) => ({
                        notificationID: it.id,
                        state: ConcreteNotificationState.DELAYED,
                        sentAt: new Date(Date.now() + it.delay /* in hours */ * HOURS_TO_MS),
                        userId: getUserIdTypeORM(user),
                        contextID: notificationContext.uniqueId,
                        context: notificationContext,
                        attachmentGroupId: attachments?.attachmentGroupId,
                    })),
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
            sentAt: { lte: new Date() },
        },
    });

    for (const reminder of remindersToSend) {
        try {
            logger.debug(`Processing reminder`, reminder);

            if (!reminder.context) {
                throw new Error(`Notification(${reminder.id}) was supposed to contain a context when sending out reminders`);
            }

            let attachmentGroup = null;
            if (reminder.attachmentGroupId !== null) {
                attachmentGroup = await getAttachmentGroupByAttachmentGroupId(reminder.attachmentGroupId);
            }

            const notification = await getNotification(reminder.notificationID);
            const user = await getUserTypeORM(reminder.userId);

            if (!user.active) {
                throw new Error(`Reminder was found although account is deactivated`);
            }

            await deliverNotification(reminder, notification, user, reminder.context as NotificationContext, attachmentGroup);

            // For recurring reminders, we simply create another DELAYED concrete notification
            // That way, the reminder will be sent again and again (a new concrete notification gets created when the previous one was sent out)
            // This ends once the user takes an action of the cancelOnActions
            if (notification.interval) {
                logger.debug(
                    `Notification(${notification.id}) has interval set to ${notification.interval}h, thus another reminder gets scheduled to be sent out in the future`
                );

                if (notification.cancelledOnAction.length === 0) {
                    logger.warn(
                        `Notification(${reminder.id}) has an interval set but no cancelOnAction. Thus the user has no way to stop the reminders being sent!`
                    );
                }

                const recurringReminder = await prisma.concrete_notification.create({
                    data: {
                        notificationID: notification.id,
                        state: ConcreteNotificationState.DELAYED,
                        sentAt: new Date(Date.now() + notification.interval /* in hours */ * HOURS_TO_MS),
                        userId: getUserIdTypeORM(user),
                        contextID: reminder.contextID,
                        context: reminder.context,
                        attachmentGroupId: reminder.attachmentGroupId,
                    },
                });

                logger.info(
                    `Created recurring ConcreteNotification(${recurringReminder.id}) for Notification(${notification.id}) which will be sent at ${recurringReminder.sentAt}`
                );
            }
        } catch (error) {
            logger.error(`Sending Reminder ConcreteNotification(${reminder.id}) failed with error`, error);
            await prisma.concrete_notification.update({
                data: {
                    state: ConcreteNotificationState.ERROR,
                    error: error.message,
                },
                where: { id: reminder.id },
            });
        }
    }

    logger.info(`Sent ${remindersToSend.length} reminders in ${Date.now() - start}ms`);
}

// TODO: function for user preferences "categories"
// TODO: Check queue state, find pending emails and ones with errors, report to Admins, resend / cleanup utilities

/* --------------------------- Concrete Notification "Queue" ----------------------------------- */

/* Creates an entry in the concrete_notifications table, to track the notification */
async function createConcreteNotification(
    notification: Notification,
    user: Person,
    context: NotificationContext,
    attachments?: AttachmentGroup
): Promise<ConcreteNotification> {
    if (context.uniqueId) {
        const existingNotification = await prisma.concrete_notification.findFirst({
            where: {
                notificationID: notification.id,
                userId: getUserIdTypeORM(user),
                contextID: context.uniqueId,
            },
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
            userId: getUserIdTypeORM(user),
            sentAt: new Date(),
            contextID: context.uniqueId,
            context,
            attachmentGroupId: attachments?.attachmentGroupId,
        },
    });

    logger.debug(`Notification.createConcreteNotification succeeded for ConcreteNotification(${concreteNotification.id})`);

    return concreteNotification;
}

async function deliverNotification(
    concreteNotification: ConcreteNotification,
    notification: Notification,
    legacyUser: Person,
    notificationContext: NotificationContext,
    attachments?: AttachmentGroup
): Promise<void> {
    logger.debug(`Sending ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${legacyUser.id})`);

    const context: Context = {
        ...notificationContext,
        user: { ...legacyUser, fullName: getFullName(legacyUser) },
        authToken: legacyUser.authToken ?? '',
        USER_APP_DOMAIN,
    };

    try {
        const user = getUserForTypeORM(legacyUser);
        const channelsToSendTo = channels.filter((it) => it.canSend(notification, user));
        if (!channelsToSendTo || channelsToSendTo.length === 0) {
            throw new Error(`No fitting channel found for Notification(${notification.id})`);
        }

        if (notification.hookID) {
            await triggerHook(notification.hookID, user);
        }

        // TODO: Check if user silenced this notification

        await Promise.all(
            channelsToSendTo.map(async (channel) => {
                await channel.send(notification, user, context, concreteNotification.id, attachments);
            })
        );

        await prisma.concrete_notification.update({
            data: {
                state: ConcreteNotificationState.SENT,
                sentAt: new Date(),
                // drop the context, as it is irrelevant from now on, and only eats up memory
                // TODO: Clarify if in the future notifications should be shown in the user section
                // context: {}
            },
            where: {
                id: concreteNotification.id,
            },
        });

        logger.info(`Succesfully sent ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${legacyUser.id})`);
    } catch (error) {
        logger.warn(`Failed to send ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${legacyUser.id})`, error);

        await prisma.concrete_notification.update({
            data: {
                sentAt: new Date(),
                state: ConcreteNotificationState.ERROR,
                error: error.message,
            },
            where: {
                id: concreteNotification.id,
            },
        });

        // TODO: What about e.g. hard bouncing emails?
        // TODO: Check if user has lot of errors, disable account?
    }
}

/* --------------------------- Attachments ---------------------------------------------------- */

/**
 * Creates AttachmentGroup objects for use in the notification system or returns `null` if no files are passed to the method.
 * These objects include HTML for the attachment list which gets inserted into messages.
 * @param files     Multer files to be uploaded.
 * @param uploader  User that intends to upload the files.
 * @return          Object with attachmentListHTML, attachmentGroupId, and attachmentIds
 */
export async function createAttachments(files: File[], uploader: Student | Pupil): Promise<AttachmentGroup | null> {
    if (files.length > 0) {
        let attachmentGroupId = uuid().toString();

        let attachments = await Promise.all(
            files.map(async (f) => {
                let attachmentId = await createAttachment(f, uploader, attachmentGroupId);
                return { attachmentId, filename: f.originalname, size: f.size };
            })
        );

        const attachmentListHTML = await getAttachmentListHTML(attachments, attachmentGroupId);

        return { attachmentListHTML, attachmentGroupId, attachmentIds: attachments.map((att) => att.attachmentId) };
    }
    return null;
}

/* --------------------------- Admin Actions for Notifications ----------------------------------- */

const DEACTIVATION_MARKER = 'ACCOUNT_DEACTIVATION';

export async function cancelRemindersFor(user: Person) {
    await prisma.concrete_notification.updateMany({
        data: {
            state: ConcreteNotificationState.ACTION_TAKEN,
            error: DEACTIVATION_MARKER,
        },
        where: {
            state: ConcreteNotificationState.DELAYED,
            userId: getUserIdTypeORM(user),
        },
    });
}

/* When introducing new notifications, it might sometimes make sense to schedule them "in retrospective" once for all existing users,
   as if the user took that action at actionDate */
export async function actionTakenAt(
    actionDate: Date,
    user: Person,
    actionId: string,
    notificationContext: NotificationContext,
    apply: boolean,
    attachments?: AttachmentGroup
) {
    assert(user.active, 'Cannot trigger action taken at for inactive users');

    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        throw new Error(`Notification.actionTakenAt found no notifications for action '${actionId}'`);
    }

    const reminders = relevantNotifications.toSend.filter((it) => it.delay);
    const remindersToCreate: Omit<ConcreteNotification, 'id' | 'error'>[] = [];

    const userId = getUserIdTypeORM(user);

    for (const reminder of reminders) {
        if (reminder.delay * HOURS_TO_MS + +actionDate < Date.now() && !reminder.interval) {
            // Reminder was sent in the past and will not be sent in the future
            logger.debug(`Reminder(${reminder.id}) won't be scheduled in the future of ${actionDate.toISOString()}`);
            continue;
        }

        let sendAt = reminder.delay * HOURS_TO_MS + +actionDate;
        if (sendAt < Date.now()) {
            assert(reminder.interval > 0);
            const intervalCount = Math.ceil((Date.now() - sendAt) / (reminder.interval * HOURS_TO_MS));
            sendAt += intervalCount * reminder.interval * HOURS_TO_MS;
            assert(Date.now() > sendAt);
        }

        logger.debug(`Reminder(${reminder.id}) for action at ${actionDate.toISOString()} will be send at ${new Date(sendAt).toISOString()}`);

        remindersToCreate.push({
            notificationID: reminder.id,
            state: ConcreteNotificationState.DELAYED,
            sentAt: new Date(sendAt),
            userId,
            contextID: notificationContext.uniqueId,
            context: notificationContext,
            attachmentGroupId: attachments?.attachmentGroupId,
        });
    }

    if (apply && remindersToCreate.length > 0) {
        const remindersCreated = await prisma.concrete_notification.createMany({
            data: remindersToCreate,
        });

        logger.info(
            `Notification.actionTakenAt scheduled ${remindersCreated.count} reminders for User(${userId}) at ${remindersToCreate.map((it) =>
                it.sentAt.toDateString()
            )}`
        );
    }

    return remindersToCreate;
}

export async function cancelNotification(notification: ConcreteNotification) {
    if (notification.state !== ConcreteNotificationState.DELAYED) {
        throw new Error(`Notification is not in DELAYED state, cannot be canceled`);
    }

    await prisma.concrete_notification.update({
        where: { id: notification.id },
        data: {
            state: ConcreteNotificationState.ACTION_TAKEN,
            error: 'Manually cancelled',
        },
    });

    logger.info(`ConcreteNotification(${notification.id}) was manually cancelled`);
}

export async function rescheduleNotification(notification: ConcreteNotification, sendAt: Date) {
    if (+sendAt < Date.now()) {
        throw new Error(`Notification must be scheduled in the future`);
    }

    if (notification.state !== ConcreteNotificationState.DELAYED) {
        throw new Error(`Notification must be in delayed state to be rescheduled`);
    }

    await prisma.concrete_notification.update({
        data: { sentAt: sendAt },
        where: { id: notification.id },
    });

    logger.info(`ConcreteNotification(${notification.id}) was manually rescheduled to ${sendAt.toISOString()}`);
}

/* --------------------------- Campaigns ---------------------------------------------------- */

export function validateContext(notification: Notification, context: NotificationContext) {
    if (!notification.sample_context) {
        throw new Error(`Cannot validate Notification(${notification.id}) without sample_context`);
    }

    const expectedKeys = Object.keys(notification.sample_context);
    const actualKeys = Object.keys(context);
    const missing = expectedKeys.filter((it) => !actualKeys.includes(it));

    if (missing.length) {
        throw new Error(`Missing the following fields in context: ${missing.join(', ')}`);
    }
}

// Bulk Concrete Notifications can be created in drafted state
// Then one can validate and check that all notifications were created correctly before sending them out
export async function bulkCreateNotifications(
    notification: Notification,
    users: User[],
    context: NotificationContext,
    state: ConcreteNotificationState.DELAYED | ConcreteNotificationState.DRAFTED,
    startAt: Date
) {
    if (users.length > 10 && state !== ConcreteNotificationState.DRAFTED) {
        throw new Error(`Notifications sent to more than 10 users should use the DRAFTED state`);
    }

    const contextIDExists =
        (await prisma.concrete_notification.count({
            where: { contextID: context.uniqueId },
        })) > 0;

    if (contextIDExists) {
        throw new Error(`ContextID must be unique for bulk notifications`);
    }

    const { count: createdNotifications } = await prisma.concrete_notification.createMany({
        data: users.map((user, index) => ({
            // the unique id is automatically created by the database
            notificationID: notification.id,
            state,
            userId: user.userID,
            sentAt: new Date(+startAt + 1000 * 60 * 60 * 24 * Math.floor(index / 500)),
            contextID: context.uniqueId,
            context,
        })),
    });

    logger.info(`Created ${createdNotifications} notifications for Notification(${notification.id}) in ${ConcreteNotificationState[state]} state`);
}

export async function publishDrafted(notification: Notification, contextID: string) {
    const { count: publishedCount } = await prisma.concrete_notification.updateMany({
        where: { state: ConcreteNotificationState.DRAFTED, notificationID: notification.id, contextID },
        data: { state: ConcreteNotificationState.DELAYED },
    });

    logger.info(`Published ${publishedCount} notifications for Notification(${notification.id})`);
}

export async function cancelDraftedAndDelayed(notification: Notification, contextID: string) {
    const { count: publishedCount } = await prisma.concrete_notification.updateMany({
        where: { state: { in: [ConcreteNotificationState.DRAFTED, ConcreteNotificationState.DELAYED] }, notificationID: notification.id, contextID },
        data: { state: ConcreteNotificationState.ACTION_TAKEN, error: 'Draft cancelled' },
    });

    logger.info(`Cancelled ${publishedCount} drafted notifications for Notification(${notification.id})`);
}

export * from './hook';
