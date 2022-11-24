import assert from "assert";
import { adminClient, test } from "./base";
import { instructorOne } from "./user";


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