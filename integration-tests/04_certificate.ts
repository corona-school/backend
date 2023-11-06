import assert from 'assert';
import { test } from './base';
import { match1 } from './03_matching';

const signature =
    'data:image/png;base64,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';

const certRequest = test('Student requests Certificate', async () => {
    const { pupilClient, studentClient, pupil, student, uuid: matchUuid } = await match1;

    await studentClient.requestShallFail(`
        mutation RequestMatchCertificateWithWrongMatchID {
            participationCertificateCreate(matchId: "Invalid UUID", certificateData: {
                startDate: "2023-06-06T15:56:55.808Z",
                endDate: "2023-08-06T15:56:55.808Z",
                subjects: "test",
                hoursPerWeek: 10,
                hoursTotal: 20,
                medium: "test",
                activities: "test",
                ongoingLessons: true,
                state: "awaiting-approval"
            })
        }
    `);

    await studentClient.request(`
        mutation RequestMatchCertificate {
            participationCertificateCreate(matchId: "${matchUuid}", certificateData: {
                startDate: "2023-06-06T15:56:55.808Z",
                endDate: "2023-08-06T15:56:55.808Z",
                subjects: "test",
                hoursPerWeek: 10,
                hoursTotal: 20,
                medium: "test",
                activities: "test",
                ongoingLessons: true,
                state: "awaiting-approval"
            })
        }
    `);

    const {
        me: {
            student: { participationCertificates },
        },
    } = await studentClient.request(`
        query GetCertificates {
            me {
                student {
                    participationCertificates {
                      uuid
                      pupilId
                      state
                    }
                }
            }
        }
    `);

    assert.strictEqual(participationCertificates.length, 1);
    assert.strictEqual(participationCertificates[0].pupilId, pupil.pupil.id);
    assert.strictEqual(participationCertificates[0].state, 'awaiting-approval');

    return { pupil, student, pupilClient, studentClient, uuid: participationCertificates[0].uuid };
});

const signedCert = test('Pupil signs Certificate', async () => {
    const { pupil, student, pupilClient, studentClient, uuid } = await certRequest;

    const {
        me: {
            pupil: { participationCertificatesToSign },
        },
    } = await pupilClient.request(`
        query GetCertsToSign {
            me {
                pupil {
                    participationCertificatesToSign {
                        uuid
                        state
                        studentId
                    }
                }
            }
        }
    `);

    assert.strictEqual(participationCertificatesToSign.length, 1);
    assert.strictEqual(participationCertificatesToSign[0].uuid, uuid);

    await pupilClient.requestShallFail(`
        mutation SignCertificateInvalidSignature {
            participationCertificateSign(certificateId: "${uuid}", signatureLocation: "Apollo 11", signatureParent:"No Base64?")
        }
    `);

    await pupilClient.request(`
        mutation SignCertificate {
            participationCertificateSign(certificateId: "${uuid}", signatureLocation: "Apollo 11", signatureParent:"${signature}")
        }
    `);

    return { pupil, student, pupilClient, studentClient, uuid };
});

void test('Student can download Signed Certificate', async () => {
    const { pupil, pupilClient, student, studentClient, uuid } = await signedCert;

    const {
        me: {
            student: { participationCertificates },
        },
    } = await studentClient.request(`
        query GetSignedCertificates {
            me {
                student {
                    participationCertificates {
                    uuid
                    pupilId
                    state
                    }
                }
            }
        }
    `);

    assert.strictEqual(participationCertificates.length, 1);
    assert.strictEqual(participationCertificates[0].uuid, uuid);
    assert.strictEqual(participationCertificates[0].state, 'approved');
});
