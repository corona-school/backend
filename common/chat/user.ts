/* eslint-disable camelcase */
import { GraphQLUser } from '../user/session';
import dotenv from 'dotenv';
import { checkResponseStatus, parseSlashToUnderscore } from './helper';

dotenv.config();

/**
 * NOTE: `id` ist not the same as `userId`! It's a transformed version, e.g.
 *
 * `{ userId: 'student/1' }` <--> `{ id: 'student_1' }`
 *
 * Use the helper `parseSlashToUnderscore` and `parseUnderscoreToSlash` to transform the ID to the wanted outcome
 */
type TalkJsUser = {
    id: string;
    name: string;
    welcomeMessage?: string;
    photoUrl?: string;
    headerPhotoUrl?: string;
    role?: string;
    email?: string[] | null;
    phone?: string[] | null;
    custom?: { [name: string]: string };
    availabilityText?: string;
    locale?: string;
    createdAt: number;
    pushTokens: { [token_id: string]: true | null } | null;
};

const talkjsUserApiUrl = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}/users`;
const apiKey = process.env.TALKJS_API_KEY;

const getAppInfo = async (): Promise<any> => {
    try {
        const response = await fetch(`https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    } catch (error) {
        throw new Error(error);
    }
};

const createChatUser = async (user: GraphQLUser): Promise<void> => {
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
            }),
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
};

async function getChatUser(user: GraphQLUser): Promise<TalkJsUser> {
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

export { createChatUser, getChatUser, getAppInfo, TalkJsUser };
