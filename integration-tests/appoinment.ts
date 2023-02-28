import assert from "assert";
import { test } from "./base";
import { pupilOne, studentOne } from "./user";

const firstAppointmentTitle = "Test Subcourse Appointment 1";
const secondAppointmentTitle = "Test Subcourse Appointment 2";

const createCourseAppointments = test('Create course appointment as student', async () => {
    const {client} = await studentOne;

    await client.request(`mutation createAppointments {
        appointmentsCreate(appointments: [
            {
            title: "${firstAppointmentTitle}"
            description: "Beschreibung 1"
            start: "2023-02-14T16:00:00Z"
            duration: 15
            organizers:[1]
            participants_pupil:[1]
            subcourseId:1
            appointmentType: group
            },
            {
            title: "${secondAppointmentTitle}"
            description: "Beschreibung 2"
            start: "2023-02-14T16:30:00Z"
            duration: 15
            organizers:[1]
            participants_pupil:[1]
            subcourseId:1
            appointmentType: group
            }
        ])
      }`
    );
    const result = await client.request(`
        query myAppointments{
            me{
                appointments(take: 30){
                    id
                    title
                    description
                }
            }
        }
    `);
    assert.strictEqual(result.me.appointments.length, 2);
    assert.strictEqual(result.me.appointments[0].title, firstAppointmentTitle);
    assert.strictEqual(result.me.appointments[1].title, secondAppointmentTitle);
});

test('Create course appointment as pupil should fail', async () => {
    const {client} = await pupilOne;
    await client.requestShallFail(`mutation createAppointments {
        appointmentsCreate(appointments: [
            {
            title: "Test Subcourse Appointment 1"
            description: "Beschreibung 1"
            start: "2023-02-14T16:00:00Z"
            duration: 15
            organizers:[1]
            participants_pupil:[1]
            subcourseId:1
            appointmentType: group
            },
            {
            title: "Test Subcourse Appointment 2"
            description: "Beschreibung 2"
            start: "2023-02-14T16:00:00Z"
            duration: 15
            organizers:[1]
            participants_pupil:[1]
            subcourseId:1
            appointmentType: group
            }
        ])
      }`
    );
});

test('Querying my appointments as pupil', async () => {
    await createCourseAppointments;
    const {client} = await pupilOne;
    await client.requestShallFail(`mutation createAppointments {
        appointmentsCreate(appointments: [
            {
                title: "Test Subcourse Appointment 1"
                description: "Beschreibung 1"
                start: "2023-02-14T16:00:00Z"
                duration: 15
                organizers:[1]
                participants_pupil:[1]
                subcourseId:1
                appointmentType: group
            }
        ])
      }`
    );
    const result = await client.request(`
        query myAppointments{
            me{
                appointments(take: 30){
                    id
                    title
                    description
                }
            }
        }
    `);
    assert.strictEqual(result.me.appointments.length, 2);
    assert.strictEqual(result.me.appointments[0].title, firstAppointmentTitle);
    assert.strictEqual(result.me.appointments[1].title, secondAppointmentTitle);
});