import assert from 'assert';
import { randomBytes } from 'crypto';
import { test } from './base';
import { adminClient, createUserClient } from './base/clients';
import { instructorOne, instructorTwo, pupilOne, studentOne } from './01_user';

const screenerOne = test('Admin can create Screener Account', async () => {
    const email = `test+${randomBytes(10).toString('base64')}@lern-fair.de`;
    const firstname = randomBytes(10).toString('base64');
    const lastname = randomBytes(10).toString('base64');
    const password = randomBytes(10).toString('base64');

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

    const { userDetermineLoginOptions } = await client.request(`
        mutation DetermineScreenerLogin { userDetermineLoginOptions(email: "${email}") }
    `);

    assert.strictEqual(userDetermineLoginOptions, 'password');

    await client.request(`
        mutation ScreenerLoginWithPassword { loginPassword(email: "${email}" password: "${password}")}
    `);

    const { myRoles } = await client.request(`
        query ScreenerGetRoles { myRoles }
    `);

    assert.ok(myRoles.includes('SCREENER'), 'Screener must have SCREENER Role');

    return { client, screener: { firstname, lastname, email } };
});

const pupilWithScreening = test('Admin can request Pupils to Screening', async () => {
    const { pupil, client } = await pupilOne;

    await adminClient.request(`
        mutation RequestScreening { pupilCreateScreening(pupilId: ${pupil.pupil.id})}
    `);

    return { pupil, client };
});

void test('Screener can Query Users to Screen', async () => {
    const { client } = await screenerOne;
    const { instructor } = await instructorOne;
    const { pupil } = await pupilWithScreening;

    /* const { usersSearch: nothingFound } = await client.request(`
        query FindUsersToScreenInexact {
            usersSearch(query: "${instructor.firstname}", take: 1) {
                student { firstname lastname }
            }
        }
    `);

    assert.strictEqual(nothingFound.length, 0); */

    const { usersSearch } = await client.request(`
        query FindUsersToScreen {
            usersSearch(query: "${instructor.firstname} ${instructor.lastname}", take: 1) {
                student {
                  firstname
                  lastname
                  subjectsFormatted { name }
                  languages

                  matches {
                    pupil { firstname lastname }
                    subjectsFormatted { name }
                    dissolved
                    dissolvedAt
                    studentFirstMatchRequest
                  }

                  tutorScreenings {
                    success
                    comment
                    jobStatus
                    knowsCoronaSchoolFrom
                    createdAt
                    screener { firstname lastname }
                  }

                  instructorScreenings {
                    success
                    comment
                    jobStatus
                    knowsCoronaSchoolFrom
                    createdAt
                    screener { firstname lastname }
                  }
                }
            }
        }
    `);

    assert.strictEqual(usersSearch.length, 1);
    assert.strictEqual(usersSearch[0].student.firstname, instructor.firstname);

    const { usersSearch: usersSearch2 } = await client.request(`
        query FindUsersToScreen {
            usersSearch(query: "${pupil.firstname} ${pupil.lastname}", take: 1) {
                pupil {
                    firstname
                    lastname
                    subjectsFormatted { name }
                    gradeAsInt
                    learningGermanSince
                    languages

                    screenings {
                        id
                        createdAt
                        updatedAt
                        status
                        invalidated
                        comment
                    }

                    matches {
                        pupil { firstname lastname }
                        subjectsFormatted { name }
                        dissolved
                        dissolvedAt
                        pupilFirstMatchRequest
                    }
                }
            }
        }
    `);

    assert.strictEqual(usersSearch2.length, 1);
    assert.strictEqual(usersSearch2[0].pupil.firstname, pupil.firstname);

    const { studentsToBeScreened } = await client.request(`
        query FindStudentsToBeScreened {
            studentsToBeScreened {
                firstname
                lastname
            }
        }
    `);

    assert.ok(studentsToBeScreened.some((it) => it.firstname === instructor.firstname));

    const { pupilsToBeScreened } = await client.request(`
        query FindPupilsToBeScreened {
            pupilsToBeScreened {
                firstname
                lastname
            }
        }
    `);

    assert.ok(pupilsToBeScreened.some((it) => it.firstname === pupil.firstname));
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

void test('Screen Pupil One', async () => {
    const { pupil } = await pupilWithScreening;
    const { client: screenerClient, screener } = await screenerOne;

    const { pupilsToBeScreened } = await screenerClient.request(`
        query FindPupilScreening {
            pupilsToBeScreened {
                firstname
                screenings { id status }
            }
        }
    `);

    const pupilToBeScreened = pupilsToBeScreened.find((it) => it.firstname === pupil.firstname);
    assert.ok(pupilToBeScreened !== undefined);
    const screening = pupilToBeScreened.screenings[0];
    assert.ok(screening !== undefined);
    assert.strictEqual(screening.status, 'pending');

    await screenerClient.request(`
        mutation AddDisputedScreening { pupilUpdateScreening(pupilScreeningId: ${screening.id}, data: {
            status: dispute,
            comment: "Some comment"
        })}
    `);

    const { pupilsToBeScreened: pupilsToBeScreenedDisputed } = await screenerClient.request(`
        query FindPupilScreeningDisputed {
            pupilsToBeScreened(onlyDisputed: true) {
                firstname
                screenings { id status comment screeners { firstname lastname } }
            }
        }
    `);

    const pupilToBeScreenedDisputed = pupilsToBeScreenedDisputed.find((it) => it.firstname === pupil.firstname);
    assert.ok(pupilToBeScreenedDisputed !== undefined);
    const screeningDisputed = pupilToBeScreenedDisputed.screenings[0];
    assert.ok(screeningDisputed !== undefined);
    assert.strictEqual(screeningDisputed.status, 'dispute');
    assert.strictEqual(screeningDisputed.screeners[0].firstname, screener.firstname);

    await screenerClient.request(`
        mutation AddScreeningResult {
            pupilUpdateScreening(pupilScreeningId: ${screeningDisputed.id}, data: { status: success })
        }
    `);
});
