/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { checkResponseStatus, userIdToTalkJsId } from './helper';
import { Message } from 'talkjs/all';
import { User } from '../user';
import { createHmac } from 'crypto';

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

type CustomProps = {
    start?: string;
    type: 'course' | 'match' | 'announcement' | 'participant' | 'prospect';
    finished?: 'match_dissolved' | 'course_over';
};

type Conversation = {
    id: string;
    subject?: string;
    topicId?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom?: CustomProps;
    lastMessage?: LastMessage;
    participants: {
        [id: string]: { access: 'ReadWrite' | 'Read'; notify: boolean };
    };
    createdAt: number;
};

type ConversationInfos = {
    subject?: string;
    photoUrl?: string;
    welcomeMessages?: string[];
    custom: CustomProps;
};

const createConversation = async (participants: User[], conversationInfos: ConversationInfos): Promise<string> => {
    let conversationId;
    const { type } = conversationInfos.custom;
    switch (type) {
        case 'match':
        case 'participant':
        case 'prospect':
            conversationId = createOneOnOneId(participants[0], participants[1]);
            break;
        case 'course':
        case 'announcement':
            conversationId = uuidv4();
            break;
        default:
            throw new Error(`No matching case for conversationType found: ${type}`);
    }

    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...conversationInfos,
                participants: participants.map((participant: User) => userIdToTalkJsId(participant.userID)),
            }),
        });
        await checkResponseStatus(response);
        return conversationId;
    } catch (error) {
        throw new Error(error);
    }
};

const getConversation = async (conversationId: string): Promise<Conversation> => {
    let response;
    try {
        response = await fetch(`${talkjsConversationApiUrl}/${conversationId}`, {
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
};

const getOrCreateConversation = async (participants: User[], conversationInfos?: ConversationInfos, conversationId?: string): Promise<Conversation> => {
    let conversation: Conversation;
    if (conversationId) {
        conversation = await getConversation(conversationId);
    }
    if (!conversationId || conversation === undefined) {
        const newConversationId = await createConversation(participants, conversationInfos);
        conversation = await getConversation(newConversationId);
    }
    return conversation;
};

async function getLastUnreadConversation(user: User): Promise<{ data: Conversation[] }> {
    const userId = userIdToTalkJsId(user.userID);
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

function createOneOnOneId(userA: User, userB: User): string {
    const key = process.env.TALKJS_API_KEY;
    const userIds = JSON.stringify([userA.userID, userB.userID]);
    const hashedOneToOneId = createHmac('sha256', key).update(userIds).digest('hex');
    return hashedOneToOneId;
}

/**
 * NOTE: PUT merges data with existing data, if any. For example, you cannot remove participants from a conversation by PUTing a list of participants that excludes some existing participants. If you want to remove participants from a conversation, use `removeParticipant`.
 */
async function updateConversation(conversationToBeUpdated: { id: string } & ConversationInfos): Promise<any> {
    try {
        // check if conversation exists
        await getConversation(conversationToBeUpdated.id);
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationToBeUpdated.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...conversationToBeUpdated }),
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

async function addParticipant(user: User, conversationId: string): Promise<void> {
    const userId = userIdToTalkJsId(user.userID);
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

async function removeParticipant(user: User, conversationId: string): Promise<void> {
    const userId = userIdToTalkJsId(user.userID);
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
    getOrCreateConversation,
    deleteConversation,
    talkjsConversationApiUrl,
    Conversation,
    ConversationInfos,
};
