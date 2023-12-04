import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { checkResponseStatus, convertConversationInfosToString, createOneOnOneId, userIdToTalkJsId } from './helper';
import { User, userForPupil, userForStudent } from '../user';
import { getPupil, getStudent } from '../../graphql/util';
import { AllConversations, ChatAccess, ChatType, Conversation, ConversationInfos, SystemMessage, TJConversation } from './types';
import { getLogger } from '../logger/logger';
import assert from 'assert';
import { assureChatFeatureActive } from './util';

dotenv.config();
const logger = getLogger('Conversation');

const TALKJS_APP_ID = process.env.TALKJS_APP_ID;
const TALKJS_API_URL = `https://api.talkjs.com/v1/${TALKJS_APP_ID}`;
const TALKJS_CONVERSATION_API_URL = `${TALKJS_API_URL}/conversations`;
const TALKJS_SECRET_KEY = process.env.TALKJS_API_KEY;

export enum ConversationDirectionEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}
// adding "own" message type, since Message from 'talkjs/all' is either containing too many or too less attributes

const createConversation = async (participants: User[], conversationInfos: ConversationInfos, type: 'oneOnOne' | 'group'): Promise<string> => {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to create a conversation.`);
    assureChatFeatureActive();

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
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: body,
        });
        await checkResponseStatus(response);

        logger.info(`Created Chat with ConversationID ${conversationId}`, { conversationInfosWithParticipants, conversationId });
        return conversationId;
    } catch (error) {
        throw new Error(error);
    }
};

const getConversation = async (conversationId: string): Promise<TJConversation | undefined> => {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to get a conversation.`);
    assureChatFeatureActive();

    const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 200) {
        return await response.json();
    } else {
        return undefined;
    }
};

const getMatcheeConversation = async (matchees: { studentId: number; pupilId: number }): Promise<{ conversation: Conversation; conversationId: string }> => {
    const student = await getStudent(matchees.studentId);
    const pupil = await getPupil(matchees.pupilId);
    const studentUser = userForStudent(student);
    const pupilUser = userForPupil(pupil);
    const conversationId = createOneOnOneId(studentUser, pupilUser);
    const conversation = await getConversation(conversationId);
    return { conversation, conversationId };
};

const getAllConversations = async (direction: ConversationDirectionEnum = ConversationDirectionEnum.ASC, startingAfter?: string): Promise<AllConversations> => {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to get all conversations.`);
    assureChatFeatureActive();
    const apiURL = `${TALKJS_CONVERSATION_API_URL}?limit=30&orderBy=lastActivity&orderDirection=${direction}`;
    const apiURLPag = `${TALKJS_CONVERSATION_API_URL}?limit=30&orderBy=lastActivity&orderDirection=${direction}&startingAfter=${startingAfter}`;

    const response = await fetch(startingAfter ? apiURLPag : apiURL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        const text = await response.text();
        logger.warn(`Failed to get all conversations from TalkJS`, { status: response.status, text });
        throw new Error(`Failed to get all conversations from TalkJS`);
    }

    const result = await response.json();
    logger.info(`Got all conversations`, { result });
    return result;
};

async function getLastUnreadConversation(user: User): Promise<{ data: Conversation[] }> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to get last unread conversation.`);
    assureChatFeatureActive();

    const userId = userIdToTalkJsId(user.userID);
    try {
        const response = await fetch(`${TALKJS_API_URL}/users/${userId}/conversations?unreadsOnly=true`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
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
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to update conversation ${conversationToBeUpdated.id}.`);
    assureChatFeatureActive();

    try {
        if (!(await getConversation(conversationToBeUpdated.id))) {
            throw new Error(`Cannot update Chat(${conversationToBeUpdated.id}) as it does not exist`);
        }

        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationToBeUpdated.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(convertConversationInfosToString(conversationToBeUpdated)),
        });
        await checkResponseStatus(response);
        logger.info(`Updated Chat with ConversationID ${conversationToBeUpdated.id} `, { conversationToBeUpdated, conversationId: conversationToBeUpdated.id });
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteConversation(conversationId: string): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to delete conversation ${conversationId}.`);
    assureChatFeatureActive();

    try {
        // check if conversation exists
        await getConversation(conversationId);
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        await checkResponseStatus(response);

        logger.info(`Deleted Chat(${conversationId})`, { conversationId });
    } catch (error) {
        throw new Error(error);
    }
}

async function addParticipant(user: User, conversationId: string, chatType?: ChatType): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to add participant ${user.userID} to conversation ${conversationId}.`);
    assureChatFeatureActive();

    const userId = userIdToTalkJsId(user.userID);
    try {
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access: chatType === ChatType.NORMAL ? ChatAccess.READWRITE : ChatAccess.READ,
            }),
        });
        await checkResponseStatus(response);
        logger.info(`Added User(${user.userID}) to Chat(${conversationId})`, { userID: user.userID, conversationId, chatType });
    } catch (error) {
        throw new Error(error);
    }
}

async function removeParticipantFromCourseChat(user: User, conversationId: string): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to remove participant ${user.userID} from conversation ${conversationId}.`);
    assureChatFeatureActive();

    const userId = userIdToTalkJsId(user.userID);
    try {
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${userId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access: ChatAccess.NONE,
                notify: false,
            }),
        });
        await checkResponseStatus(response);
        logger.info(`Removed User(${user.userID}) from Chat(${conversationId})`, { conversationId, userID: user.userID });
    } catch (error) {
        throw new Error(error);
    }
}

async function markConversationAsReadOnly(conversationId: string): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to mark conversation ${conversationId} as readonly.`);
    assureChatFeatureActive();

    try {
        const conversation = await getConversation(conversationId);
        const memberIds = Object.keys(conversation.participants);

        for (const memberId of memberIds) {
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${memberId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: ChatAccess.READ,
                }),
            });
            await checkResponseStatus(response);
            logger.info(`Marked Chat(${conversationId}) as read-only`, { conversationId });
        }
    } catch (error) {
        throw new Error('Could not mark conversation as readonly.');
    }
}
async function markConversationAsReadOnlyForPupils(conversationId: string): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to mark conversation ${conversationId} as readonly for pupils.`);
    assureChatFeatureActive();

    try {
        const conversation = await getConversation(conversationId);
        const memberIds = Object.keys(conversation.participants);
        const pupilIds = memberIds.filter((memberId) => !memberId.includes('student'));

        for (const pupilId of pupilIds) {
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${pupilId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: ChatAccess.READ,
                }),
            });
            await checkResponseStatus(response);
            logger.info(`Marked Chat(${conversationId}) as read-only for Pupil(${pupilId})`, { conversationId, pupilId });
        }
    } catch (error) {
        logger.error('Could not mark conversation as readonly', error);
        throw new Error(error);
    }
}

async function markConversationAsWriteable(conversationId: string): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to mark conversation ${conversationId} as writeable.`);
    assureChatFeatureActive();

    try {
        const conversation = await getConversation(conversationId);
        const participantIds = Object.keys(conversation.participants);
        for (const participantId of participantIds) {
            const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/participants/${participantId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access: ChatAccess.READWRITE,
                }),
            });
            await checkResponseStatus(response);
            logger.info(`Marked Chat(${conversationId}) as writable for participant ${participantId}`, { conversationId });
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function sendSystemMessage(message: string, conversationId: string, type?: SystemMessage): Promise<void> {
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key found to send system message for conversation ${conversationId}.`);
    assureChatFeatureActive();

    try {
        const conversation = await getConversation(conversationId);
        const response = await fetch(`${TALKJS_CONVERSATION_API_URL}/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TALKJS_SECRET_KEY}`,
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
        logger.info(`Sent System Message to Chat(${conversationId}) - ${message}`, { conversationId, message, type });
    } catch (error) {
        throw new Error(error);
    }
}

export {
    getLastUnreadConversation,
    createConversation,
    updateConversation,
    removeParticipantFromCourseChat,
    addParticipant,
    markConversationAsReadOnly,
    markConversationAsWriteable,
    sendSystemMessage,
    getConversation,
    getMatcheeConversation,
    getAllConversations,
    deleteConversation,
    markConversationAsReadOnlyForPupils,
    TALKJS_CONVERSATION_API_URL,
    Conversation,
    ConversationInfos,
};
