import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, Notification, ConcreteNotification, ConcreteNotificationState, Channel, getContext } from './types';
import { prisma } from '../prisma';
import { getNotification, getNotifications, getSampleContextExternal } from './notification';
import { getFullName, User, queryUser, getUser } from '../user';
import { getLogger } from '../logger/logger';
import { v4 as uuid } from 'uuid';
import { AttachmentGroup, createAttachment, File, getAttachmentGroupByAttachmentGroupId, getAttachmentListHTML } from '../attachments';
import { triggerHook } from './hook';
import { isDev } from '../util/environment';
import { inAppChannel } from './channels/inapp';
import { ActionID, getSampleContextForAction, SpecificNotificationContext } from './actions';
import { Channels } from '../../graphql/types/preferences';
import { ALL_PREFERENCES, DEFAULT_PREFERENCES } from './defaultPreferences';
import assert from 'assert';
import { Prisma } from '@prisma/client';
import tracer, { addTagsToActiveSpan } from '../logger/tracing';
// eslint-disable-next-line import/no-cycle
import * as Achievement from '../../common/achievement';
import { webpushChannel } from './channels/push';
import _ from 'lodash';

const logger = getLogger('Notification');

// This is the main extension point of notifications: Implement the Channel interface, then add the channel here
// Default Channels are always on, the user cannot turn them off
const DEFAULT_CHANNELS = [inAppChannel];
// The optional channels are steered via the user preferences
const OPTIONAL_CHANNELS = [mailjetChannel, webpushChannel];

const HOURS_TO_MS = 60 * 60 * 1000;

// The time where we consider a Notification to happen "now":
const SLACK = 1000; /* ms */

// DO NOT USE! Only use in local / test environments
let SILENCE_NOTIFICATION_SYTEM = false;
export const _setSilenceNotificationSystem = (value: boolean) => (SILENCE_NOTIFICATION_SYTEM = value);

/* --------------------------- Concrete Notification "Queue" ----------------------------------- */

/* Creates an entry in the concrete_notifications table, to track the notification */
async function createConcreteNotification(
    notification: Notification,
    user: User,
    context: NotificationContext,
    attachments?: AttachmentGroup
): Promise<ConcreteNotification> {
    // First of all we commit the notification to the database, which allows us to recover if the backend crashes
    const concreteNotification = await prisma.concrete_notification.create({
        data: {
            // the unique id is automatically created by the database
            notificationID: notification.id,
            state: ConcreteNotificationState.PENDING,
            userId: user.userID,
            sentAt: new Date(),
            contextID: context.uniqueId,
            context,
            attachmentGroupId: attachments?.attachmentGroupId,
        },
    });

    logger.debug(`Notification.createConcreteNotification succeeded for ConcreteNotification(${concreteNotification.id})`);

    return concreteNotification;
}

export const getUserNotificationPreferences = async (user: User, includeAlwaysEnabledPreferences: boolean) => {
    const basePreferences = includeAlwaysEnabledPreferences ? ALL_PREFERENCES : DEFAULT_PREFERENCES;

    const storedPreferences = (await queryUser(user, { notificationPreferences: true })).notificationPreferences as Record<string, unknown> | null;
    return storedPreferences ? _.merge({ ...basePreferences }, { ...storedPreferences }) : basePreferences;
};

const getNotificationChannelPreferences = async (user: User, concreteNotification: ConcreteNotification): Promise<Channels> => {
    const notification = await getNotification(concreteNotification.notificationID);
    const type = (concreteNotification.context as Context)?.overrideType ?? notification.type;

    const notificationPreferences = await getUserNotificationPreferences(user, true);

    const channelPreference = notificationPreferences?.[type];
    assert.ok(channelPreference, `No default channel preferences maintained for notification type ${type}`);

    logger.info(`Got Notification preferences for User(${user.userID})`, {
        type,
        notificationPreferences,
        channelPreference,
    });

    return channelPreference;
};

async function deliverNotification(
    concreteNotification: ConcreteNotification,
    notification: Notification,
    user: User,
    notificationContext: NotificationContext,
    attachments?: AttachmentGroup
): Promise<void> {
    logger.debug(`Sending ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${user.userID})`);

    const context = getContext(notificationContext, user);
    const enabledChannels: Channel[] = [...DEFAULT_CHANNELS];
    let activeChannels: Channel[] = [];

    try {
        // Always trigger the hook, no matter whether we actually send something to the user
        if (notification.hookID) {
            logger.debug(`Running Hook(${notification.hookID}) for ConcreteNotification(${concreteNotification.id})`);
            await triggerHook(notification.hookID, user, context);
        }

        const channelPreferencesForMessageType = await getNotificationChannelPreferences(user, concreteNotification);

        for (const channel of OPTIONAL_CHANNELS) {
            if (channelPreferencesForMessageType[channel.type]) {
                enabledChannels.push(channel);
            } else {
                logger.debug(`ConcreteNotification(${concreteNotification.id}) not sent via ${channel.type} as the user opted out`);
            }
        }

        activeChannels = [];
        for (const enabled of enabledChannels) {
            const canBeSent = await enabled.canSend(notification, user);
            const isChannelDisabledForNotification = notification.disabledChannels.includes(enabled.type);
            if (canBeSent && !isChannelDisabledForNotification) {
                activeChannels.push(enabled);
            }
        }

        if (!activeChannels.length) {
            logger.warn(
                `None of the enabled Channels (${enabledChannels.map((it) => it.type).join(', ')}) can send ConcreteNotification(${concreteNotification.id})`
            );
            // NOTE: This might be legitimate for notifications only shown inside the UserApp
        }

        await Promise.all(
            activeChannels.map(async (channel) => {
                await channel.send(notification, user, context, concreteNotification.id, attachments);
                logger.debug(`Sent ConcreteNotification(${concreteNotification.id}) via Channel ${channel.type}`);
            })
        );

        await prisma.concrete_notification.update({
            data: {
                state: ConcreteNotificationState.SENT,
                sentAt: new Date(),
            },
            where: {
                id: concreteNotification.id,
            },
        });

        logger.info(
            `Successfully sent ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${
                user.userID
            }) via Channels (${activeChannels.map((it) => it.type).join(', ')})`
        );
    } catch (error) {
        logger.warn(
            `Failed to send ConcreteNotification(${concreteNotification.id}) of Notification(${notification.id}) to User(${
                user.userID
            }) via Channels (${activeChannels.map((it) => it.type).join(', ')}) - ${error?.message}`,
            error
        );

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
export async function createAttachments(files: File[], uploader: User): Promise<AttachmentGroup | null> {
    if (files.length > 0) {
        const attachmentGroupId = uuid().toString();

        const attachments = await Promise.all(
            files.map(async (f) => {
                const attachmentId = await createAttachment(f, uploader, attachmentGroupId);
                return { attachmentId, filename: f.originalname, size: f.size };
            })
        );

        const attachmentListHTML = getAttachmentListHTML(attachments, attachmentGroupId);

        return { attachmentListHTML, attachmentGroupId, attachmentIds: attachments.map((att) => att.attachmentId) };
    }
    return null;
}

/* --------------------------- Admin Actions for Notifications ----------------------------------- */

const DEACTIVATION_MARKER = 'ACCOUNT_DEACTIVATION';

export async function cancelRemindersFor(user: User) {
    await prisma.concrete_notification.updateMany({
        data: {
            state: ConcreteNotificationState.ACTION_TAKEN,
            error: DEACTIVATION_MARKER,
        },
        where: {
            state: ConcreteNotificationState.DELAYED,
            userId: user.userID,
        },
    });
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

// overrideType and overrideMailjetTemplateId are not listed here, they need to be specified
// in the Notification.sample_context to be overridable
const allowedExtensions = ['uniqueId', 'campaign', 'overrideReceiverEmail'];

// ATTENTION: This currently allows very powerful extensions needed for Campaign Notifications
// This should only be used to validate contexts from trusted sources (Admins), for other users
// prohibit the use of the "allowedExtensions"
export function validateContext(notification: Notification, context: NotificationContext) {
    const sampleContext = getSampleContextExternal(notification);

    const expectedKeys = Object.keys(sampleContext);
    const actualKeys = Object.keys(context);
    const missing = expectedKeys.filter((it) => !actualKeys.includes(it));
    const unexpected = actualKeys.filter((it) => !expectedKeys.includes(it) && !allowedExtensions.includes(it));

    if (missing.length) {
        throw new Error(`Missing the following fields in context: ${missing.join(', ')}`);
    }

    if (unexpected.length) {
        throw new Error(`The following unexpected keys occured in the context: ${unexpected.join(', ')}`);
    }
}

export function validateContextForAction(action: ActionID, context: NotificationContext) {
    const sampleContext = getSampleContextForAction(action);

    const expectedKeys = Object.keys(sampleContext);
    const actualKeys = Object.keys(context);
    const missing = expectedKeys.filter((it) => !actualKeys.includes(it));
    const unexpected = actualKeys.filter((it) => !expectedKeys.includes(it) && !allowedExtensions.includes(it));

    if (missing.length) {
        throw new Error(`Missing the following fields in context: ${missing.join(', ')}`);
    }

    if (unexpected.length) {
        throw new Error(`The following unexpected keys occured in the context: ${unexpected.join(', ')}`);
    }
}

// Bulk Concrete Notifications can be created in drafted state
// Then one can validate and check that all notifications were created correctly before sending them out
export async function bulkCreateConcreteNotifications(
    notification: Notification,
    users: User[],
    context: NotificationContext,
    state: ConcreteNotificationState.DELAYED | ConcreteNotificationState.DRAFTED,
    startAt: Date
) {
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
            sentAt: new Date(+startAt + 1000 * 60 * 15 * Math.floor(index / 250)),
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

/* -------------------------------- Hook ----------------------------------------------------------- */

// Predicts when a hook will run for a certain user as caused by a certain action
// i.e. 'When will a user by deactivated (hook) due to Certificate of Conduct reminders (action) ?'
// Returns null if no date is known or hook was already triggered
export async function predictedHookActionDate(action: ActionID, hookID: string, user: User): Promise<Date | null> {
    const viableNotifications = ((await getNotifications()).get(action)?.toSend ?? []).filter((it) => it.hookID === hookID);

    const possibleTrigger = await prisma.concrete_notification.findFirst({
        where: {
            state: ConcreteNotificationState.DELAYED,
            userId: user.userID,
            notificationID: { in: viableNotifications.map((it) => it.id) },
        },
        select: { sentAt: true },
    });

    return possibleTrigger?.sentAt;
}

export * from './hook';

/* -------------------------------- Public API exposed to other components ----------------------------------------------------------- */

/* sends one specific notification with a very specific notification context to the user.
   Using this directly is an intermediate solution, prefer actions ("actionTaken") instead */
export async function sendNotification<ID extends ActionID>(
    id: NotificationID,
    user: User,
    forAction: ActionID,
    notificationContext: SpecificNotificationContext<ActionID>
): Promise<void> {
    const notification = await getNotification(id);

    if (!notification.onActions.includes(forAction)) {
        throw new Error(`Notification(${notification.id}) does not belong to Action '${forAction}`);
    }

    const concreteNotification = await createConcreteNotification(notification, user, notificationContext);
    await deliverNotification(concreteNotification, notification, user, notificationContext);
}

/* Triggers all notification sending, scheduling and unscheduling of the emails for a certain action
   Call actionTaken whenever some user action gets performed where in the future, a notification might be useful
*/
export async function actionTaken<ID extends ActionID>(
    user: User,
    actionId: ID,
    notificationContext: SpecificNotificationContext<ID>,
    attachments?: AttachmentGroup,
    noDuplicates = false
) {
    if (!user.active) {
        logger.debug(`No action '${actionId}' taken for User(${user.userID}) as the account is deactivated`);
        return;
    }

    return await actionTakenAt(new Date(), user, actionId, notificationContext, false, noDuplicates, attachments);
}

/* actionTakenAt is the mighty variant of actionTaken:

SCHEDULING:

If there are active Notifications that contain the action in 'onActions':

If 'at' is right now:
- Notifications without a delay are immediately sent
- Notifications with a positive delay are scheduled in now + delay
- Notifications with a negative delay are not sent (as they are in the past)

If 'at' is in the past:
- Notifications without a delay or a negative delay are not sent (as they are in the past)
- Notifications with a delay might be scheduled if (at + delay > now)
- Notifications with an interval are scheduled for the next execution where (at + delay + interval * N > now)

If 'at' is in the future:
- Notifications without a delay are scheduled to be sent at 'at'
- Notifications with a positive delay are scheduled to be sent at 'at' + delay
- Notifications with a negative delay are scheduled to be sent at 'at' - delay (if > now)

CANCELLATION:

If there are Notifications scheduled in the future where cancelOnActions contains the action,
these Notifications are cancelled (moved to state ACTION_TAKEN) and are not sent out.
If the context has a 'uniqueId', i.e. the id of a match, only the Notifications with that uniqueId are cancelled.

Cancellation ignores 'at', so if an action is scheduled in the future and an action that cancels it is scheduled
 after that point in time, the notification is still cancelled.

DUPLICATE PREVENTION:

If 'noDuplicates' is set, a Notification will be ignored if a Notification already exists for this user and uniqueId.
Otherwise a Notification will just be sent multiple times.
*/

export const actionTakenAt = tracer.wrap('notification.actionTakenAt', _actionTakenAt);
export async function _actionTakenAt<ID extends ActionID>(
    at: Date,
    user: User,
    actionId: ID,
    notificationContext: SpecificNotificationContext<ID>,
    dryRun = false,
    noDuplicates = false,
    attachments?: AttachmentGroup
) {
    try {
        // To be able to reuse all existing action taken events, we had to move the achievement reward here
        await Achievement.rewardActionTakenAt(at, user, actionId, notificationContext);
    } catch (e) {
        logger.error('Failed to reward achievement', e, { at, user, actionId, notificationContext });
    }

    if (SILENCE_NOTIFICATION_SYTEM && isDev) {
        logger.debug(`No Action taken as Notification System is silenced`);
        return;
    }

    // Prevent that we accidentally contact inactive or unverified accounts
    // DO NOT TOUCH THIS! We are legally required to not send emails to deactivated accounts!

    if (!user.active) {
        logger.debug(`No action '${actionId}' taken for User(${user.userID}) as the account is deactivated`);
        return;
    }

    const startTime = Date.now();

    // Use this timestamp instead of Date.now(), as otherwise calculations might differ based on runtime:
    const now = Date.now();

    let dismissedCount = 0;
    const directSends: Readonly<Notification>[] = [];
    const reminders: { notification: Readonly<Notification>; sendAt: number }[] = [];

    try {
        // --------------- Find Notifications ----------------------------------

        logger.debug(`Notification.actionTaken context for action '${actionId}'`, notificationContext);
        const notifications = await getNotifications();
        const relevantNotifications = notifications.get(actionId);

        if (!relevantNotifications) {
            logger.debug(`Notification.actionTaken found no notifications for action '${actionId}'`);
            return;
        }

        // --------------- Dismiss Concrete Notifications to cancel ------------
        // NOTE: We need to cancel first, as otherwise a Notification with onActions: 'a', cancelOnActions: 'a' will cancel itself
        //       This way it will cancel a previous action, and will then schedule a new one

        if (relevantNotifications.toCancel.length) {
            logger.debug(
                `Notification.actionTaken found notifications ${relevantNotifications.toCancel.map((it) => it.id)} to cancel for action '${actionId}'`
            );

            const queryToDismiss: Prisma.concrete_notificationWhereInput = {
                notificationID: {
                    in: relevantNotifications.toCancel.map((it) => it.id),
                },
                state: ConcreteNotificationState.DELAYED,
                userId: user.userID,
                // If a uniqueId is specified, e.g. the id of a course, only cancel reminders that are either not specific (have no contextID) or are for the same uniqueID
                // If it is not specified, it'll apply to all reminders
                ...(notificationContext.uniqueId
                    ? {
                          OR: [{ contextID: null }, { contextID: notificationContext.uniqueId }],
                      }
                    : {}),
            };

            if (!dryRun) {
                const dismissed = await prisma.concrete_notification.updateMany({
                    data: {
                        state: ConcreteNotificationState.ACTION_TAKEN,
                        sentAt: new Date(now),
                    },
                    where: queryToDismiss,
                });

                logger.debug(`Notification.actionTaken dismissed ${dismissed.count} pending notifications`);
                dismissedCount = dismissed.count;
            } else {
                dismissedCount = await prisma.concrete_notification.count({
                    where: queryToDismiss,
                });
            }
        }

        // --------------- Determine which Notifications to send directly and which to schedule ---------

        for (const notification of relevantNotifications.toSend) {
            if (noDuplicates) {
                assert(notificationContext.uniqueId, 'If noDuplicates is set, a uniqueId shall be set');

                const existingDuplicates = await prisma.concrete_notification.count({
                    where: { notificationID: notification.id, userId: user.userID, contextID: notificationContext.uniqueId },
                });

                if (existingDuplicates > 0) {
                    logger.info(
                        `Skipping Notification(${notification.id}) as User(${user.userID}) already has an existing notification with UniqueID ${notificationContext.uniqueId}`
                    );
                    continue;
                }
            }

            let sendAt = +at; /* in ms */
            if (notification.delay) {
                //   (NOW)         X <--------------- (at) ----------------> X
                //                   (negative delay)      (positive delay)
                sendAt += notification.delay * HOURS_TO_MS;
            }

            if (sendAt < now && notification.interval) {
                //   X ----X-| (NOW) |-> X
                //   If a notification would be scheduled in the past and then repeated, we repeat till we reach a future time where
                //   sendAt + interval * N > now
                const n = Math.ceil((now - sendAt - SLACK) / (notification.interval * HOURS_TO_MS));
                assert.ok(n >= 0, 'Expect to go forward in time');

                sendAt += n * notification.interval * HOURS_TO_MS;
            }

            if (sendAt < now - SLACK) {
                // We cannot travel back in time, so we ignore the notification:
                logger.debug(
                    `Notification.actionTakenAt dismissed Notification(${notification.id}) as ${at.toISOString()} was projected to ${new Date(
                        sendAt
                    ).toISOString()} (with delay: ${notification.delay ?? '-'} and interval: ${notification.interval ?? '-'}) which is in the past`
                );
            } else if (sendAt < now + SLACK) {
                directSends.push(notification);
                logger.debug(
                    `Notification.actionTakenAt will directly send Notification(${notification.id}) as ${at.toISOString()} was projected to ${new Date(
                        sendAt
                    ).toISOString()} (with delay: ${notification.delay ?? '-'} and interval: ${notification.interval ?? '-'}) which is right now`
                );
            } /* sendAt > now + SLACK */ else {
                reminders.push({ notification, sendAt });
                logger.debug(
                    `Notification.actionTakenAt will schedule a reminder for Notification(${
                        notification.id
                    }) as ${at.toISOString()} was projected to ${new Date(sendAt).toISOString()} (with delay: ${notification.delay ?? '-'} and interval: ${
                        notification.interval ?? '-'
                    }) which is in the future`
                );
            }
        }

        // --------------- Send out Notifications to send directly --------------------------------------
        const userData = await queryUser(user, { createdAt: true, verifiedAt: true });
        // During the registration process, users might get emails before they are verified
        // We generally allow this for 30 days, but then require verification at some point
        const oldAccount = +userData.createdAt < +Date.now() - 30 * 24 * HOURS_TO_MS;
        // Some actions are always allowed to trigger notifications, so that users can recover their account even after 30 days:
        const isAlwaysAllowed = actionId === 'user-authenticate' || actionId === 'user-password-reset' || actionId === 'user-verify-email';

        // NOTE: Due to historic reasons, there are users with both unset verifiedAt and verification
        if (!isAlwaysAllowed && oldAccount && !userData.verifiedAt) {
            logger.error(
                `Tried to send notifications for triggered action '${actionId}' for unverified User(${user.userID}) who is unverified for more than 30 days`
            );
            return;
        }

        if (!dryRun) {
            for (const directSend of directSends) {
                const concreteNotification = await createConcreteNotification(directSend, user, notificationContext, attachments);
                await deliverNotification(concreteNotification, directSend, user, notificationContext, attachments);
            }
        }

        // --------------- Create Reminders to be picked up by a background job somewhen ----------------
        if (!dryRun && reminders.length) {
            const remindersCreated = await prisma.concrete_notification.createMany({
                data: reminders.map(({ notification, sendAt }) => ({
                    notificationID: notification.id,
                    state: ConcreteNotificationState.DELAYED,
                    sentAt: new Date(sendAt),
                    userId: user.userID,
                    contextID: notificationContext.uniqueId,
                    context: notificationContext,
                    attachmentGroupId: attachments?.attachmentGroupId,
                })),
            });

            logger.debug(`Notification.actionTaken created ${remindersCreated.count} reminders`);
        }
    } catch (e) {
        // NOTE: This shall not happen! We want to catch errors in deliverNotification and store them on the notification instead,
        // to be able to fix and resend Notifications when something goes wrong.
        logger.error(`Failed to perform Notification.actionTaken(${user.userID}, "${actionId}") with `, e);
    }

    logger.debug(`Notification.actionTaken took ${Date.now() - startTime}ms`);

    return { reminders, directSends, dismissedCount };
}

export async function bulkActionTaken<ID extends ActionID>(users: User[], actionId: ID, notificationContext: SpecificNotificationContext<ID>) {
    logger.debug(`Notification.bulkActionTaken context for action '${actionId}'`, notificationContext);
    const startTime = Date.now();

    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        logger.debug(`Notification.bulkActionTaken found no notifications for action '${actionId}'`);
        return;
    }
    try {
        for (const notification of relevantNotifications.toSend) {
            assert.ok(!notification.delay, 'Notifications with delay unsupported for bulk actions');
            await bulkCreateConcreteNotifications(notification, users, notificationContext, ConcreteNotificationState.DELAYED, new Date());
        }
    } catch (e) {
        logger.error(`Failed to perform Notification.bulkActionTaken("${actionId}"): `, e);
    }
    logger.debug(`Notification.bulkActionTaken took ${Date.now() - startTime}ms`);
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
            const user = await getUser(reminder.userId);

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
                        userId: user.userID,
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

    addTagsToActiveSpan({ remindersToSend: remindersToSend.length });
    logger.info(`Sent ${remindersToSend.length} reminders in ${Date.now() - start}ms`);
}

// TODO: Check queue state, find pending emails and ones with errors, report to Admins, resend / cleanup utilities
