import { adminClient, defaultClient, test } from "./base";
import { pupilOne } from "./user";
import * as assert from "assert";

test("Pupil Request Match", async () => {
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

    const { me : p1 } = await client.request(`
        query GetOpenMatchRequestCount {
            me {
                pupil { 
                    openMatchRequestCount
                }
            }
        }
    `);

    assert.strictEqual(p1.pupil.openMatchRequestCount, 1);
    
});

test("Anyone Request Matching Statistics", async () => {
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