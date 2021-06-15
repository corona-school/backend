import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Person } from '../entity/Person';
import { mailjetChannel } from './channels/mailjet';
import { NotificationID, NotificationContext } from './types';
import { prisma } from '../prisma'



const channels = [mailjetChannel]
// This method can be used to send one specific notification with a very specific notification context to the user
// e.g. the login email which contains a login token
async function sendNotification(id: NotificationID, user: Person, context: NotificationContext): Promise<any> {
    //get Notificationchannel for Notification 
    const notification = await prisma.notification.findUnique({where: {id}, rejectOnNotFound: true})
    const channel = channels.find(it => it.canSend(notification.id))
    if  (!channel)
    {
        
    }

}

// for campaigns, no Notification needs to be maintained in backend, just Template ID is enough
// category can be specified to provide user opt-out possibility
// TODO: User specific campaigns ("all students names 'Jonas'") ?
function sendMailCampaign(mailjetID: string, category?: string) {

}

// taking an action might kick off some notifications and cancel others
// thinking of e.g. 'login', which will cancel a lot of reminders ("check out XY!") 
function actionTaken(user: Person, actionID: string) {

}