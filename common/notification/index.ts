import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Person } from '../entity/Person';
import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext, Context, sentNotification, notification } from './types';
import { prisma } from '../prisma'
import { sentNotificationState } from '@prisma/client';
import { Pupil } from 'common/entity/Pupil';
import { Student } from 'common/entity/Student';



const channels = [mailjetChannel]
// This method can be used to send one specific notification with a very specific notification context to the user
// e.g. the login email which contains a login token
async function sendNotification(id: NotificationID, user: Person, notificationContext: NotificationContext): Promise<any> {
    //get Notificationchannel for Notification 
    const notification = await prisma.notification.findUnique({ where: { id }, rejectOnNotFound: true })
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
async function actionTaken(user: Person, actionId: string) {

    const notifications = await getNotifications();
    const relevantNotifications = notifications.get(actionId);

    if (!relevantNotifications) {
        return;
    }

    const pupilId = user instanceof Pupil ? user.id : undefined;
    const studentId = user instanceof Student ? user.id : undefined;
    if (!pupilId || !studentId) {
        return;
    }
    const pupilOrStudentId = pupilId ?? studentId;
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
            pupilId: pupilOrStudentId,
        }
    });

    // add new notifications depending on action
    // const newNotifications = getNotificationsToAdd(pupilOrStudentId, actionId);
    // await prisma.sentNotification.create({
    //     data: ,
    //     where: {
    //         notificationID: {
    //             in: relevantNotifications.toCancel.map(it => it.id)
    //         },
    //         state: sentNotificationState.DELAYED,
    //         pupilId: user.id
    //     }
    // });
}

async function getNotificationsToAdd(userId: string, actionId: string) : Promise<notification[]> {
    return [];
}


async function getNotifications(): Promise<Map<String, { toSend: notification[], toCancel: notification[] }>> {
    // TODO: get relevant notifications and use caching
    return new Map();
}

// TODO: function for user preferences