import { test } from './base';
import { screenedInstructorOne } from './screening';
import { subcourseOne } from './course';
import assert from 'assert';
import { pupilOne, studentOne } from './user';
import { pupilOneWithPassword } from './auth';

const firstAppointment = test('Create an appointment for a subcourse', async () => {
    const { subcourseId } = await subcourseOne;
    const { client } = await screenedInstructorOne;
    const appointmentTitle = 'Group Appointment 1';
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
                title: "Group Appointment 2"
                start: "${nextDate.toISOString()}"
                duration: 30
                subcourseId: ${subcourseId}
                appointmentType: group
            },
            {
                title: "Group Appointment 3"
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
                    organizers(skip: 0, take: 5) {
                        id
                        firstname
                        lastname
                    }
                    participants(skip: 0, take: 30) {
                        id
                        firstname
                        lastname
                        isPupil
                        isStudent
                    }
                }
            }
        }
    `);

    console.log('My appointments:', appointments);
    assert.ok(appointments);
});
