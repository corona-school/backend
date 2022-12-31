import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getNotification, getSampleContext } from './notification';
import { ConcreteNotification, Notification, Context } from './types';
import { prisma } from '../prisma';

type Template = string;

export interface MessageTemplate {
    headline: Template;
    body: Template;
    navigateTo?: Template;
}

export interface NotificationMessage {
    headline: string;
    body: string;
    navigateTo?: string;

    // TODO: Can we move to notification.type in the frontend?
    messageType: string;

    // TODO: Needed? Isn't this done in frontend?
    isUrlExternal?: boolean;
    // TODO: Needed?
    error?: string;
}

export async function getMessageForNotification(notification: Notification, context: Context): Promise<NotificationMessage | null> {
    const message = await prisma.message_translation.findFirst({
        where: { language: 'de', notificationId: notification.id },
    });

    if (!message) {
        return null;
    }

    const template = message.template as unknown as MessageTemplate;

    // TODO: Render message.template with context
    throw new Error(`TODO`);
}

export async function setMessageTranslation(notification: Notification, language: MessageTranslationLanguage, template: MessageTemplate) {
    const sampleContext = getSampleContext(notification);
    // Validate template with sample context
    throw new Error(`Missing validation`);

    // Atomically swap the template for this (notification, language)
    await prisma.$transaction([
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.deleteMany({ where: { language, notificationId: notification.id } }),
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.create({
            data: { language, notificationId: notification.id, template: template as any },
        }),
    ]);
}
