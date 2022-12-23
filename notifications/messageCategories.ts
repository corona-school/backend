import { NotificationPreferences } from '../graphql/types/preferences';

export type MessageCategory = keyof NotificationPreferences;

const categories: MessageCategory[] = [
    'chat',
    'match',
    'course',
    'appointment',
    'survey',
    'news',
    'newsletter',
    'training',
    'events',
    'newsoffer',
    'request',
    'learnoffer',
    'alternativeoffer',
    'feedback',
];

type MessageCategoriesMapping = { [key in MessageCategory]: MessageCategory };
const MessageCategories: MessageCategoriesMapping = (() => {
    const result = {};
    for (const messageCategory of categories) {
        result[messageCategory] = messageCategory;
    }
    return result as MessageCategoriesMapping;
})();

export { MessageCategories };
