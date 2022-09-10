/* Notifications are managed in external systems as well as the backend's database.
   New notifications can be created / modified at runtime. This module contains various utilities to do that */

import { prisma } from '../prisma';
import { Notification, NotificationID } from './types';
import { NotificationRecipient } from '../entity/Notification';
import { Prisma } from '@prisma/client';
import { getLogger } from 'log4js';

type NotificationsPerAction = Map<String, { toSend: Notification[]; toCancel: Notification[] }>;
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

    if (!allowDeactivated && !notification.active) {
        throw new Error(`Notification(${id}) was deactivated`);
    }

    if (!notification) {
        throw new Error(`No notification found for id: ${id}`);
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

export async function update(id: NotificationID, values: Partial<Omit<Notification, 'active'>>) {
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
    if (notification.recipient !== NotificationRecipient.USER) {
        throw new Error('For now, the recipient of a notification must be USER');
    }

    if (notification.active !== false) {
        throw new Error('Notifications must be created in inactive state');
    }

    if (!notification.mailjetTemplateId) {
        throw new Error('As long as Mailjet is our main channel, it is required to set the mailjetTemplateId');
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
}

/* Imports Changes to the Notification System
   If overwrite is set, all existing notifications will be dropped and the passed notifications will be recreated exactly as they are.
   Unless apply is set, the transaction is rolled back and no import is actually done. This is an extra safety net to not break the notification system
*/
export async function importNotifications(notifications: Notification[], overwrite = false, apply = false): Promise<string | never> {
    notifications.sort((a, b) => a.id - b.id);

    if (process.env.ENV !== 'dev' && overwrite) {
        throw new Error('Cannot overwrite productive configuration');
    }

    let log = `Import Log ${new Date().toLocaleString('en-US')}\n`;

    try {
        await prisma.$transaction(async (prisma) => {
            if (overwrite) {
                const removed = await prisma.notification.deleteMany({});
                log += `Through Overwrite ${removed.count} existing Notifications were removed\n`;
            }
            const untouched = await prisma.notification.count({
                where: { id: { notIn: notifications.map((it) => it.id) } },
            });

            log += `${untouched} existing notifications will not be modified\n`;

            for (const notification of notifications) {
                const templateExists = await prisma.notification.findFirst({
                    where: {
                        mailjetTemplateId: notification.mailjetTemplateId,
                        NOT: { id: notification.id },
                    },
                });

                if (templateExists) {
                    throw new Error(
                        `Notification(${notification.id}) collides with Notification(${templateExists.id}) as both target the same template ${notification.mailjetTemplateId}`
                    );
                }

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
                        data: notification,
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

    logger.info(log);
    return log;
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

class TestRollbackError extends Error {}
