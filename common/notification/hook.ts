/* Notification Hooks 'hook into' the notification system and run code
    before a certain notification is sent out. Thus when the user is notified (e.g. that their account is deactivated),
    then also the corresponding change in the DB happened.
    Cancelling or rescheduling the action thus also cancels or reschedules the corresponding hook */

import { student as Student, pupil as Pupil } from '@prisma/client';
import { getPupil, getStudent, User } from '../user';
import { getNotifications } from './notification';
import { prisma } from '../prisma';
import { ActionID, ConcreteNotificationState } from './types';

type NotificationHook = { fn: (user: User) => Promise<void>; description: string };

const hooks: { [hookID: string]: NotificationHook } = {};

export const hookExists = (hookID: string) => hookID in hooks;
export const getHookDescription = (hookID: string) => hooks[hookID]?.description;

export async function triggerHook(hookID: string, user: User) {
    if (!hookExists(hookID)) {
        throw new Error(`Unknown hook ${hookID}`);
    }

    const hook = hooks[hookID];

    await hook.fn(user);
}

export function registerHook(hookID: string, description: string, fn: (user: User) => Promise<void>) {
    if (hookExists(hookID)) {
        throw new Error(`Hook may only be registered once`);
    }

    hooks[hookID] = { description, fn };
}

export const registerStudentHook = (hookID: string, description: string, hook: (student: Student) => Promise<void>) =>
    registerHook(hookID, description, (user) => getStudent(user).then(hook));

export const registerPupilHook = (hookID: string, description: string, hook: (pupil: Pupil) => Promise<void>) =>
    registerHook(hookID, description, (user) => getPupil(user).then(hook));

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
