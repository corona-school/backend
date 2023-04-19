import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getSampleContext } from './notification';
import { Notification, NotificationMessage } from './types';
import { prisma } from '../prisma';
import { MessageTranslation, TranslationLanguage } from '../entity/MessageTranslation';
import { NotificationType } from '../entity/Notification';
import { renderTemplate } from '../../utils/helpers';
import { ClientError } from '../util/error';

export async function getMessageForNotification(
    notificationId: number,
    language: TranslationLanguage = TranslationLanguage.DE
): Promise<NotificationMessage | null> {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        select: { type: true },
    });

    if (!notification || !notification.type) {
        return null;
    }

    const translation = (await prisma.message_translation.findFirst({
        where: { notificationId: notificationId, language },
        select: { template: true, navigateTo: true },
    })) as unknown as Partial<MessageTranslation> | null;

    if (!translation || !translation.template) {
        return null;
    }

    const { headline, body, modalText } = translation.template;

    if (!body || !headline) {
        return null;
    }

    if (!modalText) {
        return { body, headline, navigateTo: translation.navigateTo, type: notification.type as NotificationType };
    }

    return { body, headline, modalText, navigateTo: translation.navigateTo, type: notification.type as NotificationType };
}

export async function setMessageTranslation({
    notification,
    language,
    body,
    headline,
    modalText,
    navigateTo,
}: {
    notification: Notification;
    language: MessageTranslationLanguage;
    body: string;
    headline: string;
    modalText?: string;
    navigateTo?: string;
}): Promise<void> {
    const sampleContext = getSampleContext(notification);

    function abortWithError(error: any, field: string, template: string) {
        console.log(error);
        if (error.lineNumber && error.column && error.endColumn) {
            const line = template.split('\n')[error.lineNumber - 1];
            const region = line.slice(Math.max(0, error.column - 10), Math.min(line.length, error.endColumn + 10));
            throw new ClientError(
                'Invalid Template',
                `Invalid Template for Field ${field}:\n` +
                    `${error.message}\n\n` +
                    `${region}\n` +
                    `${' '.repeat(Math.min(10, error.column))}${'^'.repeat(error.endColumn - error.column)}\n\n` +
                    `sample context:\n` +
                    `${JSON.stringify(sampleContext, null, 2)}`
            );
        }

        throw new Error(`Unexpected error occured when rendering ${field}: ${error.message} - sample context: ${JSON.stringify(sampleContext)}`);
    }

    try {
        renderTemplate(body, sampleContext, true);
    } catch (error) {
        abortWithError(error, 'body', body);
    }

    try {
        renderTemplate(headline, sampleContext, true);
    } catch (error) {
        abortWithError(error, 'headline', headline);
    }

    if (modalText) {
        try {
            renderTemplate(modalText, sampleContext, true);
        } catch (error) {
            abortWithError(error, 'modalText', modalText);
        }
    }

    // Atomically swap the template for this (notification, language)
    await prisma.$transaction([
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.deleteMany({ where: { language, notificationId: notification.id } }),
        // eslint-disable-next-line lernfair-lint/prisma-laziness
        prisma.message_translation.create({
            data: { language, notificationId: notification.id, template: { body, headline, modalText }, navigateTo },
        }),
    ]);
}
