import { test } from './base';
import { adminClient } from './base/clients';
import { gql } from 'graphql-request';
import { randomBytes } from 'crypto';
import assert from 'assert';

const setup = test('Setup Configuration', async () => {
    // Ensure Rate Limits are deterministic when running the tests multiple times
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
});

void test('Plus student batch registration', async () => {
    await setup;
    const userRandom = () => randomBytes(5).toString('base64');

    const runId = Date.now();

    const res = await adminClient.request(gql`
        mutation registermany {
            studentRegisterPlusMany(data: {entries: [
                {  # fail because emails different
                    email: "test+${runId}+s1@lern-fair.de",
                    register: {
                        email: "test+differentEmail@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus
                    }
                },
                {  # invalid subject (to check if registration is rolled back properly)
                    email: "test+${runId}+s2@lern-fair.de",
                    register: {
                        email: "test+${runId}+s2@lern-fair.de",
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
                {  # try to update failed account (test removal of email whitespace)
                    email: "test+${runId}+s2@lern-fair.de ",
                    screen: {success: true}
                },
                {  # Now create it properly
                    email: "test+${runId}+s2@lern-fair.de ",
                    register: {
                        email: "test+${runId}+s2@lern-fair.de",
                        firstname: "*updatedF*",
                        lastname: "*updatedL*",
                        newsletter: false,
                        registrationSource: plus
                    },
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Französisch"}],
                        supportsInDaZ: false
                    },
                },
                {   # update previous
                    email: "test+${runId}+s2@lern-fair.de",
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Französisch"}],
                        supportsInDaZ: true  # update this
                    }
                    screen: {success: true}
                },
                {  # fail because account doesn't exist
                    email: "test+${runId}+s3@lern-fair.de",
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Mathematik"}],
                        supportsInDaZ: false
                    }
                },
                {  # fail because email is invalid
                    email: "test+${runId}+s?@@lern-fair.de",
                    register: {
                        email: "test+${runId}+s?@@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus
                    }
                },
            ]}) {email, reason, success}
        }
    `);

    assert.strictEqual(res.studentRegisterPlusMany[0].success, false);
    assert.strictEqual(res.studentRegisterPlusMany[1].success, false);
    assert.strictEqual(res.studentRegisterPlusMany[2].success, false);
    assert.strictEqual(res.studentRegisterPlusMany[3].success, true);
    assert.strictEqual(res.studentRegisterPlusMany[4].success, true);
    assert.strictEqual(res.studentRegisterPlusMany[5].success, false);
    assert.strictEqual(res.studentRegisterPlusMany[6].success, false);
});

void test('Plus pupil batch registration', async () => {
    await setup;
    const userRandom = () => randomBytes(5).toString('base64');

    const runId = Date.now();

    const res = await adminClient.request(gql`
        mutation registermany {
            pupilRegisterPlusMany(data: {entries: [
                {  # fail because emails different
                    email: "test+${runId}+p1@lern-fair.de",
                    register: {
                        email: "test+differentEmail@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus,
                        school: {
                            state: bw
                        }
                    }
                },
                {  # invalid subject (to check if registration is rolled back properly)
                    email: "test+${runId}+p2@lern-fair.de",
                    register: {
                        email: "test+${runId}+p2@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus,
                        school: {
                            state: be
                        }
                    },
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        gradeAsInt: 5,
                        subjects: [{name: "testÄÖÜ?ß"}],
                    }
                },
                {  # try to update failed account (test removal of email whitespace)
                    email: "test+${runId}+p2@lern-fair.de "
                },
                {  # Now create it properly
                    email: "test+${runId}+p2@lern-fair.de ",
                    register: {
                        email: "test+${runId}+p2@lern-fair.de",
                        firstname: "*updatedF*",
                        lastname: "*updatedL*",
                        newsletter: false,
                        registrationSource: plus,
                        school: {
                            state: be
                        }
                    },
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        gradeAsInt: 5,
                        subjects: [{name: "Französisch"}],
                    },
                },
                {   # update previous
                    email: "test+${runId}+p2@lern-fair.de",
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Englisch"}],
                        gradeAsInt: 5
                    }
                },
                {  # fail because account doesn't exist
                    email: "test+${runId}+p3@lern-fair.de",
                    activate: {
                        languages: [Albanisch, Franz_sisch],
                        subjects: [{name: "Mathematik"}],
                        gradeAsInt: 5
                    }
                },
                {  # fail because email is invalid
                    email: "test+${runId}+p?@@lern-fair.de",
                    register: {
                        email: "test+${runId}+p?@@lern-fair.de",
                        firstname: "f${userRandom()}",
                        lastname: "l${userRandom()}",
                        newsletter: false,
                        registrationSource: plus,
                        school: {
                            state: be
                        }
                    }
                },
            ]}) {email, reason, success}
        }
    `);

    assert.strictEqual(res.pupilRegisterPlusMany[0].success, false);
    assert.strictEqual(res.pupilRegisterPlusMany[1].success, false);
    assert.strictEqual(res.pupilRegisterPlusMany[2].success, false);
    assert.strictEqual(res.pupilRegisterPlusMany[3].success, true);
    assert.strictEqual(res.pupilRegisterPlusMany[4].success, true);
    assert.strictEqual(res.pupilRegisterPlusMany[5].success, false);
    assert.strictEqual(res.pupilRegisterPlusMany[6].success, false);
});
