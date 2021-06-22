import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Person } from '../entity/Person';
import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, sentNotification, notification } from './types';
import { prisma } from '../prisma'
import { sentNotificationState } from '@prisma/client';
import { Pupil } from 'common/entity/Pupil';
import { Student } from 'common/entity/Student';
import { idText } from 'typescript';



const channels = [mailjetChannel]
// This method can be used to send one specific notification with a very specific notification context to the user
// e.g. the login email which contains a login token
async function sendNotification(id: NotificationID, user: Person, notificationContext: NotificationContext): Promise<any> {
    //get Notificationchannel for Notification
    const notification = await prisma.notification.findUnique({ where: { id }, rejectOnNotFound: true })
    await _sendNotification(notification, user, notificationContext)
}

async function _sendNotification(notification: notification, user: Person, notificationContext: NotificationContext): Promise<any> {
    // TODO Fire and Forget
    const channel = channels.find(it => it.canSend(notification.id))
    if (!channel) {
        throw new Error("Channel not found for notification id.");
    }
    const context: Context = {
        ...notificationContext,
        user: user,
        title: ""
    };
    try {
        await channel.send(notification.id, context);
        await prisma.sentNotification.create({
            data: {
                sentAt: new Date(),
                state: sentNotificationState.SENT
            }
        });
    } catch (error) {
        console.log(error);
        await prisma.sentNotification.create({
            data: {
                sentAt: new Date(),
                state: sentNotificationState.ERROR
            }
        });
    }
}

// for campaigns, no Notification needs to be maintained in backend, just Template ID is enough
// category can be specified to provide user opt-out possibility
// TODO: User specific campaigns ("all students names 'Jonas'") ?
function sendMailCampaign(mailjetId: string, category?: string) {
    // TODO
}

// taking an action might kick off some notifications and cancel others
// thinking of e.g. 'login', which will cancel a lot of reminders ("check out XY!")
async function actionTaken(user: Person, actionId: string, notificationContext: NotificationContext) {

    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        return;
    }

    const pupilId = user instanceof Pupil ? user.id : undefined;
    const studentId = user instanceof Student ? user.id : undefined;
    if (!pupilId && !studentId) {
        throw new Error("No ID provided");
    }

    // prevent sending of now unnecessary notifications
    await prisma.sentNotification.updateMany({
        data: {
            state: sentNotificationState.ACTION_TAKEN
        },
        where: {
            notificationID: {
                in: relevantNotifications.toCancel.map(it => it.id)
            },
            state: sentNotificationState.DELAYED,
            pupilId,
            studentId
        }
    });

    const reminders = relevantNotifications.toSend.filter(it => it.delay);
    const directSends = relevantNotifications.toSend.filter(it => !it.delay);

    for (const directSend of directSends) {
        await _sendNotification(directSend, user, notificationContext);
    }

    // add new notifications depending on action
    if (reminders.length) {
        await prisma.sentNotification.create({
            data: reminders.map(it => ({
                notificationID:it.id,
                state: sentNotificationState.DELAYED,
                pupilId,
                studentId
            }))
        });
    }
}

async function getNotifications(): Promise<Map<String, { toSend: notification[], toCancel: notification[] }>> {
    // TODO: get relevant notifications and use caching
    return new Map();
}

async function checkReminders() {
    prisma.sentNotification.findMany({
        where: {
            state: sentNotificationState.DELAYED,
            sentAt: {lte:new Date}
        }
    })
}
// TODO: function for user preferences