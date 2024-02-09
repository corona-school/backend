import { User } from '../user';
import { ChatMetaData, ContactReason, Conversation, ConversationInfos, FinishedReason, SystemMessage, TJConversation } from './types';
import { checkChatMembersAccessRights, convertTJConversation, createOneOnOneId, userIdToTalkJsId } from './helper';
import { createConversation, getConversation, markConversationAsWriteable, sendSystemMessage, updateConversation } from './conversation';
import { getOrCreateChatUser } from './user';
import { prisma } from '../prisma';
import { getMyContacts } from './contacts';
import systemMessages from './localization';
import { getLogger } from '../logger/logger';
import assert from 'assert';
import { createHmac } from 'crypto';

const logger = getLogger('Chat');
const getOrCreateOneOnOneConversation = async (
    participants: [User, User],
    conversationInfos: ConversationInfos,
    reason: ContactReason,
    subcourseId?: number
): Promise<Conversation> => {
    await ensureChatUsersExist(participants);

    const participantsConversationId = createOneOnOneId(participants[0], participants[1]);
    const participantsConversation = await getConversation(participantsConversationId);

    if (participantsConversation) {
        const { readMembers } = checkChatMembersAccessRights(participantsConversation);
        const isChatReadOnly = readMembers.length > 0;

        if (isChatReadOnly) {
            const update = {
                id: participantsConversationId,
                custom: {
                    finished: FinishedReason.REACTIVATE,
                },
            };

            await markConversationAsWriteable(participantsConversationId);
            await sendSystemMessage(systemMessages.de.reactivated, participantsConversationId, SystemMessage.ONE_ON_ONE_REACTIVATE);
            await updateConversation(update);
        }
    }

    if (participantsConversation) {
        await handleExistingConversation(participantsConversationId, reason, subcourseId, participantsConversation, conversationInfos);
    } else {
        const newConversationId = await createConversation(participants, conversationInfos, 'oneOnOne');
        const newConversation = await getConversation(newConversationId);

        const convertedConversation = convertTJConversation(newConversation);
        logger.info(`One-on-one conversation was created with ID ${convertedConversation.id} `);

        return convertedConversation;
    }

    const convertedParticipantsConversation = convertTJConversation(participantsConversation);
    return convertedParticipantsConversation;
};

async function ensureChatUsersExist(participants: [User, User] | User[]): Promise<void> {
    await Promise.all(
        participants.map(async (participant) => {
            await getOrCreateChatUser(participant);
        })
    );
}

const createChatSignature = async (user: User): Promise<string> => {
    const TALKJS_SECRET_KEY = process.env.TALKJS_API_KEY;
    assert(TALKJS_SECRET_KEY, `No TalkJS secret key to create a chat signature for user ${user.userID}.`);
    const userId = (await getOrCreateChatUser(user)).id;
    const key = TALKJS_SECRET_KEY;
    const hash = createHmac('sha256', key).update(userIdToTalkJsId(userId));
    return hash.digest('hex');
};

async function handleExistingConversation(
    conversationId: string,
    reason: ContactReason,
    subcourseId: number | undefined,
    conversation: TJConversation,
    conversationInfos: ConversationInfos
): Promise<void> {
    if (reason === ContactReason.MATCH) {
        await updateMatchConversation(conversationId, conversationInfos.custom.match);
    } else if (reason === ContactReason.PARTICIPANT) {
        await updateParticipantConversation(conversationId, subcourseId, conversation);
    } else if (reason === ContactReason.PROSPECT) {
        await updateProspectConversation(conversationId, subcourseId, conversation);
    } else if (reason === ContactReason.CONTACT) {
        await updateContactConversation(conversationId, conversationInfos);
    }
}

async function updateMatchConversation(conversationId: string, match: ChatMetaData['match']): Promise<void> {
    const updatedConversation = {
        id: conversationId,
        custom: {
            match: match,
        },
    };

    logger.info(`Existing match conversation ${conversationId} was updated for match ${match.matchId}.`);

    await updateConversation(updatedConversation);
}

async function updateParticipantConversation(conversationId: string, subcourseId: number | undefined, conversation: TJConversation): Promise<void> {
    const subcoursesFromConversation = conversation?.custom.subcourse;
    let subcourseIds = [];

    subcourseIds = JSON.parse(subcoursesFromConversation || '[]');

    const updatedSubcourses: number[] = [...subcourseIds, subcourseId];
    const returnUpdatedSubcourses = Array.from(new Set(updatedSubcourses));

    const updatedConversation = {
        id: conversationId,
        custom: {
            subcourse: returnUpdatedSubcourses,
        },
    };

    logger.info(`Existing course participant conversation ${conversationId} was updated for subcourse ${subcourseId}.`);

    await updateConversation(updatedConversation);
}

async function updateProspectConversation(conversationId: string, subcourseId: number | undefined, conversation: TJConversation): Promise<void> {
    const prospectSubcoursesFromConversation = conversation?.custom.prospectSubcourse;
    let prospectSubcourseIds = [];

    prospectSubcourseIds = JSON.parse(prospectSubcoursesFromConversation || '[]');

    const updatedProspectSubcourse: number[] = [...prospectSubcourseIds, subcourseId];
    const returnUpdatedProspectSubcourses = Array.from(new Set(updatedProspectSubcourse));

    const updatedConversation = {
        id: conversationId,
        custom: {
            prospectSubcourse: returnUpdatedProspectSubcourses,
        },
    };

    logger.info(`Existing prospect conversation ${conversationId} was updated for subcourse ${subcourseId}.`);

    await updateConversation(updatedConversation);
}

async function updateContactConversation(conversationId: string, conversationInfos: ConversationInfos): Promise<void> {
    const updatedConversation = {
        id: conversationId,
        ...conversationInfos,
    };

    logger.info(`Existing contact conversation ${conversationId} was updated.`);

    await updateConversation(updatedConversation);
}

const getOrCreateGroupConversation = async (participants: User[], subcourseId: number, conversationInfos: ConversationInfos): Promise<Conversation> => {
    await ensureChatUsersExist(participants);

    const subcourse = await prisma.subcourse.findUniqueOrThrow({
        where: { id: subcourseId },
        select: { conversationId: true },
    });

    if (subcourse.conversationId === null) {
        const newConversationId = await createConversation(participants, conversationInfos, 'group');
        const newConversation = await getConversation(newConversationId);
        await sendSystemMessage(systemMessages.de.groupChat, newConversationId, SystemMessage.FIRST);

        await prisma.subcourse.update({
            where: { id: subcourseId },
            data: { conversationId: newConversationId },
        });
        const convertedConversation = convertTJConversation(newConversation);
        logger.info(`Group conversation was created with ID ${convertedConversation.id} `);

        return convertedConversation;
    }

    const subcourseGroupChat = await getConversation(subcourse.conversationId);
    const convertedSubcourseGroupChatConversation = convertTJConversation(subcourseGroupChat);

    return convertedSubcourseGroupChatConversation;
};

async function createContactChat(meUser: User, contactUser: User): Promise<string> {
    const myContacts = await getMyContacts(meUser);
    const contact = myContacts.find((c) => c.user.userID === contactUser.userID);

    if (!contact) {
        throw new Error('Chat contact not found');
    }

    const conversationInfos: ConversationInfos = {
        welcomeMessages: [systemMessages.de.oneOnOne],
        custom: {
            createdBy: meUser.userID,
            ...(contact.match && { match: { matchId: contact.match.matchId } }),
            ...(contact.subcourse && { subcourse: [...new Set(contact.subcourse)] }),
        },
    };

    const conversation = await getOrCreateOneOnOneConversation([meUser, contactUser], conversationInfos, ContactReason.CONTACT);
    logger.info(`Contact conversation was created by ${meUser} with ${contactUser} with ID ${conversation.id} `);
    return conversation.id;
}

export { getOrCreateOneOnOneConversation, getOrCreateGroupConversation, createContactChat, createChatSignature };
