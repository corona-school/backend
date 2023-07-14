import { ConversationData, Message } from 'talkjs/all';

export enum ContactReason {
    COURSE = 'course',
    MATCH = 'match',
    ANNOUNCEMENT = 'announcement',
    PARTICIPANT = 'participant',
    PROSPECT = 'prospect',
    CONTACT = 'contact',
}

export enum AccessRight {
    READ = 'Read',
    READ_WRITE = 'ReadWrite',
}

export type Conversation = Pick<ConversationData, 'topicId' | 'id' | 'subject' | 'photoUrl' | 'welcomeMessages'> & {
    custom?: ChatMetaData;
    lastMessage?: Message;
    participants: {
        [id: string]: { access: AccessRight; notify: boolean };
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
        [id: string]: { access: AccessRight; notify: boolean };
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

export enum SystemMessage {
    FIRST = 'first',
    GROUP_CHANGED = 'group_changed',
    GROUP_OVER = 'group_over',
    GROUP_REACTIVATE = 'group_reactivate',
    ONE_ON_ONE_OVER = 'one_on_one_over',
    ONE_ON_ONE_REACTIVATE = 'one_on_one_reactivate',
}
