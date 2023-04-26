import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { createZoomUser, getZoomUser, updateZoomUser } from './zoom-user';
import dotenv from 'dotenv';

dotenv.config();

const sampleUser: GraphQLUser = {
    email: process.env.TEST_ZOOM_EMAIL,
    firstname: 'Jennifer',
    lastname: 'Falkenstein',
    roles: [Role.USER, Role.STUDENT],
    userID: '1',
};

test('Create a Zoom user', async () => {
    console.log(process.env.API_KEY);
    // Act
    const auth = await createZoomUser(process.env.TEST_ZOOM_EMAIL, 1, 'random', 'user');
    // Assert
    console.log(auth);
    expect(typeof auth).toBe('object');
});

test('Get a Zoom user', async () => {
    const result = await getZoomUser(sampleUser);
    expect(result.email).toBe(process.env.TEST_ZOOM_EMAIL);
});

test('Update a Zoom user', async () => {
    const resultBefore = await getZoomUser(sampleUser);
    await updateZoomUser({ ...sampleUser, firstname: 'Jenny' });
    const resultAfter = await getZoomUser(sampleUser);
    expect(resultBefore.first_name).toBe(sampleUser.firstname);
    expect(resultAfter.first_name).toBe('Jenny');
});
