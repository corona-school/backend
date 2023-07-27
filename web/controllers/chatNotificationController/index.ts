import { getLogger } from '../../../common/logger/logger';
import { Request, Response, Router } from 'express';
import { NotificationTriggered } from './types';
import { talkJsIdToUserId } from '../../../common/chat/helper';
import { getPupil, getStudent, getUser } from '../../../common/user';
import * as Notification from '../../../common/notification';
import { pupil as Pupil, student as Student } from '@prisma/client';
import { ChatType, getChatType, getNotificationContext, verifyChatUser } from './util';
import { createHmac } from 'crypto';

const logger = getLogger('ChatNotification');

export const chatNotificationRouter = Router();

chatNotificationRouter.post('/chat-notification', handleChatNotification);

const secretKey = process.env.TALKJS_API_KEY;
async function handleChatNotification(req: Request, res: Response): Promise<void> {
    try {
        logger.info('Request at /chat/chat-notification');

        const receivedSignature = req.headers['x-talkjs-signature'];
        const timestamp = req.headers['x-talkjs-timestamp'];

        const payload = timestamp + '.' + req.body;
        const hash = createHmac('sha256', secretKey).update(payload);
        const validSignature = hash.digest('hex').toUpperCase();

        // logger.info(`rec sig: ${receivedSignature} : val: ${validSignature}`);
        // logger.info(`body: ${JSON.stringify(req.body)} timestamp: ${timestamp}`);

        // if (receivedSignature !== validSignature) {
        //     throw new Error('Invalid Signature');
        // }

        const notificationBody: NotificationTriggered = req.body;
        const { data } = notificationBody;
        const recipient = data.recipient;
        const recipientUserId = talkJsIdToUserId(recipient.id);
        const recipientUser = await getUser(recipientUserId);

        const conversationParticipants = Object.keys(data.conversation.participants);
        const chatType = getChatType(conversationParticipants);

        const isUserVerified = await verifyChatUser(recipientUser);

        if (isUserVerified) {
            const notificationContext = await getNotificationContext(notificationBody);
            let userToNotify: Pupil | Student;
            if (recipientUser.pupilId) {
                userToNotify = await getPupil(recipientUser);
            } else {
                userToNotify = await getStudent(recipientUser);
            }

            const notificationAction = chatType === ChatType.ONE_ON_ONE ? 'missed_one_on_one_chat_message' : 'missed_course_chat_message';
            await Notification.actionTaken(userToNotify, notificationAction, notificationContext);
        }
        res.status(200).send({ status: 'ok' });
    } catch (error) {
        logger.info(`${error}`);
        logger.error(`Failed to send notification for missed messages`, error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
