import { TJConversation } from '../../../common/chat/types';

type Role = 'student' | 'pupil';

export type NotificationTriggered = {
    id: string;
    createdAt: string;
    data: {
        notificationId: string;
        recipient: Recipient;
        sender: Sender;
        conversation: TJConversation;
        messages: UserMessage[];
    };
    type: 'notification.triggered';
};

export type MessageSentEvent = {
    id: string;
    createdAt: string;
    data: {
        sender: Sender;
        conversation: TJConversation;
        message: UserMessage;
    };
    type: 'message.sent';
};

export interface Recipient {
    availabilityText: string | null;
    createdAt: number;
    custom: Record<string, any>;
    email: string[];
    id: string;
    locale: string | null;
    name: string;
    phone: string | null;
    photoUrl: string | null;
    pushTokens: Record<string, any>;
    role: Role;
    welcomeMessage: string | null;
}

export interface Sender {
    availabilityText: string | null;
    createdAt: number;
    custom: Record<string, any>;
    email: string[];
    id: string;
    locale: string | null;
    name: string;
    phone: string | null;
    photoUrl: string | null;
    pushTokens: Record<string, any>;
    role: Role;
    welcomeMessage: string | null;
}

export interface UserMessage {
    attachment: any | null;
    conversationId: string;
    createdAt: number;
    custom: Record<string, any>;
    editedAt: number | null;
    id: string;
    location: any | null;
    origin: string;
    readBy: string[];
    referencedMessageId: string | null;
    senderId: string;
    text: string;
    type: string;
}

type ChatParticipant = {
    firstname: string;
    fullname?: string;
};

type NotificationContextBase = {
    sender: ChatParticipant;
    conversationId: string;
    message: string;
    totalUnread: string;
    loginToken?: string;
};

export type GroupNotificationContext = NotificationContextBase & {
    courseId: string;
    courseName: string;
};

export type OneOnOneNotificationContext = NotificationContextBase & {
    matchId?: string;
    courseId?: string;
    subcourseIds?: string;
};

export type WithRawBody<T> = T & { rawBody: Buffer };
