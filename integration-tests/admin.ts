import assert from "assert";
import { randomBytes } from "crypto";
import { adminClient, test } from "./base";
import { pupilOne, studentOne } from "./user";

test("Admin set Email of Pupil", async () => {
    const { pupil, client } = await pupilOne;

    const otherEmail = `TEST+${randomBytes(5).toString("base64")}@lern-fair.de`;

    await adminClient.request(
        `mutation PupilChangeEmail { pupilUpdate(pupilId: ${pupil.id} data: { email: "${otherEmail}" })}`
    );

    const { me: { pupil: { email: updatedEmail } } } = await client.request(`query { me { pupil { email }}}`);
    // When admins set the email of a student the same validation and normalization happens as when the user registers
    // This is mandatory as we perform case sensitive lookup on the email column to find accounts
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());


    await adminClient.request(
        `mutation PupilRevertEmailChange { pupilUpdate(pupilId: ${pupil.id} data: { email: "${pupil.email}" })}`
    );
});


test("Admin set Email of Student", async () => {
    const { student, client } = await studentOne;

    const otherEmail = `TEST+${randomBytes(5).toString("base64")}@lern-fair.de`;

    await adminClient.request(
        `mutation StudentChangeEmail { studentUpdate(studentId: ${student.id} data: { email: "${otherEmail}" })}`
    );

    const { me: { student: { email: updatedEmail } } } = await client.request(`query { me { student { email }}}`);
    assert.strictEqual(updatedEmail, otherEmail.toLowerCase());


    await adminClient.request(
        `mutation StudentRevertEmailChange { studentUpdate(studentId: ${student.id} data: { email: "${student.email}" })}`
    );
});