import { getChatUser } from '../../../common/chat';
import { hasCachedChatUser } from '../../../common/chat/create';
import { getLogger } from '../../../common/logger/logger';
import { User } from '../../../common/user';
import { getCourse, getSubcourse } from '../../../graphql/util';
import { GroupNotificationContext, NotificationTriggered, OneOnOneNotificationContext } from './types';
import { Profanity } from '@2toad/profanity';

const profanity = new Profanity({
    languages: ['de', 'en'],
});

profanity.removeWords(process.env.PROFANITY_WHITE_LIST?.split(',') || []);
profanity.addWords(process.env.PROFANITY_BLACK_LIST?.split(',') || []);

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
    if (hasCachedChatUser(user)) {
        return true;
    }

    const chatUser = await getChatUser(user);
    if (chatUser) {
        return true;
    }
    return false;
}

export function getMessageFlag(message: string) {
    const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+\s*@\s*(?!lern-fair\s*\.\s*de\b)[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}\b/i;
    const EXTERNAL_PLATFORM_REGEX = /\b(whats\s?-?app|discord|telegram|skype|snapchat|instagram|tiktok|facebook|messenger|threema|imessage|facetime)\b/i;
    if (EXTERNAL_PLATFORM_REGEX.test(message) || EMAIL_REGEX.test(message)) {
        return 'CHAT_ATTEMPT_PLATFORM_CHANGE' as const;
    }
    if (profanity.exists(message)) {
        return 'CHAT_OBSCENITY' as const;
    }
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
