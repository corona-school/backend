import { adminClient, defaultClient, test } from "./base";
import { pupilOne } from "./user";
import * as assert from "assert";

test("Pupil Request Match", async () => {
    const { client, pupil } = await pupilOne;

    // Pupil is a TUTEE by registration
    await client.request(`
        mutation {
            pupilCreateMatchRequest
        }
    `);

    // TODO assertion
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