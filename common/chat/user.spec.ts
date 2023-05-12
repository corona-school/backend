import { User } from '../user';
import { createChatSignature, parseUnderscoreToSlash } from './helper';
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

export const sampleUserF: User = {
    firstname: 'David',
    lastname: 'Musterschüler',
    email: 'david.musterschüler@test.de',
    userID: 'pupil/test5',
    pupilId: 5,
};

export const sampleUserG: User = {
    firstname: 'Julia',
    lastname: 'Musterschüler',
    email: 'julia.musterschüler@test.de',
    userID: 'pupil/test6',
    pupilId: 6,
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
    const result = await getOrCreateChatUser(sampleUserF);
    const resultNew = await getOrCreateChatUser(sampleUserG);

    expect(result.name).toBe(`${sampleUserF.firstname} ${sampleUserF.lastname}`);
    expect(resultNew.name).toBe(`${sampleUserG.firstname} ${sampleUserG.lastname}`);
});
