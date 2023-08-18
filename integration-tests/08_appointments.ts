import { test } from './base';
import { screenedInstructorOne } from './02_screening';
import { subcourseOne } from './course';
import assert from 'assert';
import { pupilOne } from './01_user';
import { expectFetch } from './base/mock';

const appointmentTitle = 'Group Appointment 1';
const appointmentTitle2 = 'Group Appointment 2';
const appointmentTitle3 = 'Group Appointment 3';

const firstAppointment = test('Create an appointment for a subcourse', async () => {
    const { subcourseId } = await subcourseOne;
    const { client, instructor } = await screenedInstructorOne;
    const next = new Date();
    next.setDate(new Date().getDate() + 8);

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ZOOM_ACCESS_TOKEN' },
    });

    expectFetch({
        url: `https://api.zoom.us/v2/users/${instructor.email.toLowerCase()}`,
        method: 'GET',
        responseStatus: 200,
        response: {
            id: '123',
            first_name: instructor.firstname,
            last_name: instructor.lastname,
            email: instructor.email,
            display_name: instructor.firstname + ' ' + instructor.lastname,
            personal_meeting_url: 'https://meet',
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/users/123/meetings',
        method: 'POST',
        body: '{"agenda":"My Meeting","default_password":false,"duration":*,"start_time":"*","timezone":"Europe/Berlin","type":2,"mute_upon_entry":true,"join_before_host":true,"waiting_room":true,"breakout_room":true,"settings":{"alternative_hosts":"","alternative_hosts_email_notification":false}}',
        responseStatus: 201,
        response: { id: 10 },
    });

    const res = await client.request(`
    mutation creategroupAppointments {
        appointmentsGroupCreate(subcourseId: ${parseInt(subcourseId)}, appointments: [
            {
                title: "${appointmentTitle}"
                start: "${next.toISOString()}"
                duration: 15
                subcourseId: ${subcourseId}
                appointmentType: group
            }])
        }
        `);
    assert.ok(res.appointmentsGroupCreate);
});

const moreAppointments = test('Create more appointments for a subcourse', async () => {
    const { subcourseId } = await subcourseOne;
    const { client, instructor } = await screenedInstructorOne;
    const nextDate = new Date();
    nextDate.setDate(new Date().getDate() + 10);
    const nextMonth = new Date();
    nextMonth.setMonth(new Date().getMonth() + 1);

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ZOOM_ACCESS_TOKEN' },
    });

    expectFetch({
        url: `https://api.zoom.us/v2/users/${instructor.email.toLowerCase()}`,
        method: 'GET',
        responseStatus: 200,
        response: {
            id: '123',
            first_name: instructor.firstname,
            last_name: instructor.lastname,
            email: instructor.email,
            display_name: instructor.firstname + ' ' + instructor.lastname,
            personal_meeting_url: 'https://meet',
        },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/users/123/meetings',
        method: 'POST',
        body: '{"agenda":"My Meeting","default_password":false,"duration":*,"start_time":"*","timezone":"Europe/Berlin","type":2,"mute_upon_entry":true,"join_before_host":true,"waiting_room":true,"breakout_room":true,"recurrence":{"end_date_time":"*","type":2},"settings":{"alternative_hosts":"","alternative_hosts_email_notification":false}}',
        responseStatus: 201,
        response: { id: 10 },
    });

    const res = await client.request(`
        mutation creategroupAppointments {
            appointmentsGroupCreate(subcourseId: ${parseInt(subcourseId)}, appointments: [
                {
                    title: "${appointmentTitle2}"
                    start: "${nextDate.toISOString()}"
                    duration: 30
                    subcourseId: ${subcourseId}
                    appointmentType: group
                },
                {
                title: "${appointmentTitle3}"
                start: "${nextMonth.toISOString()}"
                duration: 60
                subcourseId: ${subcourseId}
                appointmentType: group
            }
        ])
        }
        `);
    assert.ok(res.appointmentsGroupCreate);
});

const myAppointments = test('Get my appointments', async () => {
    const { client } = await screenedInstructorOne;
    await firstAppointment;
    await moreAppointments;

    const {
        me: { appointments },
    } = await client.request(`
        query myAppointments {
            me {
                appointments(take: 3, skip: 0) {
                    id
                    title
                    description
                    start
                    duration
                    appointmentType
                    displayName
                    position
                    total
                    isCanceled
                    organizers(skip: 0, take: 1) {
                        id
                        firstname
                        lastname
                    }
                    participants(skip: 0, take: 1) {
                        id
                        firstname
                        lastname
                    }
                    declinedBy
                }
            }
        }
    `);

    assert.ok(appointments);
    assert.ok(appointments.some((a) => a.title === appointmentTitle));
    return appointments;
});

// void test('Cancel an appointment as a organizer', async () => {
//     const { client } = await screenedInstructorOne;
//     await firstAppointment;
//     const clientAppointments = await myAppointments;
//     const appointmentId = clientAppointments[0].id;

// expectFetch({
//     url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
//     method: 'POST',
//     responseStatus: 200,
//     response: { access_token: 'ZOOM_ACCESS_TOKEN' },
// });

//     await client.request(`mutation cancelAppointment {appointmentCancel(appointmentId: ${appointmentId})}`);
//     const isAppointmentCanceled = await client.request(`query appointment {appointment(appointmentId: ${appointmentId}){isCanceled}}`);
//     const {
//         me: { appointments },
//     } = await client.request(`query myAppointments { me { appointments(take: 3, skip: 0) { id }}}`);

//     assert.ok(isAppointmentCanceled);
//     assert.ok(appointments.some((a) => a.id != appointmentId));
// });

void test('Update an appointment', async () => {
    const { client, instructor } = await screenedInstructorOne;
    await firstAppointment;
    const clientAppointments = await myAppointments;
    const appointmentId = clientAppointments[1].id;
    const nextHour = new Date();
    nextHour.setHours(new Date().getHours() + 1);

    expectFetch({
        url: 'https://api.zoom.us/oauth/token?grant_type=account_credentials&account_id=ZOOM_ACCOUNT_ID',
        method: 'POST',
        responseStatus: 200,
        response: { access_token: 'ZOOM_ACCESS_TOKEN' },
    });

    expectFetch({
        url: 'https://api.zoom.us/v2/meetings/10',
        method: 'PATCH',
        body: '{"start_time":"*","duration":120,"timezone":"Europe/Berlin","recurrence":{"end_date_time":"*","type":2}}',
        responseStatus: 200,
        response: {}
    });


    const updateTitle = 'Updated Title';
    const resp = await client.request(`mutation updateAppointment { appointmentUpdate (
        appointmentToBeUpdated: {
            id: ${appointmentId}
            title: "${updateTitle}"
            description: "Description"
            start: "${nextHour}"
            duration: 120
        }
        )
    }`);

    const {
        me: { appointments },
    } = await client.request(`
        query myAppointments {
            me {
                appointments(take: 10, skip: 0) {
                    id
                    title
                    description
                    start
                    duration
                }
            }
        }
    `);

    assert.ok(appointments.some((a) => a.id == appointmentId && a.title == updateTitle));
});
