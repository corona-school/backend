import { getLogger } from '../../../common/logger/logger';
import { Request, Response, Router } from 'express';
import { NotificationTriggered, MessageSentEvent, WithRawBody } from './types';
import { talkJsIdToUserId } from '../../../common/chat/helper';
import { getUser } from '../../../common/user';
import * as Notification from '../../../common/notification';
import { ChatType, InvalidSignatureError, getChatType, getNotificationContext, verifyChatUser } from './util';
import { createHmac } from 'crypto';
import { prisma } from '../../../common/prisma';

const logger = getLogger('ChatNotification');

export const chatNotificationRouter = Router();

chatNotificationRouter.post('/chat-event', handleChatEvent);

async function handleChatEvent(req: WithRawBody<Request>, res: Response) {
    try {
        logger.info('Request at /chat/chat-event');

        const receivedSignature = req.headers['x-talkjs-signature'];
        const timestamp = req.headers['x-talkjs-timestamp'];

        const payload = timestamp + '.' + req.rawBody;
        const hash = createHmac('sha256', secretKey).update(payload);
        const validSignature = hash.digest('hex').toUpperCase();

        if (receivedSignature !== validSignature) {
            throw new InvalidSignatureError('Invalid Signature');
        }
        const notificationBody: NotificationTriggered | MessageSentEvent = req.body;
        if (notificationBody.type === 'notification.triggered') {
            await handleChatNotification(req, res);
        } else if (notificationBody.type === 'message.sent') {
            await handleMessageSentEvent(req, res);
        } else {
            res.status(200).send({ status: 'ok' });
        }
    } catch (error) {
        if (error instanceof InvalidSignatureError) {
            logger.info('Invalid Signature');
            res.status(401).send({ error: 'Unauthorized' });
        } else {
            logger.info(`Error handling chat event: ${error.message}`, error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}

const secretKey = process.env.TALKJS_API_KEY;
async function handleChatNotification(req: WithRawBody<Request>, res: Response): Promise<void> {
    try {
        logger.info('Handling chat notification for missed messages');
        const notificationBody: NotificationTriggered = req.body;
        const { data } = notificationBody;
        const { recipient, sender, conversation } = data;
        const recipientUserId = talkJsIdToUserId(recipient.id);
        const senderUserId = talkJsIdToUserId(sender.id);
        const recipientUser = await getUser(recipientUserId);
        const senderUser = await getUser(senderUserId);

        const conversationParticipants = Object.keys(data.conversation.participants);
        const chatType = getChatType(conversationParticipants);

        const isRecipientVerified = await verifyChatUser(recipientUser);
        const onlySystemMessages = data.messages.every((m) => m.type === 'SystemMessage');

        if (!onlySystemMessages && isRecipientVerified) {
            const notificationContext = await getNotificationContext(notificationBody);

            const notificationAction = chatType === ChatType.ONE_ON_ONE ? 'missed_one_on_one_chat_message' : 'missed_course_chat_message';
            await Notification.actionTaken(recipientUser, notificationAction, notificationContext);
        }
        res.status(200).send({ status: 'ok' });
    } catch (error) {
        logger.error(`Failed to send notification for missed messages`, error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function handleMessageSentEvent(req: WithRawBody<Request>, res: Response): Promise<void> {
    try {
        logger.info('Handling message.sent event');
        res.status(200).send({ status: 'ok' });
        const notificationBody: MessageSentEvent = req.body;
        const { data } = notificationBody;
        const { sender, conversation, message } = data;
        const senderUserId = talkJsIdToUserId(sender.id);
        const match = conversation.custom.match ? JSON.parse(conversation.custom.match) : undefined;
        const userType = senderUserId.startsWith('pupil') ? 'pupil' : 'student';
        const conversationParticipants = Object.keys(data.conversation.participants);
        const chatType = getChatType(conversationParticipants);
        if (chatType === ChatType.ONE_ON_ONE && !!match?.matchId) {
            const matchRecord = await prisma.match.findFirst({
                where: { id: match.matchId },
            });
            const messageDate = new Date(message.createdAt).toISOString();
            if (userType === 'student') {
                if (!matchRecord.studentFirstMessageSentAt) {
                    const senderUser = await getUser(senderUserId);
                    await Notification.actionTaken(senderUser, 'student_first_chat_message_sent', { matchId: match.matchId });
                }
                await prisma.match.update({
                    where: { id: match.matchId },
                    data: {
                        studentLastMessageSentAt: messageDate,
                        studentFirstMessageSentAt: matchRecord?.studentFirstMessageSentAt ? matchRecord.studentFirstMessageSentAt : messageDate,
                        studentMessageCount: { increment: 1 },
                    },
                });
            } else if (userType === 'pupil') {
                if (!matchRecord.pupilFirstMessageSentAt) {
                    const senderUser = await getUser(senderUserId);
                    await Notification.actionTaken(senderUser, 'pupil_first_chat_message_sent', { matchId: match.matchId });
                }
                await prisma.match.update({
                    where: { id: match.matchId },
                    data: {
                        pupilLastMessageSentAt: messageDate,
                        pupilFirstMessageSentAt: matchRecord?.pupilFirstMessageSentAt ? matchRecord.pupilFirstMessageSentAt : messageDate,
                        pupilMessageCount: { increment: 1 },
                    },
                });
            }
        }
    } catch (error) {
        logger.error(`Failed to process message.sent event (${error.message})`, error);
    }
}
