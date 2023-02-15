type EmailChannel = { email: boolean };
export type Preferences = { [category: Categories]: EmailChannel };
type Categories = typeof categories[number];

export const ENABLED_NOTIFICATIONS: Preferences = {
    account: { email: true },
    onboarding: { email: true },
    match: { email: true },
    course: { email: true },
    certificate: { email: true },
    legacy: { email: true },
};

export const DEFAULT_PREFERENCES: Preferences = {
    chat: { email: false },
    survey: { email: false },
    appointment: { email: false },
    advice: { email: false },
    suggestion: { email: false },
    announcement: { email: false },
    call: { email: false },
    news: { email: false },
    event: { email: false },
    request: { email: false },
    alternative: { email: false },
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
];

export const ALL_PREFERENCES: Preferences = Object.assign(ENABLED_NOTIFICATIONS, DEFAULT_PREFERENCES);
