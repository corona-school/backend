import { test } from './base';
import { screenedInstructorOne } from './screening';
import { subcourseOne } from './course';
import assert from 'assert';

const appointmentTitle = 'Group Appointment 1';
const appointmentTitle2 = 'Group Appointment 2';
const appointmentTitle3 = 'Group Appointment 3';

const firstAppointment = test('Create an appointment for a subcourse', async () => {
    const { subcourseId } = await subcourseOne;
    const { client } = await screenedInstructorOne;
    const nextHour = new Date();
    nextHour.setHours(new Date().getHours() + 1);
    const res = await client.request(`
    mutation creategroupAppointments {
        appointmentsGroupCreate(subcourseId: ${parseInt(subcourseId)}, appointments: [
            {
                title: "${appointmentTitle}"
                start: "${nextHour.toISOString()}"
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
    const { client } = await screenedInstructorOne;
    const nextDate = new Date();
    nextDate.setDate(new Date().getDate() + 2);
    const nextMonth = new Date();
    nextMonth.setMonth(new Date().getMonth() + 1);

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
                appointments(take: 3) {
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
    assert.ok(appointments.some((a) => (a.title = appointmentTitle)));
    return appointments;
});

test('Cancel an appointment as a organizer', async () => {
    const { client } = await screenedInstructorOne;
    await firstAppointment;
    const clientAppointments = await myAppointments;
    const appointmentId = clientAppointments[0].id;

    await client.request(`mutation cancelAppointment {appointmentCancel(appointmentId: ${appointmentId})}`);
    const isAppointmentCanceled = await client.request(`query appointment {appointment(appointmentId: ${appointmentId}){isCanceled}}`);
    const {
        me: { appointments },
    } = await client.request(`query myAppointments { me { appointments(take: 3) { id }}}`);

    assert.ok(isAppointmentCanceled);
    assert.ok(appointments.some((a) => a.id != appointmentId));
});

test('Decline an appointment as a organizer', async () => {
    const { client, instructor } = await screenedInstructorOne;
    await firstAppointment;
    await moreAppointments;
    const appointments = await myAppointments;
    const appointmentId = appointments[1].id;

    await client.request(`mutation declineAppointment {appointmentDecline(appointmentId: ${appointmentId})}`);
    const {
        appointment: { declinedBy },
    } = await client.request(`query appointment {appointment(appointmentId: ${appointmentId}){declinedBy}}`);

    assert.ok(declinedBy.includes(`student/${instructor.student.id}`));
});

// TODO update appointment
test('Update an appointment', async () => {
    const { client } = await screenedInstructorOne;
    await firstAppointment;
    const clientAppointments = await myAppointments;
    const appointmentId = clientAppointments[1].id;
    const nextHour = new Date();
    nextHour.setHours(new Date().getHours() + 1);

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
                appointments(take: 10) {
                    id
                    title
                    description
                    start
                    duration
                }
            }
        }
    `);

    console.log('UPDATED APPOINTMENTS', appointments);
    assert.ok(appointments.some((a) => a.id == appointmentId && a.title == updateTitle));
});
