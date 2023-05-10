import dotenv from 'dotenv';
import { sampleUserA, sampleUserB, sampleUserC } from './user.spec';
import {
    addParticipant,
    createConversation,
    deleteConversation,
    getConversation,
    getLastUnreadConversation,
    removeParticipant,
    talkjsConversationApiUrl,
    updateConversation,
} from './conversation';
import { checkResponseStatus, parseSlashToUnderscore, parseUnderscoreToSlash } from './helper';

dotenv.config();
const conversationId = 'dev-test';

test('Create Conversation between User A and User B', async () => {
    const conversationId = await createConversation([sampleUserA, sampleUserB], 'Kurs: Mathematik');
    const conversation = await getConversation(conversationId);
    expect(conversationId).toBe(conversation.id);
    expect(conversation.subject).toBe('Kurs: Mathematik');

    const participants = Object.keys(conversation.participants);
    expect(participants.length).toBe(2);
});

test('Update Conversation', async () => {
    await updateConversation([sampleUserA, sampleUserB], conversationId, 'Kurs: Geschichte');
    let conversation = await getConversation(conversationId);
    expect(conversation.subject).toBe('Kurs: Geschichte');

    await updateConversation([sampleUserA, sampleUserB], conversationId, 'Kurs: Mathematik');
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
                    sender: parseSlashToUnderscore(sampleUserA.userID),
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
    expect(participants).toContain(parseSlashToUnderscore(sampleUserC.userID));
});

test('Remove Participant', async () => {
    await removeParticipant(sampleUserC, conversationId);
    const conversation = await getConversation(conversationId);
    const participants = Object.keys(conversation.participants);
    expect(participants.length).toBe(2);
    expect(participants).not.toContain(parseSlashToUnderscore(sampleUserC.userID));
});

test('Delete Conversation', async () => {
    await deleteConversation(conversationId);
});
