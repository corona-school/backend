import assert from "assert";
import { randomBytes } from "crypto";
import { adminClient, test } from "./base";
import { pupilOne, studentOne } from "./user";

test("Admin set Email of Pupil", async () => {
    const { pupil, client } = await pupilOne;

    const otherEmail = `TEST+${randomBytes(5).toString("base64")}@lern-fair.de`;

    await adminClient.request(
        `mutation PupilChangeEmail { pupilUpdate(pupilId: ${pupil.pupil.id} data: { email: "${otherEmail}" })}`
    );

    const { me: { pupil: { email: updatedEmail } } } = await client.request(`query { me { pupil { email }}}`);
    // When admins set the email of a student the same validation and normalization happens as when the user registers
    // This is mandatory as we perform case sensitive lookup on the email column to find accounts
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());


    await adminClient.request(
        `mutation PupilRevertEmailChange { pupilUpdate(pupilId: ${pupil.pupil.id} data: { email: "${pupil.email}" })}`
    );
});


test("Admin set Email of Student", async () => {
    const { student, client } = await studentOne;

    const otherEmail = `TEST+${randomBytes(5).toString("base64")}@lern-fair.de`;

    await adminClient.request(
        `mutation StudentChangeEmail { studentUpdate(studentId: ${student.student.id} data: { email: "${otherEmail}" })}`
    );

    const { me: { student: { email: updatedEmail } } } = await client.request(`query { me { student { email }}}`);
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());


    await adminClient.request(
        `mutation StudentRevertEmailChange { studentUpdate(studentId: ${student.student.id} data: { email: "${student.email}" })}`
    );
});

test("Admin Pupil to Plus", async () => {
    const { pupil } = await pupilOne;

    await adminClient.request(`
      mutation PupilToPlus {
        pupilUpdate(pupilId: ${pupil.pupil.id} data: { registrationSource: plus })
      }
    `);
});

test("Admin Search Users", async () => {
    const { pupil } = await pupilOne;
    const { student } = await studentOne;

    const { usersSearch: searchPupilInStudents } = await adminClient.request(`
        query SearchPupilInStudents {
            usersSearch(query: "${pupil.firstname} ${pupil.lastname}" only: "student") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilInStudents.length, 0);


    const { usersSearch: searchPupilByFirstname } = await adminClient.request(`
        query SearchPupilByFirstname {
            usersSearch(query: "${pupil.firstname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByFirstname.length, 1);
    assert.strictEqual(searchPupilByFirstname[0].email, pupil.email);

    const { usersSearch: searchPupilByLastname } = await adminClient.request(`
        query SearchPupilByLastname {
            usersSearch(query: "${pupil.lastname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByLastname.length, 1);
    assert.strictEqual(searchPupilByLastname[0].email, pupil.email);

    const { usersSearch: searchPupilByFullName } = await adminClient.request(`
        query SearchPupilByFullName {
            usersSearch(query: "${pupil.firstname} ${pupil.lastname}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByFullName.length, 1);
    assert.strictEqual(searchPupilByFullName[0].email, pupil.email);

    const { usersSearch: searchPupilByEmail } = await adminClient.request(`
        query SearchPupilByEmail {
            usersSearch(query: "${pupil.email}" only: "pupil") {
                email
            }
        }
    `);
    assert.strictEqual(searchPupilByEmail.length, 1);
    assert.strictEqual(searchPupilByEmail[0].email, pupil.email);

    const { usersSearch: searchUsersByPartialEmail } = await adminClient.request(`
        query SearchUsersByPartialEmail {
            usersSearch(query: " @lern-fair.de") {
                email
            }
        }
    `);

    assert(searchUsersByPartialEmail.some(it => it.email === pupil.email));
    assert(searchUsersByPartialEmail.some(it => it.email === student.email));

    const { usersSearch: searchStudentsByPartialEmail } = await adminClient.request(`
        query SearchStudentsByPartialEmail {
            usersSearch(query: "@lern-fair.de " only: "student") {
                email
            }
        }
    `);

    assert(!searchStudentsByPartialEmail.some(it => it.email === pupil.email));
    assert(searchStudentsByPartialEmail.some(it => it.email === student.email));

    const { usersSearch: searchUsersByPartialName } = await adminClient.request(`
        query SearchUsersByPartialName {
            usersSearch(query: "firstname lastname") {
                email
            }
        }
    `);

    assert(searchUsersByPartialName.some(it => it.email === pupil.email));
    assert(searchUsersByPartialName.some(it => it.email === student.email));
});