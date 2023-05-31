export interface ChatSettings {
    type: GroupChatType;
    allowChatContact: boolean;
    allowProspectChatContact: boolean;
}

export enum GroupChatType {
    GROUP = 'group',
    ANNOUNCEMENT = 'announcement',
}
