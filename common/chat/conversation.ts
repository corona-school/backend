/* eslint-disable camelcase */
import { GraphQLUser } from '../user/session';
import dotenv from 'dotenv';
import { checkResponseStatus, parseSlashToUnderscore } from './helper';
import { Message } from 'talkjs/all';
import Talk from 'talkjs';

dotenv.config();

const talkjsApiUrl = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}`;
const talkjsConversationApiUrl = `${talkjsApiUrl}/conversations`;
const apiKey = process.env.TALKJS_API_KEY;

// adding "own" message type, since Message from 'talkjs/all' is either containing too many or too less attributes
type LastMessage = {
    attachment: Message['attachment'];
    conversationId: string;
    createdAt: number;
    custom: Message['custom'];
    id: Message['id'];
    senderId: Message['senderId'];
    text: string;
    type: Message['type'];
};

type Conversation = {
    id: string;
    subject?: string;
    topicId?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom?: { [name: string]: string };
    lastMessage?: LastMessage;
    participants: {
        [id: string]: { access: 'ReadWrite' | 'Read'; notify: boolean };
    };
    createdAt: number;
};

enum ContactReason {
    MATCH,
    SUBCOURSE,
}

const createConversation = async (participants: Array<GraphQLUser>, conversationType: ContactReason, subject?: string, photoUrl?: string): Promise<string> => {
    let conversationId;
    switch (conversationType) {
        case ContactReason.MATCH:
            conversationId = createOneOnOneId(participants[0], participants[1]);
            break;
        case ContactReason.SUBCOURSE:
            conversationId = 'dev-test';
            break;
        default:
            throw new Error(`No matching case for conversationType found: ${conversationType}`);
    }

    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participants: participants.map((participant: GraphQLUser) => parseSlashToUnderscore(participant.userID)),
                subject,
                photoUrl,
            }),
        });
        await checkResponseStatus(response);
        return conversationId;
    } catch (error) {
        throw new Error(error);
    }
};

const getConversation = async (conversationId: string): Promise<Conversation> => {
    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
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
};

async function getLastUnreadConversation(user: GraphQLUser): Promise<{ data: Conversation[] }> {
    const userId = parseSlashToUnderscore(user.userID);
    try {
        const response = await fetch(`${talkjsApiUrl}/users/${userId}/conversations?unreadsOnly=true`, {
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

function createOneOnOneId(userA: GraphQLUser, userB: GraphQLUser): string {
    return Talk.oneOnOneId(parseSlashToUnderscore(userA.userID), parseSlashToUnderscore(userB.userID));
}

/**
 * NOTE: PUT merges data with existing data, if any. For example, you cannot remove participants from a conversation by PUTing a list of participants that excludes some existing participants. If you want to remove participants from a conversation, use `removeParticipant`.
 */
async function updateConversation(participants: Array<GraphQLUser>, conversationId: string, subject?: string, photoUrl?: string): Promise<any> {
    try {
        // check if conversation exists
        await getConversation(conversationId);
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participants: participants.map((participant: GraphQLUser) => parseSlashToUnderscore(participant.userID)),
                subject,
                photoUrl,
            }),
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteConversation(conversationId: string): Promise<void> {
    try {
        // check if conversation exists
        await getConversation(conversationId);
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

async function addParticipant(user: GraphQLUser, conversationId: string): Promise<void> {
    const userId = parseSlashToUnderscore(user.userID);
    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/participants/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

async function removeParticipant(user: GraphQLUser, conversationId: string): Promise<void> {
    const userId = parseSlashToUnderscore(user.userID);
    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/participants/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

async function markConversationAsReadOnly(conversationId: string): Promise<void> {
    try {
        const conversation = await getConversation(conversationId);
        const participantIds = Object.keys(conversation.participants);
        for (const participantId of participantIds) {
            const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/participants/${participantId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: 'Read',
                }),
            });
            await checkResponseStatus(response);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function markConversationAsWriteable(conversationId: string): Promise<void> {
    try {
        const conversation = await getConversation(conversationId);
        const participantIds = Object.keys(conversation.participants);
        for (const participantId of participantIds) {
            const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/participants/${participantId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: 'ReadWrite',
                }),
            });
            await checkResponseStatus(response);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function sendSystemMessage(message: string, conversationId: string): Promise<void> {
    try {
        // check if conversation exists
        const conversation = await getConversation(conversationId);
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
                type: 'SystemMessage',
            }),
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

export {
    getLastUnreadConversation,
    createConversation,
    createOneOnOneId,
    updateConversation,
    removeParticipant,
    addParticipant,
    markConversationAsReadOnly,
    markConversationAsWriteable,
    sendSystemMessage,
    getConversation,
    deleteConversation,
    talkjsConversationApiUrl,
    Conversation,
    ContactReason,
};
