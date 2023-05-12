import { User } from '../user';
import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { createSignature, parseUnderscoreToSlash } from './helper';
import { createChatUser, getChatUser, getOrCreateChatUser } from './user';
import dotenv from 'dotenv';

dotenv.config();

export const sampleUserA: User = {
    firstname: 'Leon',
    lastname: 'Musterstudent',
    email: 'leon.musterstudent@test.de',
    userID: 'student/test',
    studentId: 1,
};

export const sampleUserB: User = {
    firstname: 'Max',
    lastname: 'Musterschüler',
    email: 'max.musterschüler@test.de',
    userID: 'pupil/test1',
    pupilId: 1,
};

export const sampleUserC: User = {
    firstname: 'Tim',
    lastname: 'Musterschüler',
    email: 'tim.musterschüler@test.de',
    userID: 'pupil/test2',
    pupilId: 2,
};

export const sampleUserD: User = {
    firstname: 'Emma',
    lastname: 'Musterschüler',
    email: 'emma.musterschüler@test.de',
    userID: 'pupil/test3',
    pupilId: 3,
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
    expect(resultA.role).toBe('student');

    const resultB = await getChatUser(sampleUserB);
    expect(parseUnderscoreToSlash(resultB.id)).toBe(sampleUserB.userID);
    expect(resultB.email[0]).toBe(sampleUserB.email);
    expect(resultB.name).toBe(`${sampleUserB.firstname} ${sampleUserB.lastname}`);
    expect(resultB.role).toBe('pupil');

    const resultC = await getChatUser(sampleUserB);
    expect(parseUnderscoreToSlash(resultC.id)).toBe(sampleUserB.userID);
    expect(resultC.email[0]).toBe(sampleUserB.email);
    expect(resultC.name).toBe(`${sampleUserB.firstname} ${sampleUserB.lastname}`);
    expect(resultC.role).toBe('pupil');
});

test('Get or create User', async () => {
    const result = await getOrCreateChatUser(sampleUserD);
});

test('Get Signautre for User A', async () => {
    const signature = await createSignature(sampleUserA);
});
