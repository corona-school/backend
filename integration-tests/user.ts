import { test, createUserClient } from "./base";
import * as assert from "assert";
import { randomBytes } from "crypto";

export const pupilOne = test("Register Pupil", async () => {
    const client = createUserClient();

    const userRandom = randomBytes(5).toString("base64");

    await client.request(`
        mutation RegisterPupil {
            meRegisterPupil(data: {
                firstname: "firstname:${userRandom}"
                lastname: "lastname:${userRandom}"
                email: "test+${userRandom}@lern-fair.de"
                newsletter: false
                state: bw
                registrationSource: normal
            }) {
                id
            }
        }
    `);

    await client.request(`
        mutation BecomeTutee {
            meBecomeTutee(data: {
                subjects: [{ name: "Deutsch" }]
                languages: [Deutsch]
                learningGermanSince: more_than_four
                gradeAsInt: 10
            })
        }
    `);

    const { me: pupil } = await client.request(`
        query GetBasics {
            me {
                firstname
                lastname
                email
                pupil { id }
            }
        }
    `);

    assert.equal(pupil.firstname, `firstname:${userRandom}`);
    assert.equal(pupil.lastname, `lastname:${userRandom}`);
    assert.equal(pupil.email, `test+${userRandom}@lern-fair.de`.toLowerCase());

    return { client, pupil };
});