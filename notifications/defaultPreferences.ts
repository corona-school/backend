type EmailChannel = { email: boolean };
type Channel = { [channel: string]: boolean };
export type Preference = { [category: string]: EmailChannel };

export const DEFAULT_PREFERENCES: Preference = {
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

export const FIX_PREFERENCES: Preference = {
    account: { email: true },
    onboarding: { email: true },
    match: { email: true },
    course: { email: true },
    certificate: { email: true },
    legacy: { email: true },
};
