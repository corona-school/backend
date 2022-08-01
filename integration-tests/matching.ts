import { adminClient, defaultClient, test } from "./base";
import { pupilOne } from "./user";

test("Pupil Request Match", async () => {
    const { client, pupil } = await pupilOne;

    // Pupil is not yet a TUTEE
    await client.requestShallFail(`
        mutation {
            pupilCreateMatchRequest
        }
    `);

    // TODO
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