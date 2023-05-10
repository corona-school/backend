import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { parseUnderscoreToSlash } from './helper';
import { createChatUser, getChatUser } from './user';
import dotenv from 'dotenv';

dotenv.config();

export const sampleUserA: GraphQLUser = {
    firstname: 'Leon',
    lastname: 'Musterstudent',
    email: 'leon.musterstudent@test.de',
    roles: [Role.STUDENT],
    userID: 'student/test',
};

export const sampleUserB: GraphQLUser = {
    firstname: 'Max',
    lastname: 'Musterschüler',
    email: 'max.musterschüler@test.de',
    roles: [Role.PUPIL],
    userID: 'pupil/test1',
};

export const sampleUserC: GraphQLUser = {
    firstname: 'Tim',
    lastname: 'Musterschüler',
    email: 'tim.musterschüler@test.de',
    roles: [Role.PUPIL],
    userID: 'pupil/test2',
};

test('Create User A', async () => {
    await createChatUser(sampleUserA);
    // expect not to throw error?
});

test('Create User B', async () => {
    await createChatUser(sampleUserB);
    // expect not to throw error?
});

test('Create User C', async () => {
    await createChatUser(sampleUserC);
    // expect not to throw error?
});

// test('Get User A', async () => {
//     const result = await getChatUser(sampleUserA);
//     expect(parseUnderscoreToSlash(result.id)).toBe(sampleUserA.userID);
//     expect(result.email[0]).toBe(sampleUserA.email);
//     expect(result.name).toBe(`${sampleUserA.firstname} ${sampleUserA.lastname}`);
// });

// test('Get User B', async () => {
//     const result = await getChatUser(sampleUserB);
//     expect(parseUnderscoreToSlash(result.id)).toBe(sampleUserB.userID);
//     expect(result.email[0]).toBe(sampleUserB.email);
//     expect(result.name).toBe(`${sampleUserB.firstname} ${sampleUserB.lastname}`);
// });
