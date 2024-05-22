type OptionalChannels = { email: boolean; push: boolean };
export type Preferences = { [category: Categories]: OptionalChannels };
type Categories = (typeof categories)[number];

// These are always enabled for all users
export const ENABLED_NOTIFICATIONS: Preferences = {
    account: { email: true, push: true },
    onboarding: { email: true, push: true },
    match: { email: true, push: true },
    course: { email: true, push: true },
    certificate: { email: true, push: true },
    legacy: { email: true, push: true },
    achievement: { email: false, push: true },
};

export const ENABLED_NEWSLETTER: Preferences = {
    chat: { email: true, push: true },
    survey: { email: true, push: true },
    appointment: { email: true, push: true },
    advice: { email: true, push: true },
    suggestion: { email: true, push: true },
    announcement: { email: true, push: true },
    call: { email: true, push: true },
    news: { email: true, push: true },
    event: { email: true, push: true },
    request: { email: true, push: true },
    alternative: { email: true, push: true },
};

export const DISABLED_NEWSLETTER: Preferences = {
    chat: { email: true, push: true },
    survey: { email: false, push: false },
    appointment: { email: true, push: true },
    advice: { email: false, push: false },
    suggestion: { email: false, push: false },
    announcement: { email: true, push: true },
    call: { email: false, push: false },
    news: { email: false, push: false },
    event: { email: false, push: false },
    request: { email: false, push: false },
    alternative: { email: false, push: false },
};

// These are taken until the user changes their preferences in the settings
export const DEFAULT_PREFERENCES: Preferences = {
    chat: { email: true, push: true },
    survey: { email: true, push: true },
    appointment: { email: true, push: true },
    advice: { email: true, push: true },
    suggestion: { email: true, push: true },
    announcement: { email: true, push: true },
    call: { email: true, push: true },
    news: { email: true, push: true },
    event: { email: true, push: true },
    request: { email: true, push: true },
    alternative: { email: true, push: true },
};

const categories = [
    'account',
    'onboarding',
    'course',
    'certificate',
    'legacy',
    'chat',
    'survey',
    'appointment',
    'advice',
    'suggestion',
    'announcement',
    'call',
    'news',
    'event',
    'request',
    'alternative',
    'achievement',
];

export const ALL_PREFERENCES: Preferences = Object.assign(ENABLED_NOTIFICATIONS, DEFAULT_PREFERENCES);
