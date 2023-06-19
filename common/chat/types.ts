import { ConversationData, Message } from 'talkjs/all';

export enum ContactReason {
    COURSE = 'course',
    MATCH = 'match',
    ANNOUNCEMENT = 'announcement',
    PARTICIPANT = 'participant',
    PROSPECT = 'prospect',
    CONTACT = 'contact',
}

export type Conversation = Pick<ConversationData, 'topicId' | 'id' | 'subject' | 'photoUrl' | 'welcomeMessages'> & {
    custom?: ChatMetaData;
    lastMessage?: Message;
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

export type TJConversation = Conversation & {
    custom?: TJChatMetaData;
    lastMessage?: Message;
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

export enum ChatAccess {
    READ = 'Read',
    READWRITE = 'ReadWrite',
}

export type AllConversations = {
    data: Conversation[];
};
