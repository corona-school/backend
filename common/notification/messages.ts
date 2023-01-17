import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getSampleContext } from './notification';
import { Notification, Context, TranslationTemplate } from './types';
import { prisma } from '../prisma';

export async function getMessageForNotification(notification: Notification, context: Context): Promise<TranslationTemplate | null> {
    const { body, headline } = (
        await prisma.message_translation.findFirst({
            where: { language: 'de', notificationId: notification.id },
        })
    ).template as any as TranslationTemplate; // @TODO: is it possible to fix any?

    if (!body || !headline) {
        return null;
    }

    //return renderTemplate(template, context);

    // TODO: Render message.template with context
    throw new Error(`TODO`);
}

export async function setMessageTranslation(
    notification: Notification,
    language: MessageTranslationLanguage,
    template: TranslationTemplate,
    navigateTo?: string
): Promise<void> {
    const sampleContext = getSampleContext(notification);
    // Validate template with sample context
    //throw new Error(`Missing validation`);

    // Atomically swap the template for this (notification, language)
    await prisma.$transaction([
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.deleteMany({ where: { language, notificationId: notification.id } }),
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.create({
            data: { language, notificationId: notification.id, template: template as any, navigateTo },
        }),
    ]);
}
