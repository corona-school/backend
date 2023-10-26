import { getLogger } from '../logger/logger';

const logger = getLogger('Chat');

export function isChatFeatureActive(): boolean {
    const isActive: boolean = JSON.parse(process.env.CHAT_ACTIVE || 'false');

    if (!isActive) {
        logger.warn('Chat is deactivated');
    }

    return isActive;
}

export function assureChatFeatureActive() {
    if (!isChatFeatureActive()) {
        throw new Error(`The integrated chat is deactivated`);
    }
}
