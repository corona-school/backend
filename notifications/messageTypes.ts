import { NotificationPreferences } from '../graphql/types/preferences';

const notificationPreferences = new NotificationPreferences();
const MessageType: { [key in keyof NotificationPreferences]: keyof NotificationPreferences } = {};
for (const messageType of Object.getOwnPropertyNames(notificationPreferences)) {
    MessageType[messageType] = messageType;
}

export { MessageType };
