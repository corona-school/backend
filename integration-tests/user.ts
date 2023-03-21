import { test, createUserClient, adminClient } from "./base";
import * as assert from "assert";
import { randomBytes } from "crypto";

const setup = test("Setup Configuration", async () => {
    // Ensure Rate Limits are deterministic when running the tests multiple times
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
});

export const pupilOne = test("Register Pupil", async () => {
    await setup;

    const client = createUserClient();

    const userRandom = randomBytes(5).toString("base64");

    const { meRegisterPupil: { id } } = await client.request(`
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

    const { myRoles: rolesBeforeEmailVerification } = await client.request(`
        query GetRolesBeforeEmailVerification {
            myRoles
        }
    `);

    assert.deepStrictEqual(rolesBeforeEmailVerification, ['UNAUTHENTICATED', 'USER', 'PUPIL']);

    // Bypass email verification as this is hard to test automatically:
    await adminClient.request(`mutation BypassEmailVerification { _verifyEmail(userID: "pupil/${id}")}`);
    await client.request(`mutation RefreshLogin { loginRefresh }`);

    const { me: pupil, myRoles } = await client.request(`
        query GetBasics {
            myRoles
            me {
                firstname
                lastname
                email
                pupil { 
                    id 
                    isPupil
                    isParticipant
                    openMatchRequestCount
                }
            }
        }
    `);

    assert.strictEqual(pupil.firstname, `firstname:${userRandom}`);
    assert.strictEqual(pupil.lastname, `lastname:${userRandom}`);
    assert.strictEqual(pupil.email, `test+${userRandom}@lern-fair.de`.toLowerCase());
    assert.strictEqual(pupil.pupil.isPupil, true);
    assert.strictEqual(pupil.pupil.isParticipant, true);
    assert.strictEqual(pupil.pupil.openMatchRequestCount, 0);

    assert.deepStrictEqual(myRoles, ['UNAUTHENTICATED', 'USER', 'PUPIL', 'TUTEE', 'PARTICIPANT']);

    // Ensure that E-Mails are consumed case-insensitive everywhere:
    pupil.email = pupil.email.toUpperCase();

    return { client, pupil: pupil as { firstname: string, lastname: string, email: string, pupil: { id: number } } };
});

export const studentOne = test("Register Student", async () => {
    await setup;

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

    return { client, student: student as { firstname: string, lastname: string, email: string, student: { id: number; }} };
});

export const instructorOne = test("Register Instructor", async () => {
    await setup;

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