import { test, createUserClient, adminClient } from "./base";
import * as assert from "assert";
import { randomBytes } from "crypto";

export const pupilOne = test("Register Pupil", async () => {
    const client = createUserClient();

    const userRandom = randomBytes(5).toString("base64");

    await client.request(`
        mutation RegisterPupil {
            meRegisterPupil(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "test+${userRandom}@lern-fair.de"
                newsletter: false
                state: bw
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    // E-Mail cannot be registered again (case insensitive)
    await client.requestShallFail(`
        mutation RegisterPupilAgain {
            meRegisterPupil(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "TEST+${userRandom}@lern-fair.de"
                newsletter: false
                state: bw
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    const { me: pupil } = await client.request(`
        query GetBasics {
            me {
                firstname
                lastname
                email
                pupil { 
                    id 
                    isPupil
                    isParticipant
                }
            }
        }
    `);

    assert.strictEqual(pupil.firstname, `firstname:${userRandom}`);
    assert.strictEqual(pupil.lastname, `lastname:${userRandom}`);
    assert.strictEqual(pupil.email, `test+${userRandom}@lern-fair.de`.toLowerCase());
    assert.strictEqual(pupil.pupil.isPupil, true);
    assert.strictEqual(pupil.pupil.isParticipant, true);

    // Ensure that E-Mails are consumed case-insensitive everywhere:
    pupil.email = pupil.email.toUpperCase();

    return { client, pupil };
});

export const studentOne = test("Register Student", async () => {
    const client = createUserClient();
    const userRandom = randomBytes(5).toString("base64");

    await client.request(`
        mutation RegisterStudent {
            meRegisterStudent(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "test+${userRandom}@lern-fair.de"
                newsletter: false
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    // E-Mail cannot be registered again (case insensitive)
    await client.requestShallFail(`
        mutation RegisterStudentAgain {
            meRegisterStudent(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "TEST+${userRandom}@lern-fair.de"
                newsletter: false
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    await client.request(`
        mutation BecomeTutor {
            meBecomeTutor(data: { 
                subjects: [{ name: "Deutsch", grade: { min: 1, max: 10 }}]
                languages: [Deutsch]
                supportsInDaZ: false
            })
        }
    `);

    const { me: student } = await client.request(`
        query GetBasics {
            me {
                firstname
                lastname
                email
                student { id }
            }
        }
    `);

    // Ensure that E-Mails are consumed case-insensitive everywhere:
    student.email = student.email.toUpperCase();

    return { client, student };
});

export const instructorOne = test("Register Instructor", async () => {
    const client = createUserClient();
    const userRandom = randomBytes(5).toString("base64");

    await client.request(`
        mutation RegisterStudent {
            meRegisterStudent(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "test+${userRandom}@lern-fair.de"
                newsletter: false
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    // E-Mail cannot be registered again (case insensitive)
    await client.requestShallFail(`
        mutation RegisterStudentAgain {
            meRegisterStudent(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "TEST+${userRandom}@lern-fair.de"
                newsletter: false
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    await client.request(`
        mutation BecomeInstructor {
            meBecomeInstructor(data: { 
                message: ""
            })
        }
    `);

    const { me: instructor } = await client.request(`
        query GetBasics {
            me {
                firstname
                lastname
                email
                student { id }
            }
        }
    `);

    // Bypass email verification as this is hard to test automatically:
    await adminClient.request(`mutation { _verifyEmail(userID: "student/${instructor.student.id}")}`);
    await client.request(`mutation { loginRefresh }`);

    const { myRoles } = await client.request(`query GetRoles { myRoles }`);
    assert.deepStrictEqual(myRoles, ['UNAUTHENTICATED', 'USER', 'STUDENT']);
    // Not yet INSTRUCTOR as not yet screened

    // Ensure that E-Mails are consumed case-insensitive everywhere:
    instructor.email = instructor.email.toUpperCase();

    return { client, instructor };
});