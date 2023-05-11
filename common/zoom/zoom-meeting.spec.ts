import { Role } from '../user/roles';
import { GraphQLUser } from '../user/session';
import { createZoomMeeting, deleteZoomMeeting, getUsersZoomMeetings, getZoomMeeting, getZoomMeetingReport } from './zoom-scheduled-meeting';
import dotenv from 'dotenv';

dotenv.config();

const sampleUser: GraphQLUser = {
    email: process.env.ZOOM_EMAIL,
    firstname: 'random',
    lastname: 'user',
    roles: [Role.USER, Role.STUDENT],
    userID: process.env.ZOOM_USER_ID,
};

const pastMeetingId = '82538138011';

const date = new Date();

// test('Get Zoom Meeting', async () => {
//     const result = await getZoomMeeting('');
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Get All Users Zoom Meetings', async () => {
//     const result = await getUsersZoomMeetings(sampleUser.email);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Create Zoom Meeting', async () => {
//     const result = await createZoomMeeting(process.env.ZOOM_USER_ID, date);
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

// test('Delete Zoom Meeting', async () => {
//     const result = await deleteZoomMeeting('82648035342');
//     console.log(result);
//     expect(typeof result).toBe('object');
// });

test('Get Zoom Meeting Data', async () => {
    const result = await getZoomMeetingReport(pastMeetingId);
    console.log(result);
    expect(typeof result).toBe('object');
});

// return type of meeting report
// type MeetingReportType = {
//     uuid: string,
//     id: number,
//     host_id: string,
//     type: number,
//     topic: string,
//     user_name: string,
//     user_email: string,
//     start_time: string,
//     end_time: string,
//     duration: number,
//     total_minutes: number,
//     participants_count: number,
//     tracking_fields: any[],
//     dept: string
// };
