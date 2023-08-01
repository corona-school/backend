import assert from "assert";
import { adminClient, test } from "./base";
import { instructorOne, instructorTwo, studentOne } from "./user";


export const screenedInstructorOne = test('Screen Instructor One successfully', async () => {
    const { client, instructor } = await instructorOne;

    await adminClient.request(`
        mutation ScreenInstructorOne {
            studentInstructorScreeningCreate(
                studentId: ${instructor.student.id}
                screening: {success: true comment: "" knowsCoronaSchoolFrom: ""}
            )
        }
    `);

    // Refresh roles
    await client.request(`mutation { loginRefresh }`);

    const { myRoles } = await client.request(`query GetRoles { myRoles }`);
    assert.deepStrictEqual(myRoles, ['UNAUTHENTICATED', 'USER', 'STUDENT', 'INSTRUCTOR']);
    // Got the INSTRUCTOR role!

    return { client, instructor };
});

export const screenedInstructorTwo = test('Screen Instructor Two successfully', async () => {
    const { client, instructor } = await instructorTwo;

    await adminClient.request(`
        mutation ScreenInstructorOne {
            studentInstructorScreeningCreate(
                studentId: ${instructor.student.id}
                screening: {success: true comment: "" knowsCoronaSchoolFrom: ""}
            )
        }
    `);

    // Refresh roles
    await client.request(`mutation { loginRefresh }`);

    const { myRoles } = await client.request(`query GetRoles { myRoles }`);
    assert.deepStrictEqual(myRoles, ['UNAUTHENTICATED', 'USER', 'STUDENT', 'INSTRUCTOR']);
    // Got the INSTRUCTOR role!

    return { client, instructor };
});

export const screenedTutorOne = test('Screen Tutor One successfully', async () => {
    const { client, student } = await studentOne;

    await adminClient.request(`
        mutation ScreenInstructorOne {
            studentTutorScreeningCreate(
                studentId: ${student.student.id}
                screening: {success: true comment: "" knowsCoronaSchoolFrom: ""}
            )
        }
    `);

    // Refresh roles
    await client.request(`mutation { loginRefresh }`);

    const { myRoles } = await client.request(`query GetRoles { myRoles }`);
    assert.deepStrictEqual(myRoles, ['UNAUTHENTICATED', 'USER', 'STUDENT', 'TUTOR']);
    // Got the TUTOR role!

    return { client, student };
});