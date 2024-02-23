import { ConversationData, Message } from 'talkjs/all';

export enum ContactReason {
    COURSE = 'course',
    MATCH = 'match',
    ANNOUNCEMENT = 'announcement',
    PARTICIPANT = 'participant',
    PROSPECT = 'prospect',
    CONTACT = 'contact',
}

export type Conversation = Pick<ConversationData, 'id' | 'subject' | 'photoUrl' | 'welcomeMessages'> & {
    custom?: ChatMetaData;
    lastMessage?: Message;
    participants: {
        [id: string]: { access: ChatAccess; notify: boolean };
    };
    createdAt: number;
};

export type ChatMetaData = {
    start?: string;
    groupType?: string;
    match?: { matchId: number };
    subcourse?: number[];
    prospectSubcourse?: number[];
    finished?: FinishedReason;
    createdBy?: string;
};

export type TJConversation = Conversation & {
    custom?: TJChatMetaData;
    lastMessage?: Message;
    participants: {
        [id: string]: { access: ChatAccess; notify: boolean };
    };
    createdAt: number;
};

export type TJChatMetaData = {
    start?: string;
    groupType?: string;
    match?: string;
    subcourse?: string;
    prospectSubcourse?: string;
    finished?: FinishedReason;
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
export enum ChatAccess {
    READ = 'Read',
    READWRITE = 'ReadWrite',
    NONE = 'None',
}

export enum FinishedReason {
    MATCH_DISSOLVED = 'match_dissolved',
    COURSE_OVER = 'course_over',
    REACTIVATE = 'reactivated',
    REACTIVATE_BY_ADMIN = 'reactivated_by_admin',
}
