import { assert } from "chai";
import sinon from "sinon";
import {Connection} from "typeorm";
import { validateMatching, ValidationResult } from "../../../../../../common/administration/match-making/tutoring/matching/validate";
import { Match } from "../../../../../../common/entity/Match";
import databaseHelper from "../../../../../utils/databaseHelper";
import { createMatch, createPupil, createScreening, createStudent } from "../../../../../utils/test-data";

describe("Match validation", function() {
    this.timeout(5000);

    // The connection that should be used for tests
    let connection: Connection;
    let sandbox = sinon.createSandbox();

    before(async () => {
        connection = await databaseHelper.createConnection();
    });

    afterEach(async () => {
        //restore sandbox
        sandbox.restore();

        //clear database after each test
        await connection.synchronize(true);
    });

    after(async () => {
        await databaseHelper.closeConnection(connection);
    });


    it("complex match validation", async () => {
        // ARRANGE
        const manager = connection.manager; // get the default manager for the connection

        const testTutors = [
            createStudent({
                subjects: [
                    {
                        name: "Deutsch",
                        grade: {
                            min: 3,
                            max: 13
                        }
                    }
                ],
                openMatchRequestCount: 1
            }),
            createStudent({
                subjects: [
                    {
                        name: "Physik",
                        grade: {
                            min: 9,
                            max: 12
                        }
                    }
                ],
                active: true,
                openMatchRequestCount: 1,
                screening: createScreening({
                    success: true
                })
            }),
            createStudent({
                subjects: [
                    {
                        name: "Erdkunde",
                        grade: {
                            min: 9,
                            max: 10
                        }
                    }
                ],
                active: true,
                openMatchRequestCount: 1,
                screening: createScreening({
                    success: true
                })
            }),
            createStudent({
                subjects: [
                    {
                        name: "Geschichte",
                        grade: {
                            min: 5,
                            max: 10
                        }
                    }
                ],
                active: true,
                openMatchRequestCount: 1,
                screening: createScreening({
                    success: true
                })
            })
        ];
        const testTutees = [
            createPupil({
                subjects: [
                    {
                        name: "Deutsch"
                    },
                    {
                        name: "Englisch"
                    }
                ],
                openMatchRequestCount: 1
            }),
            createPupil({
                subjects: [
                    {
                        name: "Chemie"
                    },
                    {
                        name: "Physik"
                    }
                ],
                grade: 12,
                openMatchRequestCount: 1
            }),
            createPupil({
                subjects: [
                    {
                        name: "Erdkunde"
                    }
                ],
                grade: 11,
                openMatchRequestCount: 1
            }),
            createPupil({
                subjects: [
                    {
                        name: "Geschichte"
                    }
                ],
                grade: 5,
                openMatchRequestCount: 0
            })
        ];

        const additionalMatches = [ //matches that are used in the test, but weren't expected in the validation result
            createMatch({
                pupil: testTutees[0],
                student: testTutors[0]
            })
        ];

        // save all student, pupils and matches that are required for the checks of _new_ matches below
        await manager.save(testTutors);
        await manager.save(testTutees);
        await manager.save(testTutees);
        await manager.save(additionalMatches);

        const allowedMatches = [
            createMatch({
                pupil: testTutees[1],
                student: testTutors[1]
            })
        ];
        const forbiddenMatches = [
            createMatch({ //they were matched together previously
                pupil: testTutees[0],
                student: testTutors[0]
            }),
            createMatch({ //they have no overlapping subjects
                pupil: testTutees[0],
                student: testTutors[1]
            }),
            createMatch({ //they have no matching grade
                pupil: testTutees[2],
                student: testTutors[2]
            }),
            createMatch({ // they have no need for matches
                pupil: testTutees[3],
                student: testTutors[3]
            })
        ];

        // const allMatches = [...additionalMatches, ...allowedMatches, ...forbiddenMatches];

        // ACT
        const toExpectedMatchingFormat = (m: Match) => ({
            helper: {
                uuid: m.student.wix_id
            },
            helpee: {
                uuid: m.pupil.wix_id
            }
        });

        const validatedMatchesResult = await validateMatching(allowedMatches.map(toExpectedMatchingFormat), manager);
        const rejectedMatchesResult = await Promise.all(forbiddenMatches.map(toExpectedMatchingFormat).map(m => validateMatching([m], manager))); //each, one by one, such that every match must be falsy

        // ASSERT
        const toProblemError = (vr: ValidationResult) => vr !== true && (vr?.problem.split(" ")[1] ?? "unknown");

        assert.isTrue(validatedMatchesResult);
        assert.notInclude(rejectedMatchesResult, true);
        assert.deepEqual(rejectedMatchesResult.map(toProblemError), ["ensureNeverPreviouslyMatchedTogether", "ensureOverlappingSubjects", "ensureOverlappingSubjects", "ensureOpenMatchRequests"]);
    });
});
