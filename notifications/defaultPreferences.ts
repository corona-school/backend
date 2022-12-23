import { NotificationPreferences } from '../graphql/types/preferences';

export const DEFAULT_PREFERENCES: NotificationPreferences = {
    chat: { email: true },
    match: { email: true },
    course: { email: true },
    appointment: { email: true },
    survey: { email: true },
    news: { email: true },
    newsletter: { email: false },
    training: { email: false },
    events: { email: false },
    newsoffer: { email: false },
    request: { email: false },
    learnoffer: { email: false },
    alternativeoffer: { email: false },
    feedback: { email: false },
};
