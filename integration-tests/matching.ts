import { adminClient, test } from "./base";
import { pupilOne } from "./user";

test("Pupil Request Match", async () => {
    const { client, pupil } = await pupilOne;

    // Pupil is not yet a TUTEE
    await client.requestShallFail(`
        mutation {
            pupilCreateMatchRequest
        }
    `);

});