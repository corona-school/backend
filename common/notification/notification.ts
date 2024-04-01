/* Notifications are managed in external systems as well as the backend's database.
   New notifications can be created / modified at runtime. This module contains various utilities to do that */

import { prisma } from '../prisma';
import { Context, Notification, NotificationID, NotificationRecipient } from './types';
import { Prisma } from '@prisma/client';
import { getLogger } from '../../common/logger/logger';
import { hookExists } from './hook';
import { getNotificationActions, sampleUser } from './actions';
import { NotificationUpdateInput } from '../../graphql/generated';
import { USER_APP_DOMAIN } from '../util/environment';

type MessageTranslationFromDb = {
    template: {
        body: string;
        headline: string;
        modalText?: string;
    };
    id: number;
    notificationId: number;
    navigateTo: string;
};

type NotificationsPerAction = Map<string, { toSend: Readonly<Notification>[]; toCancel: Readonly<Notification>[] }>;
let _notificationsPerAction: Promise<NotificationsPerAction>;

const logger = getLogger('Notification Management');

export function invalidateCache() {
    logger.debug('Invalidated Notification cache');
    _notificationsPerAction = undefined;
}

export function getNotifications(): Promise<NotificationsPerAction> {
    if (_notificationsPerAction === undefined) {
        _notificationsPerAction = (async function () {
            const result = new Map();

            const notifications = await prisma.notification.findMany({ where: { active: true } });

            for (const notification of notifications) {
                for (const sendAction of notification.onActions) {
                    if (!result.has(sendAction)) {
                        result.set(sendAction, { toSend: [], toCancel: [] });
                    }

                    result.get(sendAction).toSend.push(notification);
                }

                for (const cancelAction of notification.cancelledOnAction) {
                    if (!result.has(cancelAction)) {
                        result.set(cancelAction, { toSend: [], toCancel: [] });
                    }

                    result.get(cancelAction).toCancel.push(notification);
                }
            }

            logger.debug(`Loaded ${notifications.length} notification into the cache`);

            return result;
        })();
    }

    return _notificationsPerAction;
}

export async function getNotification(id: NotificationID, allowDeactivated = false): Promise<Notification | never> {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
        throw new Error(`Unknown Notification (${id})`);
    }

    if (!allowDeactivated && !notification.active) {
        throw new Error(`Notification(${id}) was deactivated`);
    }

    return notification;
}

export async function activate(id: NotificationID, active: boolean): Promise<void | never> {
    const matched = await prisma.notification.update({
        data: { active },
        where: { id },
    });

    if (!matched) {
        throw new Error(`Failed to toggle activation of Notification(${id}) as it was not found`);
    }

    if (active) {
        logger.info(`Notification(${id}) activated`);
    } else {
        logger.info(`Notification(${id}) deactivated`);
    }

    invalidateCache();
}

export async function update(id: NotificationID, values: Partial<Omit<NotificationUpdateInput, 'active'>>) {
    if (values.hookID && !hookExists(values.hookID.set)) {
        throw new Error(`Invalid HookID`);
    }

    const matched = await prisma.notification.update({
        data: values,
        where: { id },
    });

    if (!matched) {
        throw new Error(`Failed to toggle activation of Notification(${id}) as it was not found`);
    }

    logger.info(`Notification(${id}) updated`);

    invalidateCache();
}

export async function create(notification: Prisma.notificationCreateInput) {
    if (notification.hookID && !hookExists(notification.hookID)) {
        throw new Error(`Invalid HookID`);
    }

    if (notification.recipient !== NotificationRecipient.USER) {
        throw new Error('For now, the recipient of a notification must be USER');
    }

    if (notification.active !== false) {
        throw new Error('Notifications must be created in inactive state');
    }

    // To keep DEV and PROD parity, notifications are inserted with their id (see "importNotifications")
    // Unfortunately this creates inconsistency between the ids present and the sequence used to generate new ids
    // Thus the id is manually calculated and does not rely on the DEFAULT value
    const result = await prisma.notification.create({
        data: {
            ...notification,
            id: (await prisma.notification.count()) + 1,
        },
    });

    logger.info(`Notification(${result.id}) created\n`);

    invalidateCache();

    return result;
}

export async function deleteOne(id: NotificationID) {
    if (!(await getNotification(id, true))) {
        throw new Error(`Unknown Notification (${id})`);
    } else if ((await prisma.concrete_notification.count({ where: { notificationID: id } })) > 0) {
        throw new Error('Cannot delete a notification which has concrete notifications.');
    }

    // If there is a related message_translation for this notification it has to be deleted first due to foreign key constraint
    if ((await prisma.message_translation.count({ where: { notificationId: id } })) > 0) {
        await prisma.message_translation.deleteMany({
            where: { notificationId: id },
        });
    }

    await prisma.notification.delete({
        where: { id },
    });

    return true;
}

/* Imports Changes to the Notification System
   If overwrite is set, all existing notifications will be dropped and the passed notifications will be recreated exactly as they are.
   Unless apply is set, the transaction is rolled back and no import is actually done. This is an extra safety net to not break the notification system
*/
export async function importNotifications(notifications: Notification[], dropBeforeSync = false, apply = false): Promise<string | never> {
    notifications.sort((a, b) => a.id - b.id);

    if (process.env.ENV !== 'dev' && dropBeforeSync) {
        throw new Error('Cannot overwrite productive configuration');
    }

    let log = `Import Log ${new Date().toLocaleString('en-US')}\n`;

    try {
        await prisma.$transaction(async (prisma) => {
            if (dropBeforeSync) {
                const removed = await prisma.notification.deleteMany({});
                log += `Through Overwrite ${removed.count} existing Notifications were removed\n`;
            }
            const untouched = await prisma.notification.count({
                where: { id: { notIn: notifications.map((it) => it.id) } },
            });

            log += `${untouched} existing notifications will not be modified\n`;

            for (const notification of notifications) {
                /* const templateExists = await prisma.notification.findFirst({
                    where: {
                        mailjetTemplateId: notification.mailjetTemplateId,
                        NOT: { id: notification.id },
                    },
                });

                if (templateExists) {
                    throw new Error(
                        `Notification(${notification.id}) collides with Notification(${templateExists.id}) as both target the same template ${notification.mailjetTemplateId}`
                    );
                } */

                const notificationExists = await prisma.notification.findFirst({ where: { id: notification.id } });

                if (notificationExists) {
                    const { id, ...update } = notification;
                    await prisma.notification.update({
                        data: update,
                        where: { id: id },
                    });

                    log += `Updated Notification(${notification.id})\n`;
                    log += diff(notificationExists, notification, 1);

                    if (notificationExists.active && !notification.active) {
                        log += `Deactivated Notification(${notification.id})\n`;
                    } else if (!notificationExists.active && notification.active) {
                        log += `Activated Notification(${notification.id})\n`;
                    }
                } else {
                    const result = await prisma.notification.create({
                        data: { ...notification, sample_context: notification.sample_context ?? undefined },
                    });

                    log += `Created Notification(${notification.id})\n`;
                    log += diff({}, notification, 1);

                    if (notification.active) {
                        log += `Activated Notification(${notification.id})\n`;
                    }
                }
            }

            if (!apply) {
                throw new TestRollbackError();
            }
        });
        // Only once the import succeeded and the transaction is commited, the cache is flushed:
        invalidateCache();
    } catch (error) {
        if (error instanceof TestRollbackError) {
            log += `Rolled back test changes\nRerun with 'apply: true' to actually apply\n`;
            // Don't raise error but show log instead
        } else {
            log += `An Error occured:\n`;
            log += `${error.message}\n`;
            log += `${error.stack}\n`;
            log += `Change was rolled back and not actually applied\n`;
            throw new Error(log);
        }
    }

    logger.info('Imported Notifications', { log });
    return log;
}

/* -------------------- Sample Context ------------------------------ */

// The context that needs to be passed into the notification system to render a specific notification:
type SampleContext = Partial<Context>;
export function getSampleContextExternal(notification: Notification): SampleContext {
    // For campaigns, there is no action that triggers the notification, instead this is done by an Admin for many users
    // For that, the notification has a sample_context which can be used in the notification templates,
    //  and which has to be provided by the Admin
    if (notification.sample_context) {
        return notification.sample_context as SampleContext;
    }

    // For non-campaigns, the available context is the subset of all actions that trigger the notification
    const sampleContexts = getNotificationActions()
        .filter((it) => notification.onActions.includes(it.id))
        .map((it) => it.sampleContext);

    if (sampleContexts.length === 0) {
        return {};
    }

    return sampleContexts.reduce(subset) as SampleContext;
}

// Returns a sample context for a notification, this can be used to validate
// templates which should be rendered with concrete notification contexts,
// as it contains at least the subset of the available fields in the context,
// which will definitely be available
export function getSampleContext(notification: Notification): Context {
    return { ...getSampleContextExternal(notification), user: sampleUser as any, USER_APP_DOMAIN };
}

// Returns the sample context as [['user.firstname', 'Jonas'], ['user.lastname', 'Wilms']]
// This is useful in template editors etc.
export const getSampleContextVariables = (notification: Notification) => flatten(getSampleContext(notification));

/* ------------------ Object Utilies --------------------- */

function flatten(obj: object, result: [string, string][] = [], prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
        const path = (prefix ? prefix + '.' : '') + key;
        if (typeof value === 'string') {
            result.push([path, value]);
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            flatten(value, result, path);
        } // else ignore
    }

    return result;
}

function subset<T extends object>(a: T, b: T): T {
    // Remove all keys from a that are not in b, thus all resulting keys are in a AND b
    const bKeys = new Set(Object.keys(b));
    const resultEntries = Object.entries(a).filter(([key, value]) => bKeys.has(key));

    // Potentially continue with nested objects
    for (const entry of resultEntries) {
        if (typeof entry[1] === 'object' && !Array.isArray(entry[1])) {
            entry[1] = subset(entry[1], b[entry[0]]);
        }
        // NOTE: This does not support Arrays
    }

    return Object.fromEntries(resultEntries) as T;
}

function diff(prev: any, curr: any, depth = 0) {
    let result = '';
    const keys = new Set([...Object.keys(prev), ...Object.keys(curr)]);
    for (const key of keys) {
        if (curr[key] === prev[key] || (Array.isArray(curr[key]) && Array.isArray(prev[key]) && curr[key].every((v, i) => v === prev[key][i]))) {
            continue;
        }

        if (key in prev) {
            result += ' '.repeat(depth * 2) + `- ${key}: ${prev[key]}\n`;
        }
        if (key in curr) {
            result += ' '.repeat(depth * 2) + `+ ${key}: ${curr[key]}\n`;
        }
    }

    return result;
}

export async function importMessageTranslations(messageTranslations: MessageTranslationFromDb[], dropBeforeSync = false) {
    messageTranslations.sort((a, b) => a.id - b.id);
    if (process.env.ENV !== 'dev' && dropBeforeSync) {
        throw new Error('Cannot overwrite productive configuration');
    }
    let log = `Import Log ${new Date().toLocaleString('en-US')}\n`;

    try {
        await prisma.$transaction(async (prisma) => {
            if (dropBeforeSync) {
                const removed = await prisma.message_translation.deleteMany({});
                log += `Through Overwrite ${removed.count} existing MessageTranslations were removed\n`;
            }
            const untouched = await prisma.message_translation.count({
                where: { id: { notIn: messageTranslations.map((it) => it.id) } },
            });

            log += `${untouched} existing MessageTranslations will not be modified\n`;

            for (const translation of messageTranslations) {
                const templateExists = await prisma.message_translation.findFirst({ where: { id: translation.id } });

                if (templateExists) {
                    const { id, ...update } = translation;
                    await prisma.message_translation.update({
                        data: update,
                        where: { id: id },
                    });

                    log += `Updated MessageTranslation(${translation.id})\n`;
                    log += diff(templateExists, translation, 1);
                } else {
                    await prisma.message_translation.create({
                        data: translation,
                    });

                    log += `Created MessageTranslation(${translation.id})\n`;
                    log += diff({}, translation, 1);
                }
            }
        });
    } catch (error) {
        log += `An Error occured:\n`;
        log += `${error.message}\n`;
        log += `${error.stack}\n`;
        log += `Change was rolled back and not actually applied\n`;
        throw new Error(log);
    }

    logger.info('Message Translations imported', { log });
    return log;
}

class TestRollbackError extends Error {}
