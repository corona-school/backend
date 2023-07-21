import { User } from '../user';
import { ContactReason, Conversation, ConversationInfos, SystemMessage, TJConversation } from './types';
import { checkChatMembersAccessRights, convertTJConversation, createOneOnOneId } from './helper';
import { createConversation, getConversation, markConversationAsWriteable, sendSystemMessage, updateConversation } from './conversation';
import { getOrCreateChatUser } from './user';
import { prisma } from '../prisma';
import { getMyContacts } from './contacts';
import systemMessages from './localization';

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
            await markConversationAsWriteable(participantsConversationId);
            await sendSystemMessage(systemMessages.de.reactivated, participantsConversationId, SystemMessage.ONE_ON_ONE_REACTIVATE);
        }
    }

    if (participantsConversation) {
        await handleExistingConversation(participantsConversationId, reason, subcourseId, participantsConversation, conversationInfos);
    } else {
        const newConversationId = await createConversation(participants, conversationInfos, 'oneOnOne');
        const newConversation = await getConversation(newConversationId);
        await sendSystemMessage(systemMessages.de.oneOnOne, newConversationId, SystemMessage.FIRST);

        const convertedConversation = convertTJConversation(newConversation);
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

async function updateMatchConversation(conversationId: string, match: any): Promise<void> {
    const updatedConversation = {
        id: conversationId,
        custom: {
            match: match,
        },
    };

    await updateConversation(updatedConversation);
}

async function updateParticipantConversation(conversationId: string, subcourseId: number | undefined, conversation: TJConversation): Promise<void> {
    const subcoursesFromConversation = conversation?.custom.subcourse;
    let subcourseIds = [];

    try {
        subcourseIds = JSON.parse(subcoursesFromConversation || '[]');
    } catch (error) {}

    const updatedSubcourses: number[] = [...subcourseIds, subcourseId];
    const returnUpdatedSubcourses = Array.from(new Set(updatedSubcourses));

    const updatedConversation = {
        id: conversationId,
        custom: {
            subcourse: returnUpdatedSubcourses,
        },
    };

    await updateConversation(updatedConversation);
}

async function updateProspectConversation(conversationId: string, subcourseId: number | undefined, conversation: TJConversation): Promise<void> {
    const prospectSubcoursesFromConversation = conversation?.custom.prospectSubcourse;
    let prospectSubcourseIds = [];

    try {
        prospectSubcourseIds = JSON.parse(prospectSubcoursesFromConversation || '[]');
    } catch (error) {}

    const updatedProspectSubcourse: number[] = [...prospectSubcourseIds, subcourseId];
    const returnUpdatedProspectSubcourses = Array.from(new Set(updatedProspectSubcourse));

    const updatedConversation = {
        id: conversationId,
        custom: {
            prospectSubcourse: returnUpdatedProspectSubcourses,
        },
    };

    await updateConversation(updatedConversation);
}

async function updateContactConversation(conversationId: string, conversationInfos: ConversationInfos): Promise<void> {
    const updatedConversation = {
        id: conversationId,
        ...conversationInfos,
    };

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
        custom: {
            ...(contact.match && { match: { matchId: contact.match.matchId } }),
            ...(contact.subcourse && { subcourse: [...new Set(contact.subcourse)] }),
        },
    };

    const conversation = await getOrCreateOneOnOneConversation([meUser, contactUser], conversationInfos, ContactReason.CONTACT);
    return conversation.id;
}

export { getOrCreateOneOnOneConversation, getOrCreateGroupConversation, createContactChat };
