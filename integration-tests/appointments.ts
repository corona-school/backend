import { test } from './base';
import { screenedInstructorOne } from './screening';
import { subcourseOne } from './course';
import assert from 'assert';

const firstAppointment = test('Create an appointment for a subcourse', async () => {
    const {subcourseId} = await subcourseOne;
    const {client} = await screenedInstructorOne;
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