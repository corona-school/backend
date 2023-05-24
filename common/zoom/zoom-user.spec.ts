import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { deleteZoomUser, getZoomUser, createZoomUser, getUserZAK, updateZoomUser } from './zoom-user';
import dotenv from 'dotenv';

dotenv.config();

const sampleUser: GraphQLUser = {
    email: process.env.ZOOM_EMAIL,
    firstname: 'Leon',
    lastname: 'Jackson',
    roles: [Role.USER, Role.STUDENT],
    userID: process.env.ZOOM_USER_ID,
};

// test('Create a Zoom user', async () => {
//     const result = await createZoomUser(sampleUser);

//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get a Zoom user', async () => {
//     const result = await getZoomUser(process.env.ZOOM_EMAIL);

//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get a Zoom user', async () => {
//     const result = await getZoomUser(process.env.ZOOM_EMAIL_2);

//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get a Zoom users zak', async () => {
//     const result = await getUserZAK(sampleUser.email);

//     console.log(result);
//     expect(result).toHaveProperty('token');
// });

// test('Update a Zoom user', async () => {
//     const result = await updateZoomUser(sampleUser);

//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Delete a Zoom user', async () => {
//     const result = await deleteZoomUser(process.env.ZOOM_EMAIL);
//     expect(result.status).toBe(204);
// });
