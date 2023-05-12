/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { checkResponseStatus, parseSlashToUnderscore } from './helper';
import { User as TalkJsUser } from 'talkjs/all';
import { User } from '../user';

dotenv.config();

const talkjsUserApiUrl = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}/users`;
const apiKey = process.env.TALKJS_API_KEY;

const createChatUser = async (user: User): Promise<void> => {
    const userId = parseSlashToUnderscore(user.userID);
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
 * NOTE: `id` ist not the same as `userId`! It's a transformed version, e.g.
 *
 * `{ userId: 'student/1' }` <--> `{ id: 'student_1' }`
 *
 * Use the helper `parseSlashToUnderscore` and `parseUnderscoreToSlash` to transform the ID to the wanted outcome
 */
async function getChatUser(user: User): Promise<TalkJsUser> {
    const userId = parseSlashToUnderscore(user.userID);
    try {
        const response = await fetch(`${talkjsUserApiUrl}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        await checkResponseStatus(response);
        return response.json();
    } catch (error) {
        throw new Error(error);
    }
}

export { createChatUser, getChatUser };
