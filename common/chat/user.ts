import dotenv from 'dotenv';
import { checkResponseStatus, userIdToTalkJsId } from './helper';
import { User as TalkJsUser } from 'talkjs/all';
import { User } from '../user';
import assert from 'assert';
import chatRetry from './retry';
import { assureChatFeatureActive } from './util';
import { getLogger } from '../logger/logger';

dotenv.config();

const logger = getLogger('Chat');

const TALKJS_APP_ID = process.env.TALKJS_APP_ID;
const TALKJS_SECRET_KEY = process.env.TALKJS_API_KEY;
const TALKJS_USER_API_URL = `https://api.talkjs.com/v1/${TALKJS_APP_ID}/users`;

const shortenLastName = (lastname: string) => {
    if (lastname.length > 0) {
        return lastname.charAt(0).concat('.');
    }
    return '';
};

const getChatName = (user: User) => {
    if (user.pupilId) {
        return `${user.firstname} ${shortenLastName(user.lastname)}`;
    }
    return `${user.firstname} ${user.lastname}`;
};

const createChatUser = async (user: User): Promise<void> => {
    assert(TALKJS_SECRET_KEY, `No secret key found to create chat user ${user.userID} `);
    assureChatFeatureActive();

    const userId = userIdToTalkJsId(user.userID);
    const userName = getChatName(user);
    try {
        const response = await chatRetry(
            async () =>
                await fetch(`${TALKJS_USER_API_URL}/${userId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: userName,
                        email: [user.email],
                        role: user.studentId ? 'student' : 'pupil',
                    }),
                }),
            3,
            1000
        );
        await checkResponseStatus(response);
        logger.info(`Created ChatUser for User(${user.userID})`);
    } catch (error) {
        throw new Error(error);
    }
};
/**
 * NOTE: `id` ist not the same as `userId` as TalkJS' id field must not contain slashes! It's a transformed version, e.g.
 *
 * `{ userId: 'student/1' }` <--> `{ id: 'student_1' }`
 *
 * Use the helper `parseSlashToUnderscore` and `parseUnderscoreToSlash` to transform the ID to the wanted outcome
 */
async function getChatUser(user: User): Promise<TalkJsUser> {
    assert(TALKJS_APP_ID, `No TalkJS app ID found to get chat user ${user.userID}`);
    assert(TALKJS_SECRET_KEY, `No secret key found to get chat user ${user.userID}`);
    assureChatFeatureActive();

    const userId = userIdToTalkJsId(user.userID);
    let response;
    try {
        response = await fetch(`${TALKJS_USER_API_URL}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw new Error(error);
    }

    if (response.status === 200) {
        return await response.json();
    } else {
        return undefined;
    }
}

async function getOrCreateChatUser(user: User): Promise<TalkJsUser> {
    let chatUser: TalkJsUser;
    chatUser = await getChatUser(user);

    if (!chatUser) {
        await createChatUser(user);
        chatUser = await getChatUser(user);
    }

    return chatUser;
}

export { createChatUser, getChatUser, getOrCreateChatUser };
