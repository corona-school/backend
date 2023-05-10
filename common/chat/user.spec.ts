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

test('Create User A, B and C', async () => {
    await createChatUser(sampleUserA);
    await createChatUser(sampleUserB);
    await createChatUser(sampleUserC);
    // expect not to throw doesn't work with async functions?
});

test('Get User A, B and C', async () => {
    const resultA = await getChatUser(sampleUserA);
    expect(parseUnderscoreToSlash(resultA.id)).toBe(sampleUserA.userID);
    expect(resultA.email[0]).toBe(sampleUserA.email);
    expect(resultA.name).toBe(`${sampleUserA.firstname} ${sampleUserA.lastname}`);

    const resultB = await getChatUser(sampleUserB);
    expect(parseUnderscoreToSlash(resultB.id)).toBe(sampleUserB.userID);
    expect(resultB.email[0]).toBe(sampleUserB.email);
    expect(resultB.name).toBe(`${sampleUserB.firstname} ${sampleUserB.lastname}`);

    const resultC = await getChatUser(sampleUserB);
    expect(parseUnderscoreToSlash(resultC.id)).toBe(sampleUserB.userID);
    expect(resultC.email[0]).toBe(sampleUserB.email);
    expect(resultC.name).toBe(`${sampleUserB.firstname} ${sampleUserB.lastname}`);
});
