import { NotificationPreferences } from '../graphql/types/preferences';

const notificationPreferences = new NotificationPreferences();

export type MessageCategory = keyof NotificationPreferences;

const MessageCategories: { [key in keyof NotificationPreferences]: MessageCategory } = {};
for (const messageType of Object.getOwnPropertyNames(notificationPreferences)) {
    MessageCategories[messageType] = messageType;
}

export { MessageCategories };
