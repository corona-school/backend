import { getLogger } from '../../../common/logger/logger';
import { Request, Response, Router } from 'express';
import { NotificationTriggered, WithRawBody } from './types';
import { talkJsIdToUserId } from '../../../common/chat/helper';
import { getUser } from '../../../common/user';
import * as Notification from '../../../common/notification';
import { ChatType, InvalidSignatureError, getChatType, getNotificationContext, verifyChatUser } from './util';
import { createHmac } from 'crypto';

const logger = getLogger('ChatNotification');

export const chatNotificationRouter = Router();

chatNotificationRouter.post('/chat-notification', handleChatNotification);

const secretKey = process.env.TALKJS_API_KEY;
async function handleChatNotification(req: WithRawBody<Request>, res: Response): Promise<void> {
    try {
        logger.info('Request at /chat/chat-notification');

        const receivedSignature = req.headers['x-talkjs-signature'];
        const timestamp = req.headers['x-talkjs-timestamp'];

        const payload = timestamp + '.' + req.rawBody;
        const hash = createHmac('sha256', secretKey).update(payload);
        const validSignature = hash.digest('hex').toUpperCase();

        if (receivedSignature !== validSignature) {
            throw new InvalidSignatureError('Invalid Signature');
        }

        const notificationBody: NotificationTriggered = req.body;
        const { data } = notificationBody;
        const recipient = data.recipient;
        const recipientUserId = talkJsIdToUserId(recipient.id);
        const recipientUser = await getUser(recipientUserId);

        const conversationParticipants = Object.keys(data.conversation.participants);
        const chatType = getChatType(conversationParticipants);

        const isUserVerified = await verifyChatUser(recipientUser);
        const onlySystemMessages = data.messages.every((m) => m.type === 'SystemMessage');

        if (!onlySystemMessages && isUserVerified) {
            const notificationContext = await getNotificationContext(notificationBody);

            const notificationAction = chatType === ChatType.ONE_ON_ONE ? 'missed_one_on_one_chat_message' : 'missed_course_chat_message';
            await Notification.actionTaken(recipientUser, notificationAction, notificationContext);
        }
        res.status(200).send({ status: 'ok' });
    } catch (error) {
        if (error instanceof InvalidSignatureError) {
            logger.info('Invalid Signature');
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        logger.error(`Failed to send notification for missed messages`, error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
