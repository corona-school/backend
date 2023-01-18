import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getSampleContext } from './notification';
import { Notification, NotificationMessage, TranslationTemplate } from './types';
import { prisma } from '../prisma';
import { MessageTranslation, TranslationLanguage } from '../entity/MessageTranslation';
import { NotificationType } from '../entity/Notification';
import { renderTemplate } from '../../utils/helpers';

export async function getMessageForNotification(
    notificationId: number,
    language: TranslationLanguage = TranslationLanguage.DE
): Promise<NotificationMessage | null> {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        select: { type: true },
    });
    const translation = (await prisma.message_translation.findFirst({
        where: { notificationId: notificationId, language },
        select: { template: true, navigateTo: true },
    })) as unknown as Partial<MessageTranslation> | null;

    const { headline, body } = translation?.template || {};

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
    try {
        // try to render using sample context
        renderTemplate(body, sampleContext, true);
        renderTemplate(headline, sampleContext, true);
    } catch (error) {
        throw new Error(`Template does not work with provided sample context: ${error.message}`);
    }

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
