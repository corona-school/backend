/* eslint-disable camelcase */
import { GraphQLUser } from '../user/session';
import dotenv from 'dotenv';

dotenv.config();

const talkjsUserApiUrl = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}/conversations`;
const apiKey = process.env.TALKJS_API_KEY;

const createConversation = async (): Promise<any> => {
    // TODO: implement
};

const getUnreadConversations = async (user: GraphQLUser): Promise<any> => {
    // TODO: implement
};

async function createOneOnOneId(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function updateConversation(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function addParticipant(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function removeParticipant(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function markConversationAsReadOnly(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function markConversationAsWriteable(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

async function sendSystemMessage(user: GraphQLUser): Promise<any> {
    // TODO: implement
}

export {
    getUnreadConversations,
    createConversation,
    createOneOnOneId,
    updateConversation,
    removeParticipant,
    addParticipant,
    markConversationAsReadOnly,
    markConversationAsWriteable,
    sendSystemMessage,
};
