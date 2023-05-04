import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { createZoomMeeting, deleteZoomMeeting, getZoomMeeting } from './zoom-scheduled-meeting';
import dotenv from 'dotenv';

dotenv.config();

const sampleUser: GraphQLUser = {
    email: process.env.ZOOM_EMAIL,
    firstname: 'random',
    lastname: 'user',
    roles: [Role.USER, Role.STUDENT],
    userID: process.env.ZOOM_USER_ID,
};

test('Get Zoom Meeting', async () => {
    const result = await getZoomMeeting('86417976537');
    console.log(result);
    expect(typeof result).toBe('object');
});

// test('Create Zoom Meeting', async () => {
//     const result = await createZoomMeeting(sampleUser);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Delete Zoom Meeting', async () => {
//     const result = await deleteZoomMeeting('86417976537');
//     console.log(result);
//     expect(typeof result).toBe('object');
// });
