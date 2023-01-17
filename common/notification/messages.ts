import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getSampleContext } from './notification';
import { Notification, NotificationMessage, TranslationTemplate } from './types';
import { prisma } from '../prisma';
import { TranslationLanguage } from '../entity/MessageTranslation';
import { NotificationType } from '../entity/Notification';

export async function getMessageForNotification(
    notificationId: number,
    language: TranslationLanguage = TranslationLanguage.DE
): Promise<NotificationMessage | null> {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        select: { type: true },
    });
    const translation = await prisma.message_translation.findFirst({
        where: { notificationId: notificationId, language },
        select: { template: true, navigateTo: true },
    });

    const { headline, body } = translation.template as any as TranslationTemplate; // @TODO: is it possible to fix any?

    if (!body || !headline || !notification.type) {
        return null;
    }

    return { body, headline, navigateTo: translation.navigateTo, type: notification.type as NotificationType };
}

export async function setMessageTranslation({
    notification,
    language,
    body,
    headline,
    navigateTo,
}: {
    notification: Notification;
    language: MessageTranslationLanguage;
    body: string;
    headline: string;
    navigateTo?: string;
}): Promise<void> {
    const sampleContext = getSampleContext(notification);
    // Validate template with sample context
    //throw new Error(`Missing validation`);

    // Atomically swap the template for this (notification, language)
    await prisma.$transaction([
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.deleteMany({ where: { language, notificationId: notification.id } }),
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.create({
            data: { language, notificationId: notification.id, template: { body, headline }, navigateTo },
        }),
    ]);
}
