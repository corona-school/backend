import { adminClient, test } from './base';
import { gql } from 'graphql-request';
import { randomBytes } from 'crypto';
import assert from 'assert';

const setup = test("Setup Configuration", async () => {
    // Ensure Rate Limits are deterministic when running the tests multiple times
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
});

test("Plus student batch registration", async () => {
    await setup;
    const userRandom = () => randomBytes(5).toString("base64");

    const res = await adminClient.request(gql`
        mutation registermany {
            studentRegisterPlusMany(data: {entries: [
                {  # fail because emails different
                    email: "test+it+s1@lern-fair.de",
                    register: {
                        email: "test+differentEmail@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus
                    }
                },
                {  # should pass
                    email: "test+it+s2@lern-fair.de",
                    register: {
                        email: "test+it+s2@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus
                    },
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "testÄÖÜ?ß"}],
                        supportsInDaZ: false
                    }
                },
                {  # account already exists, update some properties
                    email: "test+it+s2@lern-fair.de ",
                    register: {
                        email: "test+it+s2@lern-fair.de",
                        firstname: "*updatedF*",
                        lastname: "*updatedL*",
                        newsletter: false,
                        registrationSource: plus
                    },
                    screen: {success: true}
                },
                {  # fail because account doesn't exist
                    email: "test+it+s3@lern-fair.de",
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Mathematik"}],
                        supportsInDaZ: false
                    }
                },
                {  # fail because email is invalid
                    email: "test+it+s?@@lern-fair.de",
                    register: {
                        email: "test+it+s?@@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus
                    }
                },
            ]}) {email, reason, success}
        }
    `);
});
