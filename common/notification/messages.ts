import { message_translation_language_enum as MessageTranslationLanguage } from '@prisma/client';
import { getSampleContext } from './notification';
import { ConcreteNotification, Notification, NotificationContext, NotificationMessage } from './types';
import { prisma } from '../prisma';
import { MessageTranslation, TranslationLanguage } from '../entity/MessageTranslation';
import { NotificationType } from '../entity/Notification';
import { compileTemplate, renderTemplate } from '../../utils/helpers';
import { ClientError } from '../util/error';
import { NotificationMessageType } from '../../graphql/types/notificationMessage';
import { getContext } from '.';
import { getUser } from '../user';
import { getLogger } from '../logger/logger';

const logger = getLogger('Message');

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

type CachedMessageTemplate = {
    type: NotificationType;
    body: (context: NotificationContext) => string;
    headline: (context: NotificationContext) => string;
    navigateTo?: (context: NotificationContext) => string;
    modalText?: (context: NotificationContext) => string;
};

const cachedTemplates = new Map</* notification id + language */ string, CachedMessageTemplate | null /* = no message */>();

async function loadTemplate(notificationID: number, language: TranslationLanguage): Promise<CachedMessageTemplate | null> {
    const cacheKey = notificationID + ':' + language;

    if (cachedTemplates.has(cacheKey)) {
        logger.debug(`Got Message for Notification(${notificationID}) from cache`);
        return cachedTemplates.get(cacheKey);
    }

    const message = await getMessageForNotification(notificationID, language);

    if (!message) {
        cachedTemplates.set(cacheKey, null);
        return null;
    }

    const { type, headline, body, modalText, navigateTo } = message;

    const template = {
        type,
        body: compileTemplate(body),
        headline: compileTemplate(headline),
        navigateTo: navigateTo ? compileTemplate(navigateTo) : undefined,
        modalText: modalText ? compileTemplate(modalText) : undefined,
    };

    cachedTemplates.set(cacheKey, template);
    logger.info(`Loaded Message for Notification(${notificationID}) into cache`);
    return template;
}

// Renders a Message for a certain Concrete Notification
export async function getMessage(
    concreteNotification: ConcreteNotification,
    language: TranslationLanguage = TranslationLanguage.DE
): Promise<NotificationMessageType | null> {
    const template = await loadTemplate(concreteNotification.notificationID, language);
    if (!template) {
        return null;
    }

    const user = await getUser(concreteNotification.userId);
    const context = getContext(concreteNotification.context as NotificationContext, user);

    let headline = '';
    try {
        headline = template.headline(context);
    } catch (error) {
        logger.error(
            `Failed to render Headline Template of Notification(${concreteNotification.notificationID}) for ConcreteNotification(${concreteNotification.id})`,
            {
                context,
                error,
            }
        );
    }

    let body = '';
    try {
        body = template.body(context);
    } catch (error) {
        logger.error(
            `Failed to render Body Template of Notification(${concreteNotification.notificationID}) for ConcreteNotification(${concreteNotification.id})`,
            {
                context,
                error,
            }
        );
    }

    let navigateTo: string | undefined;
    try {
        if (template.navigateTo) {
            navigateTo = template.navigateTo(context);
        }
    } catch (error) {
        logger.error(
            `Failed to render Headline Template of Notification(${concreteNotification.notificationID}) for ConcreteNotification(${concreteNotification.id})`,
            {
                context,
                error,
            }
        );
    }

    let modalText: string | undefined;
    try {
        if (template.modalText) {
            modalText = template.modalText(context);
        }
    } catch (error) {
        logger.error(
            `Failed to render Modal Text Template of Notification(${concreteNotification.notificationID}) for ConcreteNotification(${concreteNotification.id})`,
            {
                context,
                error,
            }
        );
    }

    return {
        type: template.type,
        headline,
        body,
        navigateTo,
        modalText,
    };
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

    if (navigateTo) {
        try {
            renderTemplate(navigateTo, sampleContext, true);
        } catch (error) {
            abortWithError(error, 'navigateTo', navigateTo);
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

    cachedTemplates.delete(notification.id + ':' + language);
    logger.info(`Updated Message for Notification(${notification.id}, invalidated cache`, { language, headline, body, modalText, navigateTo });
}
