import { Message } from 'talkjs/all';

type LastMessage = {
    attachment: Message['attachment'];
    conversationId: string;
    createdAt: number;
    custom: Message['custom'];
    id: Message['id'];
    senderId: Message['senderId'];
    text: string;
    type: Message['type'];
};

export enum ContactReason {
    COURSE = 'course',
    MATCH = 'match',
    ANNOUNCEMENT = 'announcement',
    PARTICIPANT = 'participant',
    PROSPECT = 'prospect',
    CONTACT = 'contact',
}

export type Conversation = {
    id: string;
    subject?: string;
    topicId?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom?: ChatMetaData;
    lastMessage?: LastMessage;
    participants: {
        [id: string]: { access: 'ReadWrite' | 'Read'; notify: boolean };
    };
    createdAt: number;
};

export type ChatMetaData = {
    start?: string;
    groupType?: string;
    match?: { matchId: number };
    subcourse?: number[];
    prospectSubcourse?: number[];
    finished?: 'match_dissolved' | 'course_over';
};

export type TJConversation = {
    id: string;
    subject?: string;
    topicId?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom?: TJChatMetaData;
    lastMessage?: LastMessage;
    participants: {
        [id: string]: { access: 'ReadWrite' | 'Read'; notify: boolean };
    };
    createdAt: number;
};

export type TJChatMetaData = {
    start?: string;
    groupType?: string;
    match?: string;
    subcourse?: string;
    prospectSubcourse?: string;
    finished?: 'match_dissolved' | 'course_over';
};
export type ConversationInfos = {
    subject?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom: ChatMetaData;
};

export enum ChatType {
    NORMAL = 'NORMAL',
    ANNOUNCEMENT = 'ANNOUNCEMENT',
}
