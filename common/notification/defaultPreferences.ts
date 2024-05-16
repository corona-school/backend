type EmailChannel = { email: boolean };
export type Preferences = { [category: Categories]: EmailChannel };
type Categories = (typeof categories)[number];

// These are always enabled for all users
export const ENABLED_NOTIFICATIONS: Preferences = {
    account: { email: true },
    onboarding: { email: true },
    match: { email: true },
    course: { email: true },
    certificate: { email: true },
    legacy: { email: true },
    achievement: { email: false },
};

export const ENABLED_NEWSLETTER: Preferences = {
    chat: { email: true },
    survey: { email: true },
    appointment: { email: true },
    advice: { email: true },
    suggestion: { email: true },
    announcement: { email: true },
    call: { email: true },
    news: { email: true },
    event: { email: true },
    request: { email: true },
    alternative: { email: true },
};

export const DISABLED_NEWSLETTER: Preferences = {
    chat: { email: true },
    survey: { email: false },
    appointment: { email: true },
    advice: { email: false },
    suggestion: { email: false },
    announcement: { email: true },
    call: { email: false },
    news: { email: false },
    event: { email: false },
    request: { email: false },
    alternative: { email: false },
};

// These are taken until the user changes their preferences in the settings
export const DEFAULT_PREFERENCES: Preferences = {
    chat: { email: true },
    survey: { email: true },
    appointment: { email: true },
    advice: { email: true },
    suggestion: { email: true },
    announcement: { email: true },
    call: { email: true },
    news: { email: true },
    event: { email: true },
    request: { email: true },
    alternative: { email: true },
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
