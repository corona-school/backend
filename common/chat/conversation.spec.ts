import { Conversation, ConversationInfos, getOrCreateConversation } from './conversation';
import { getConversationId } from './helper';

const student1 = {
    userID: 'student_20',
    firstname: 'Emma',
    lastname: 'Doe',
    email: 'emma.doe@example.com',
    studentId: 20,
};

const pupil1 = {
    userID: 'student_20',
    firstname: 'Paul',
    lastname: 'Doe',
    email: 'paul.doe@example.com',
    pupilId: 20,
};

describe('create conversation', () => {
    it('should create a conversation', async () => {
        const participants = [student1, pupil1];
        const conversationInfos: ConversationInfos = {
            custom: {
                type: 'participant',
            },
        };
        const convo = await getOrCreateConversation(participants, conversationInfos);
        console.log(convo);
        const conversationIdOfParticipants = getConversationId(participants);

        expect(convo.id).toEqual(conversationIdOfParticipants);
    });
});
