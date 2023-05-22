import { User } from '../user';
import { getOrCreateChatUser } from './user';

const userIdToTalkJsId = (userId: string): string => {
    return userId.replace('/', '_');
};

const parseUnderscoreToSlash = (id: string): string => {
    return id.replace('_', '/');
};

const checkResponseStatus = async (response: Response): Promise<void> => {
    if (response.status !== 200) {
        const errorMessage = await response.json();
        throw new Error(`Request failed, due to ${JSON.stringify(errorMessage)}`);
    }
};

const createChatSignature = async (user: User): Promise<string> => {
    const userId = (await getOrCreateChatUser(user)).id;
    const crypto = require('crypto');
    const key = process.env.TALKJS_API_KEY;
    const hash = crypto.createHmac('sha256', key).update(userIdToTalkJsId(userId));
    return hash.digest('hex');
};

export { userIdToTalkJsId, parseUnderscoreToSlash, checkResponseStatus, createChatSignature };
