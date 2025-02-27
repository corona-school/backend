/* Notification Hooks 'hook into' the notification system and run code
    before a certain notification is sent out. Thus when the user is notified (e.g. that their account is deactivated),
    then also the corresponding change in the DB happened.
    Cancelling or rescheduling the action thus also cancels or reschedules the corresponding hook */

import { student as Student, pupil as Pupil } from '@prisma/client';
import { getPupil, getStudent, User } from '../user';
import { NotificationContext } from './types';

type NotificationHook = { fn: (user: User, context: NotificationContext) => Promise<void>; description: string };

const hooks: { [hookID: string]: NotificationHook } = {};

export const hookExists = (hookID: string) => hookID in hooks;
export const getHookDescription = (hookID: string) => hooks[hookID]?.description;

export async function triggerHook(hookID: string, user: User, context: NotificationContext) {
    if (!hookExists(hookID)) {
        throw new Error(`Unknown hook ${hookID}`);
    }

    const hook = hooks[hookID];

    await hook.fn(user, context);
}

export function registerHook(hookID: string, description: string, fn: (user: User, context: NotificationContext) => Promise<void>) {
    if (hookExists(hookID)) {
        throw new Error(`Hook may only be registered once`);
    }

    hooks[hookID] = { description, fn };
}

export const registerStudentHook = (hookID: string, description: string, hook: (student: Student, context: NotificationContext) => Promise<void>) =>
    registerHook(hookID, description, (user, context) => getStudent(user).then((student) => hook(student, context)));

export const registerPupilHook = (hookID: string, description: string, hook: (pupil: Pupil, context: NotificationContext) => Promise<void>) =>
    registerHook(hookID, description, (user, context) => getPupil(user).then((pupil) => hook(pupil, context)));
