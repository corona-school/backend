type EmailChannel = { email: boolean };
type Channel = { [channel: string]: boolean };
export type Preference = { [category: string]: EmailChannel };

export const DEFAULT_PREFERENCES: Preference = {
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

export const FIX_PREFERENCES: Preference = {
    account: { email: true },
    onboarding: { email: true },
    match: { email: true },
    course: { email: true },
    certificate: { email: true },
    legacy: { email: true },
};
