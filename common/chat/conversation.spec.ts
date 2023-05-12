import dotenv from 'dotenv';
import { sampleUserA, sampleUserB, sampleUserC } from './user.spec';
import {
    ConversationInfos,
    addParticipant,
    createConversation,
    deleteConversation,
    getConversation,
    getLastUnreadConversation,
    markConversationAsReadOnly,
    markConversationAsWriteable,
    removeParticipant,
    talkjsConversationApiUrl,
    updateConversation,
} from './conversation';
import { checkResponseStatus, userIdToTalkJsId } from './helper';

dotenv.config();
let conversationId;

const conversationInfos: ConversationInfos = {
    subject: 'Kurs: Mathematik',
    custom: {
        type: 'course',
    },
};

test('Create Conversation between User A and User B', async () => {
    conversationId = await createConversation([sampleUserA, sampleUserB], conversationInfos);
    const conversation = await getConversation(conversationId);
    expect(conversationId).toBe(conversation.id);
    expect(conversation.subject).toBe('Kurs: Mathematik');

    const participants = Object.keys(conversation.participants);
    expect(participants.length).toBe(2);
});

test('Update Conversation', async () => {
    await updateConversation({ ...conversationInfos, subject: 'Kurs: Geschichte', id: conversationId });
    let conversation = await getConversation(conversationId);
    expect(conversation.subject).toBe('Kurs: Geschichte');

    await updateConversation({ ...conversationInfos, subject: 'Kurs: Mathematik', id: conversationId });
    conversation = await getConversation(conversationId);
    expect(conversation.subject).toBe('Kurs: Mathematik');
});

test('Get unread Conversations', async () => {
    // Send message to conversation
    const message = 'Test Nachricht';
    try {
        const response = await fetch(`${talkjsConversationApiUrl}/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.TALKJS_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    text: message,
                    sender: userIdToTalkJsId(sampleUserA.userID),
                    type: 'UserMessage',
                },
            ]),
        });
        await checkResponseStatus(response);
    } catch (error) {
        throw new Error(error);
    }

    // check if message received
    const response = await getLastUnreadConversation(sampleUserB);
    expect(response.data.length).toBe(1);
    expect(response.data[response.data.length - 1].lastMessage.text).toBe(message);
});

test('Add Participant', async () => {
    await addParticipant(sampleUserC, conversationId);
    const conversation = await getConversation(conversationId);
    const participants = Object.keys(conversation.participants);
    expect(participants.length).toBe(3);
    expect(participants).toContain(userIdToTalkJsId(sampleUserC.userID));
});

test('Remove Participant', async () => {
    await removeParticipant(sampleUserC, conversationId);
    const conversation = await getConversation(conversationId);
    const participants = Object.keys(conversation.participants);
    expect(participants.length).toBe(2);
    expect(participants).not.toContain(userIdToTalkJsId(sampleUserC.userID));
});

test('Mark conversation as read-only', async () => {
    await markConversationAsReadOnly(conversationId);
    const conversation = await getConversation(conversationId);
    const participantInfos = Object.values(conversation.participants);
    for (const info of participantInfos) {
        expect(info.access).toBe('Read');
    }
});

test('Mark conversation as writeable', async () => {
    await markConversationAsWriteable(conversationId);
    const conversation = await getConversation(conversationId);
    const participantInfos = Object.values(conversation.participants);
    for (const info of participantInfos) {
        expect(info.access).toBe('ReadWrite');
    }
});

test('Delete Conversation', async () => {
    await deleteConversation(conversationId);
});
