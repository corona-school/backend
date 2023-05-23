/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { checkResponseStatus, userIdToTalkJsId } from './helper';
import { User as TalkJsUser } from 'talkjs/all';
import { User } from '../user';

dotenv.config();

const talkjsUserApiUrl = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}/users`;
const apiKey = process.env.TALKJS_API_KEY;

const createChatUser = async (user: User): Promise<void> => {
    const userId = userIdToTalkJsId(user.userID);
    try {
        const response = await fetch(`${talkjsUserApiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${user.firstname} ${user.lastname}`,
                email: [user.email],
                role: user.studentId ? 'student' : 'pupil',
            }),
        });
        await checkResponseStatus(response);
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
    const userId = userIdToTalkJsId(user.userID);
    let response;
    try {
        response = await fetch(`${talkjsUserApiUrl}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
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
