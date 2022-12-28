const categories = [
    'account',
    'onboarding',
    'match',
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

const MessageCategories = (() => {
    const result = {};
    for (const messageCategory of categories) {
        result[messageCategory] = messageCategory;
    }
    return result;
})();

export { MessageCategories };
