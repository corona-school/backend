import { getLogger } from '../logger/logger';

const logger = getLogger('Chat');

async function chatRetry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            logger.info('Chat Retry ' + error.message, { error });
            await new Promise((resolve) => setTimeout(resolve, delay));
            return chatRetry(fn, retries - 1, delay);
        } else {
            throw error;
        }
    }
}

export default chatRetry;
