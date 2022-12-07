type Channels = {
    email: boolean;
};

type MessageTypes = 'chat' | 'match' | 'course' | 'appointment' | 'survey' | 'news';

export type Preferences = {
    [Category in MessageTypes]: Channels;
};
