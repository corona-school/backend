import { Message, WebSocketService } from '../../websocket';
import { AttachmentGroup } from '../../attachments';
import { Channel, Context, Person, Notification } from '../types';
import { User } from '../../user';

export const inAppChannel: Channel = {
    type: 'inapp',
    async send(notification: Notification, to: Person, context: Context, concreteID: number, attachments?: AttachmentGroup, user?: User): Promise<void> {
        const ws = WebSocketService.getInstance();
        const message: Message = {
            concreteNotificationId: concreteID,
        };
        await ws.sendMessageToUser(user.userID, message);
    },
    canSend: (_notification: Notification, user?: User) => {
        const ws = WebSocketService.getInstance();
        return ws.isUserOnline(user.userID);
    },
};
