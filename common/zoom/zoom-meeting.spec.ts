import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { createZoomMeeting, deleteZoomMeeting, getUsersZoomMeetings, getZoomMeeting, getZoomMeetingReport } from './zoom-scheduled-meeting';
import dotenv from 'dotenv';
import { ZoomUser } from './zoom-user';

dotenv.config();

const sampleUser: ZoomUser = {
    id: process.env.ZOOM_USER_ID,
    email: process.env.ZOOM_EMAIL,
    first_name: 'random',
    last_name: 'user',
    display_name: 'random user',
    personal_meeting_url: '',
};

const sampleUserSecond: ZoomUser = {
    id: process.env.ZOOM_USER_ID_2,
    email: process.env.ZOOM_EMAIL_2,
    first_name: 'random',
    last_name: 'user',
    display_name: 'random user',
    personal_meeting_url: '',
};

const hosts = [sampleUser, sampleUserSecond];

const pastMeetingId = '86230936183';

const date = new Date();

// test('Get Zoom Meeting', async () => {
//     const result = await getZoomMeeting(pastMeetingId);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get All Users Zoom Meetings', async () => {
//     const result = await getUsersZoomMeetings(sampleUser.email);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Create Zoom Meeting', async () => {
//     const result = await createZoomMeeting(hosts, date);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Delete Zoom Meeting', async () => {
//     const result = await deleteZoomMeeting('82648035342');
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get Zoom Meeting Data', async () => {
//     const result = await getZoomMeetingReport(pastMeetingId);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });
