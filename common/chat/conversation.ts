/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { checkResponseStatus, convertConversationInfosToString, convertTJConversation, createOneOnOneId, getConversationId, userIdToTalkJsId } from './helper';
import { Message } from 'talkjs/all';
import { User, getUser } from '../user';
import { getOrCreateChatUser } from './user';
import { prisma } from '../prisma';
import { AccessRight, ContactReason, Conversation, ConversationInfos, TJConversation } from './types';
import { getMyContacts } from './contacts';

dotenv.config();

const TALKJS_API_URL = `https://api.talkjs.com/v1/${process.env.TALKJS_APP_ID}`;
const TALKJS_CONVERSATION_API_URL = `${TALKJS_API_URL}/conversations`;
const TALKJS_API_KEY = process.env.TALKJS_API_KEY;

// adding "own" message type, since Message from 'talkjs/all' is either containing too many or too less attributes

const createConversation = async (participants: User[], conversationInfos: ConversationInfos, type: 'oneOnOne' | 'group'): Promise<string> => {
    let conversationId: string;
    switch (type) {
        case 'oneOnOne':
            conversationId = createOneOnOneId(participants[0], participants[1]);
            break;
        case 'group':
            conversationId = uuidv4();
            break;
        default:
            throw new Error(`No matching case for conversationType found: ${type}`);
    }

    const conversationInfosWithParticipants = {
        ...convertConversationInfosToString(conversationInfos),
        participants: participants.map((participant: User) => userIdToTalkJsId(participant.userID)),
    };

    try {
        const body = JSON.stringify(conversationInfosWithParticipants);
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: body,
        });
        await checkResponseStatus(response);
        return conversationId;
    } catch (error) {
        throw new Error(error);
    }
};

const getConversation = async (conversationId: string): Promise<TJConversation | undefined> => {
    const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TALKJS_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return undefined;
    }
};

async function getLastUnreadConversation(user: User): Promise<{ data: Conversation[] }> {
    const userId = userIdToTalkJsId(user.userID);
    try {
        const response = await fetch(`${TALKJS_API_URL}/users/${userId}/conversations?unreadsOnly=true`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        await checkResponseStatus(response);
        return response.json();
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * NOTE: PUT merges data with existing data, if any. For example, you cannot remove participants from a conversation by PUTing a list of participants that excludes some existing participants. If you want to remove participants from a conversation, use `removeParticipant`.
 */
async function updateConversation(conversationToBeUpdated: { id: string } & ConversationInfos): Promise<any> {
    try {
        // TODO: This does not check anything!
        await getConversation(conversationToBeUpdated.id);
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationToBeUpdated.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(convertConversationInfosToString(conversationToBeUpdated)),
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
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
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
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
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
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
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
        const memberIds = Object.keys(conversation.participants);

        for (const memberId of memberIds) {
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${memberId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: AccessRight.READ,
                }),
            });
            await checkResponseStatus(response);
        }
    } catch (error) {
        throw new Error('Could not mark conversation as readonly.');
    }
}
async function markConversationAsReadOnlyForPupils(conversationId: string): Promise<void> {
    try {
        const conversation = await getConversation(conversationId);
        const memberIds = Object.keys(conversation.participants);
        const pupilIds = memberIds.filter((memberId) => !memberId.includes('student'));

        for (const pupilId of pupilIds) {
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${pupilId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: AccessRight.READ,
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
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${participantId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: AccessRight.READ_WRITE,
                }),
            });
            await checkResponseStatus(response);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function sendSystemMessage(message: string, conversationId: string, type?: string): Promise<void> {
    try {
        // check if conversation exists
        const conversation = await getConversation(conversationId);
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TALKJS_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    text: message,
                    type: 'SystemMessage',
                    ...(type && {
                        custom: {
                            type: type,
                        },
                    }),
                },
            ]),
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }
}

export {
    getLastUnreadConversation,
    createConversation,
    updateConversation,
    removeParticipant,
    addParticipant,
    markConversationAsReadOnly,
    markConversationAsWriteable,
    sendSystemMessage,
    getConversation,
    deleteConversation,
    markConversationAsReadOnlyForPupils,
    TALKJS_CONVERSATION_API_URL,
    Conversation,
    ConversationInfos,
};
