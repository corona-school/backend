import { adminClient, defaultClient, test } from './base';
import { pupilOne, studentOne } from './user';
import * as assert from 'assert';
import { expectFetch } from './mock';

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

const match1 = test('Manual Match creation', async () => {
    const { pupil, client: pupilClient } = await pupilWithMR;
    const { student, client: studentClient } = await studentWithMR;

    await adminClient.request(`
        mutation CreateManualMatch {
            matchAdd(poolName: "lern-fair-now", studentId: ${student.student.id} pupilId: ${pupil.pupil.id})
        }
    `);

    const { me: { pupil: p1 }} = await pupilClient.request(`
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

    const { me: { student: s1 }} = await studentClient.request(`
        query StudentWithMatch {
            me {
                student {
                    openMatchRequestCount
                    matches {
                        id
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

    return { id: s1.matches[0].id, pupil, student, pupilClient, studentClient };
});

void test('Create Chat for Match', async () => {
    const { id, pupil, student, pupilClient, studentClient } = await match1;

    // Creating a Chat ensures all users have accounts:

    // The pupil does not have one, it gets created:
    expectFetch({
        method: "GET",
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 404
    });

    expectFetch({
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        "method": "PUT",
        "body": JSON.stringify({"name": `${pupil.firstname} ${pupil.lastname}`, "email": [pupil.email.toLowerCase()], "role": "pupil"}),
        "responseStatus": 200
    });

    expectFetch({
        method: "GET",
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/pupil_${pupil.pupil.id}`,
        responseStatus: 200,
        response: {} // TODO: Mock properly
    });


    // The student has one:

    expectFetch({
        method: "GET",
        url: `https://api.talkjs.com/v1/mocked-talkjs-appid/users/student_${student.student.id}`,
        responseStatus: 200,
        response: {} // TODO: Mock properly
    });

    // Then the conversion is created:

    expectFetch({
        url: "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        method: "GET",
        responseStatus: 404
      });

        // TODO: Remove duplicate fetch
      expectFetch({
        url: "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        method: "GET",
        responseStatus: 404
      });

      // TODO: Why PUT twice?
      expectFetch({
        url: "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        method: "PUT",
        body: "{\"id\":\"*\",\"custom\":{\"type\":\"match\"}}",
        responseStatus: 200
      });

      expectFetch({
        url: "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        method: "PUT",
        body: `{\"custom\":{\"type\":\"match\"},\"participants\":[\"pupil_${pupil.pupil.id}\",\"student_${student.student.id}\"]}`,
        responseStatus: 200
      });

      expectFetch({
        url: "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        method: "GET",
        responseStatus: 200,
        response: { "id": "mocked" } // TODO: mock propery
      });

      // TODO: Why twice?
      expectFetch({
        "url": "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*",
        "method": "GET",
        "responseStatus": 200,
        "response": { "id": "mocked" } // TODO: mock properly
      });

      expectFetch({
        "url": "https://api.talkjs.com/v1/mocked-talkjs-appid/conversations/*/messages",
        "method": "POST",
        "body": "[{\"text\":\"Willkommen im Lern-Fair Chat!\",\"type\":\"SystemMessage\",\"custom\":{\"type\":\"first\"}}]",
        "responseStatus": 200
      });


    const { matchChatCreate: conversionID } = await pupilClient.request(`
        mutation PupilCreatesChat {
	        matchChatCreate(matcheeUserId: "${student.userID}")
        }
    `);
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
