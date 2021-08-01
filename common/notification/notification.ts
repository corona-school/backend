/* Notifications are managed in external systems as well as the backend's database.
   New notifications can be created / modified at runtime. This module contains various utilities to do that */

import { prisma } from "../prisma";
import { debug } from "console";
import { Notification, NotificationID } from "./types";
import { NotificationRecipient } from "../entity/Notification";

type NotificationsPerAction = Map<String, { toSend: Notification[], toCancel: Notification[] }>;
let _notificationsPerAction: NotificationsPerAction;


export function invalidateCache() {
    debug("Invalidated Notification cache");
    _notificationsPerAction = undefined;
}

export async function getNotifications(): Promise<NotificationsPerAction> {
    if (_notificationsPerAction) {
        return _notificationsPerAction;
    }

    const result = _notificationsPerAction = new Map();

    const notifications = await prisma.notification.findMany({ where: { active: true }});

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

    return result;
}

export async function getNotification(id: NotificationID, allowDeactivated = false): Promise<Notification | never> {
    const notification = await prisma.notification.findUnique({ where: { id }});

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
        where: { id }
    });

    if (!matched) {
        throw new Error(`Failed to toggle activation of Notification(${id}) as it was not found`);
    }

    invalidateCache();
}


export async function update(id: NotificationID, values: Partial<Omit<Notification, "active">>) {
    const matched = await prisma.notification.update({
        data: values,
        where: { id }
    });

    if (!matched) {
        throw new Error(`Failed to toggle activation of Notification(${id}) as it was not found`);
    }

    invalidateCache();
}

export async function create(notification: Omit<Notification, "id" | "active">) {
    await prisma.notification.create({
        data: { ...notification, active: false }
    });

    invalidateCache();
}