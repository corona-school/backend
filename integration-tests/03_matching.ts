import { test } from './base';
import { adminClient, defaultClient } from './base/clients';
import { pupilOne, studentOne } from './01_user';
import * as assert from 'assert';
import { expectFetch } from './base/mock';
import systemMessages from '../common/chat/localization';

const pupilWithMR = test('Pupil Request Match', async () => {
    const { client, pupil } = await pupilOne;

    const { me: p } = await client.request(`
    query GetOpenMatchRequestCount {
        me {
            pupil {
                openMatchRequestCount
            }
        }
     }
    `);

    // Match request is 0 after registration
    assert.strictEqual(p.pupil.openMatchRequestCount, 0);

    await client.request(`
        mutation {
            pupilCreateMatchRequest
        }
    `);

    const { me: p1 } = await client.request(`
        query GetOpenMatchRequestCount {
            me {
                pupil {
                    openMatchRequestCount
                }
            }
        }
    `);

    assert.strictEqual(p1.pupil.openMatchRequestCount, 1);
    return { client, pupil };
});

const studentWithMR = test('Student Request Match', async () => {
    const { client, student } = await studentOne;

    const { me: s } = await client.request(`
    query GetOpenMatchRequestCount {
        me {
            student {
                openMatchRequestCount
            }
        }
     }
    `);

    // Match request is 0 after registration
    assert.strictEqual(s.student.openMatchRequestCount, 0);

    await client.request(`
        mutation {
            studentCreateMatchRequest
        }
    `);

    const { me: s1 } = await client.request(`
        query GetOpenMatchRequestCount {
            me {
                student {
                    openMatchRequestCount
                }
            }
        }
    `);

    assert.strictEqual(s1.student.openMatchRequestCount, 1);
    return { client, student };
});

export const match1 = test('Manual Match creation', async () => {
    const { pupil, client: pupilClient } = await pupilWithMR;
    const { student, client: studentClient } = await studentWithMR;

    await adminClient.request(`
        mutation CreateManualMatch {
            matchAdd(poolName: "lern-fair-now", studentId: ${student.student.id} pupilId: ${pupil.pupil.id})
        }
    `);

    const {
        me: { pupil: p1 },
    } = await pupilClient.request(`
        query PupilWithMatch {
            me {
                pupil {
                    openMatchRequestCount
                    matches {
                        id
                        dissolved
                        student { firstname lastname }
                    }
                }
            }
        }
    `);

    assert.strictEqual(p1.openMatchRequestCount, 0);
    assert.strictEqual(p1.matches.length, 1);
    assert.strictEqual(p1.matches[0].dissolved, false);
    assert.strictEqual(p1.matches[0].student.firstname, student.firstname);
    assert.strictEqual(p1.matches[0].student.lastname, student.lastname);

    const {
        me: { student: s1 },
    } = await studentClient.request(`
        query StudentWithMatch {
            me {
                student {
                    openMatchRequestCount
                    matches {
                        id
                        uuid
                        dissolved
                        pupil { firstname lastname }
                    }
                }
            }
        }
    `);

    assert.strictEqual(s1.openMatchRequestCount, 0);
    assert.strictEqual(s1.matches.length, 1);
    assert.strictEqual(s1.matches[0].dissolved, false);
    assert.strictEqual(s1.matches[0].pupil.firstname, pupil.firstname);
    assert.strictEqual(s1.matches[0].pupil.lastname, pupil.lastname);

    return { id: s1.matches[0].id, uuid: s1.matches[0].uuid, pupil, student, pupilClient, studentClient };
});

void test('Create Chat for Match', async () => {
    const { id, pupil, student, pupilClient, studentClient } = await match1;

    // Creating a Chat ensures all users have accounts:

    // The pupil does not have one, it gets created:
    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 404,
    });

    // The student has one:
    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/student_${student.student.id}`,
        responseStatus: 200,
        response: {}, // TODO: Mock properly
    });

    expectFetch({
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        method: 'PUT',
        body: JSON.stringify({ name: `${pupil.firstname} ${pupil.lastname.charAt(0).concat('.')}`, email: [pupil.email.toLowerCase()], role: 'pupil' }),
        responseStatus: 200,
    });

    expectFetch({
        method: 'GET',
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 200,
        response: {}, // TODO: Mock properly
    });

    // Then the conversion is created:

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'GET',
        responseStatus: 404,
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'PUT',
        body: `{"welcomeMessages":["${systemMessages.de.oneOnOne}"],"custom":{"createdBy":"pupil/${pupil.pupil.id}","match":"{\\\\"matchId\\\\":${id}}"},"participants":["pupil_${pupil.pupil.id}","student_${student.student.id}"]}`,
        responseStatus: 200,
    });

    expectFetch({
        url: 'https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*',
        method: 'GET',
        responseStatus: 200,
        response: { id: 'mocked' }, // TODO: mock propery
    });

    const { matchChatCreate: conversationID } = await pupilClient.request(`
        mutation PupilCreatesChat {
	        matchChatCreate(matcheeUserId: "${student.userID}")
        }
    `);

    assert.strictEqual(conversationID, 'mocked');
});

void test('Anyone Request Matching Statistics', async () => {
    await defaultClient.request(`
        query {
            match_pool(name: "lern-fair-now") {
                statistics {
                    matchesByMonth
                    averageMatchesPerMonth
                    predictedPupilMatchTime
                    subjectDemand { subject demand }
                }
                studentsToMatchCount
            }
        }
    `);
});
