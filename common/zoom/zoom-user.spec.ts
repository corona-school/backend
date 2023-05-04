import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { deleteZoomUser, getZoomUser, createZoomUser, getUserZAK } from './zoom-user';
import dotenv from 'dotenv';

dotenv.config();

const sampleUser: GraphQLUser = {
    email: process.env.ZOOM_EMAIL,
    firstname: 'random',
    lastname: 'user',
    roles: [Role.USER, Role.STUDENT],
    userID: process.env.ZOOM_USER_ID,
};

// test('Create a Zoom user', async () => {
//     const result = await createZoomUser(sampleUser);

//     console.log(result);
//     expect(typeof result).toBe('object');
// });

test('Get a Zoom user', async () => {
    const result = await getZoomUser(process.env.ZOOM_USER_ID);

    console.log(result);
    expect(typeof result).toBe('object');
});

// test('Get a Zoom users zak', async () => {
//     const result = await getUserZAK(sampleUser.email);

//     console.log(result);
//     expect(result).toHaveProperty('token');
// });

// test('Delete a Zoom user', async () => {
//     const result = await deleteZoomUser(sampleUser);
//     expect(result.code).toBe(1001);
// });
