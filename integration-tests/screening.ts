import assert from "assert";
import { randomBytes } from "crypto";
import { adminClient, createUserClient, test } from "./base";
import { instructorOne, instructorTwo, studentOne } from "./user";

const screenerOne = test('Admin can create Screener Account', async () => {
    const email = `test+${randomBytes(10).toString("base64")}@lern-fair.de`;
    const firstname = randomBytes(10).toString("base64");
    const lastname = randomBytes(10).toString("base64");
    const password = randomBytes(10).toString("base64");

    const { screenerCreate: token } = await adminClient.request(`
        mutation CreateScreenerAccount {
            screenerCreate(data: { 
                email: "${email}",
                firstname: "${firstname}",
                lastname: "${lastname}"
            })
        }
    `);

    const client = createUserClient();

    await client.request(`
        mutation ScreenerCanLogin { loginToken(token: "${token}") }
    `);

    await client.request(`
        mutation ScreenerSetPassword { passwordCreate(password: "${password}") }
    `);

    await client.request(`
        mutation ScreenerLogout { logout }
    `);

    await client.request(`
        mutation ScreenerLoginWithPassword { loginPassword(email: "${email}" password: "${password}")}
    `);

    const { myRoles } = await client.request(`
        query ScreenerGetRoles { myRoles }
    `);

    assert.ok(myRoles.includes('SCREENER'), "Screener must have SCREENER Role");

    return { client };
});

void test('Screener can Query Users to Screen', async () => {
    const { client } = await screenerOne;
    const { instructor } = await instructorOne;

    const { usersSearch: nothingFound } = await client.request(`
        query FindUsersToScreenInexact {
            usersSearch(query: "${instructor.firstname}", take: 1) {
                student { firstname lastname }
            }
        }
    `);

    assert.strictEqual(nothingFound.length, 0);

    const { usersSearch } = await client.request(`
        query FindUsersToScreen {
            usersSearch(query: "${instructor.firstname} ${instructor.lastname}", take: 1) {
                student { firstname lastname }
            }
        }
    `);

    assert.strictEqual(usersSearch.length, 1);
    assert.strictEqual(usersSearch[0].student.firstname, instructor.firstname);
});


export const screenedInstructorOne = test('Screen Instructor One successfully', async () => {
    const { client, instructor } = await instructorOne;
    const { client: screenerClient } = await screenerOne;

    await screenerClient.request(`
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
    const { client: screenerClient } = await screenerOne;

    await screenerClient.request(`
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
    const { client: screenerClient } = await screenerOne;

    await screenerClient.request(`
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