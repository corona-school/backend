type ChannelPreference = {
    email: boolean;
    chat: boolean;
    whatsapp: boolean;
};

type PreferenceCategories = 'chat' | 'match' | 'course' | 'appointment' | 'survey' | 'news';

export type Preferences = {
    [Category in PreferenceCategories]: ChannelPreference;
};
