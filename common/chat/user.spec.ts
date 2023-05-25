import { createChatUser, getChatUser } from './user';

const user = {
    userID: 'user_1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    studentId: 1,
};

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

describe('createChatUser', () => {
    it('should create a chat user with the correct data', async () => {
        await createChatUser(user);
        await createChatUser(student1);
        await createChatUser(pupil1);
        const createdUser = await getChatUser(user);
        await expect(createdUser.id).toStrictEqual(user.userID);
    });
});
