/* eslint-disable camelcase */
import { GraphQLUser } from '../user/session';
import dotenv from 'dotenv';

dotenv.config();

type TalkJsUser = {
    name: string;
    email: Array<string>;
    welcomeMessage?: string;
    photoUrl?: string;
    role?: string;
    phone?: Array<string>;
    custom?: Map<string, string>;
    pushTokens?: Map<string, true | null> | null;
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

const createChatUser = async (user: GraphQLUser): Promise<any> => {
    try {
        const createdUser = await fetch(talkjsUserApiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'custCreate',
                user_info: {
                    email: user.email,
                    type: 1,
                    first_name: user.firstname,
                    last_name: user.lastname,
                    display_name: `${user.firstname} ${user.lastname}`,
                },
            }),
        });

        return createdUser.json();
    } catch (error) {
        throw new Error(error);
    }
};

async function getChatUser(user: GraphQLUser): Promise<any> {
    try {
        const response = await fetch(`${talkjsUserApiUrl}/${user.email}`, {
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
}

export { createChatUser, getChatUser, getAppInfo, TalkJsUser };
