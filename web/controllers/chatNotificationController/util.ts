import { getChatUser } from '../../../common/chat';
import { getLogger } from '../../../common/logger/logger';
import { User } from '../../../common/user';
import { getCourse, getSubcourse } from '../../../graphql/util';
import { GroupNotificationContext, NotificationTriggered, OneOnOneNotificationContext } from './types';

const logger = getLogger('ChatNotification');

export enum ChatType {
    GROUP = 'group',
    ONE_ON_ONE = 'one_on_one',
}

export function getChatType(participants: string[]) {
    if (participants.length === 2) {
        return ChatType.ONE_ON_ONE;
    }
    return ChatType.GROUP;
}

export async function verifyChatUser(user: User) {
    const chatUser = await getChatUser(user);
    if (chatUser) {
        return true;
    }
    return false;
}

export async function getNotificationContext(notificationBody: NotificationTriggered): Promise<GroupNotificationContext | OneOnOneNotificationContext> {
    const { sender, conversation, messages } = notificationBody.data;
    const firstnameSender: string = sender.name.split(' ')[0];

    const subcourseConversation = conversation.custom.subcourse ? JSON.parse(conversation.custom.subcourse) : undefined;
    const match = conversation.custom.match ? JSON.parse(conversation.custom.match) : undefined;
    const participants = Object.keys(conversation.participants);

    const chatType = getChatType(participants);

    let notificationContext: GroupNotificationContext | OneOnOneNotificationContext;

    if (chatType === ChatType.ONE_ON_ONE) {
        let courseId: number;
        if (subcourseConversation?.length === 1) {
            const subcourse = await getSubcourse(subcourseConversation[0]);
            courseId = subcourse.courseId;
        }

        const filteredMessages = messages.filter((message) => message.type !== 'SystemMessage');

        notificationContext = {
            sender: { firstname: firstnameSender },
            conversationId: conversation.id,
            message: filteredMessages[0].text,
            totalUnread: messages.length.toString(),
            ...(match ? { matchId: match.matchId } : {}),
            ...(courseId ? { courseId: courseId.toString() } : {}),
            ...(subcourseConversation && subcourseConversation.length > 1 ? { subcourseIds: subcourseConversation.toString() } : {}),
        };
    } else if (chatType === ChatType.GROUP && subcourseConversation) {
        const subcourse = await getSubcourse(subcourseConversation[0]);
        const course = await getCourse(subcourse.courseId);

        notificationContext = {
            sender: { firstname: firstnameSender },
            conversationId: conversation.id,
            message: messages[0].text,
            totalUnread: messages.length.toString(),
            courseId: subcourse.courseId.toString(),
            courseName: course.name,
        };
    }

    logger.info('Created Notification context for chat message', notificationContext);

    return notificationContext;
}

export class InvalidSignatureError extends Error {}
