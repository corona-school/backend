type Channels = {
    email: boolean;
};

type MessageTypes = 'chat' | 'match' | 'course' | 'appointment' | 'survey' | 'news';

export type NotificationPreferences = {
    [MessageType in MessageTypes]: Channels;
};
