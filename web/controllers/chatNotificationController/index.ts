import { getLogger } from '../../../common/logger/logger';
import { Request, Response, Router } from 'express';

const logger = getLogger('ChatNotification');

export const chatNotificationRouter = Router();

chatNotificationRouter.post('/chat-notification', handleChatNotification);

async function handleChatNotification(req: Request, res: Response) {
    try {
        logger.info('Request at /chat-notification');
        logger.info(req.body);

        // TODO get right user

        // TODO send notification to user

        res.status(200).send({ status: 'ok' });
    } catch (e) {
        res.status(500).send({ error: 'Intrnal Server Error' });
    }
}

// {
//     createdAt: 1690292045626,
//     data: {
//       conversation: {
//         createdAt: 1690285437967,
//         custom: [Object],
//         id: '2e3f123...',
//         participants: [Object],
//         photoUrl: null,
//         subject: null,
//         topicId: null,
//         welcomeMessages: null
//       },
//       messages: [ [Object], [Object] ],
//       notificationId: 'ntf_6KNyKH2LFZpvbev9bQdgvR',
//       recipient: {
//         availabilityText: null,
//         createdAt: 1690285437850,
//         custom: {},
//         email: [Array],
//         id: 'student_1',
//         locale: null,
//         name: 'Leon Jackson',
//         phone: null,
//         photoUrl: null,
//         pushTokens: {},
//         role: 'student',
//         welcomeMessage: null
//       },
//       sender: {
//         availabilityText: null,
//         createdAt: 1690285435466,
//         custom: {},
//         email: [Array],
//         id: 'pupil_1',
//         locale: null,
//         name: 'Max M.',
//         phone: null,
//         photoUrl: null,
//         pushTokens: {},
//         role: 'pupil',
//         welcomeMessage: null
//       }
//     },
//     id: 'evt_AY3QOPr99lYlEemrbs',
//     type: 'notification.triggered'
//   } {}
