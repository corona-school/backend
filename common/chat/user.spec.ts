import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { TalkJsUser, getAppInfo } from './user';
import dotenv from 'dotenv';

dotenv.config();

const sampleUserA: GraphQLUser = {
    firstname: 'Bob',
    email: 'jennifer.falkenstein@typedigital.de',
    roles: [Role.STUDENT],
    userID: '',
    lastname: 'the Student',
};

const sampleUserB: GraphQLUser = {
    firstname: 'Jenny',
    email: 'jennifer.falkenstein@typedigital.de',
    roles: [Role.PUPIL],
    userID: '',
    lastname: 'the Pupil',
};

test('Get App Info', async () => {
    const result = await getAppInfo();
    console.log(result);
    expect(typeof result).toBe('object');
});
