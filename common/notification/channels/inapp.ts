import { Message, WebSocketService } from '../../websocket';
import { AttachmentGroup } from '../../attachments';
import { Channel, Context, Notification } from '../types';
import { User } from '../../user';
import { getLogger } from '../../logger/logger';

const logger = getLogger('Notification InApp');

export const inAppChannel: Channel = {
    type: 'inapp',
    async send(notification: Notification, to: User, context: Context, concreteID: number, attachments?: AttachmentGroup): Promise<void> {
        const ws = WebSocketService.getInstance();
        const message: Message = {
            concreteNotificationId: concreteID,
        };
        await ws.sendMessageToUser(to.userID, message);
    },
    canSend: async (_notification: Notification, user: User) => {
        if (!WebSocketService.hasInstance()) {
            // In the Jobs Dyno (when sending Reminders) we do not have a connection to the Web Dyno which runs the Websocket Server
            // thus we cannot deliver an In App Notification in that case
            // This is not great, but hard to fix from an architectural point of view
            logger.debug(`Did not sent In App Notification as no Websocket Server is available`);
            return false;
        }

        const ws = WebSocketService.getInstance();
        return ws.isUserOnline(user.userID);
    },
};
