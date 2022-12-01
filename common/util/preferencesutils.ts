type Channel = {
    email: boolean;
    chat: boolean;
    whatsapp: boolean;
};

export type Preferences = {
    chat: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
    match: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
    course: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
    appointment: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
    survey: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
    news: {
        email: boolean;
        chat: boolean;
        whatsapp: boolean;
    };
};
