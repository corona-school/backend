import { test } from './base';
import { screenedInstructorOne } from './screening';
import { subcourseOne } from './course';
import assert from 'assert';
import { pupilOne, pupilUpdated } from './user';

// TODO define appointment titles here
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
});

const participantAppointments = test('Get participants appointments', async () => {
    const { client, pupil } = await pupilOne;
    const { subcourseId } = await subcourseOne;

    await pupilUpdated;
    await myAppointments;

    await client.request(`
    mutation joinSubcourse(
        subcourseJoin(subcourseId: ${parseInt(subcourseId)})
    )`);

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
                    organizers(skip: 0, take: 5) {
                        id
                        firstname
                        lastname
                    }
                    participants(skip: 0, take: 30) {
                        id
                        firstname
                        lastname
                    }
                    declinedBy
                }
            }
        }
    `);
    assert.ok(appointments.participants.some((p) => (p.id = pupil.pupil.id)));
});

// TODO cancel appointment

// TODO declinedBy
