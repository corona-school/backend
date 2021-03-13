import { assert } from "chai";
import * as sinon from "sinon";
import { Connection } from "typeorm";
import { saveMatchingToDB } from "../../../../../../common/administration/match-making/tutoring/matches/save";
import databaseHelper from "../../../../../utils/databaseHelper";
import { createPupil, createScreening, createStudent } from "../../../../../utils/test-data";
import { getStudentByWixID, Student } from "../../../../../../common/entity/Student";
import { getPupilByWixID, Pupil } from "../../../../../../common/entity/Pupil";

describe("Saving Tutoring Matches", function() {
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


    it("multiple matches with multiple match requests", async () => {
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
                openMatchRequestCount: 3
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
                            max: 13
                        }
                    }
                ],
                active: true,
                openMatchRequestCount: 2,
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
                openMatchRequestCount: 1,
                grade: 6
            }),
            createPupil({
                subjects: [
                    {
                        name: "Deutsch"
                    },
                    {
                        name: "Physik"
                    }
                ],
                grade: 12,
                openMatchRequestCount: 2
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
                        name: "Erdkunde"
                    }
                ],
                grade: 9,
                openMatchRequestCount: 1
            })
        ];

        // save all student, pupils and matches that are required for the checks of _new_ matches below
        await manager.save(testTutors);
        await manager.save(testTutees);

        const matchesToMake = [
            {
                helper: testTutors[0],
                helpee: testTutees[0]
            },
            {
                helper: testTutors[0],
                helpee: testTutees[1]
            },
            {
                helper: testTutors[1],
                helpee: testTutees[1]
            },
            {
                helper: testTutors[2],
                helpee: testTutees[2]
            },
            {
                helper: testTutors[2],
                helpee: testTutees[3]
            }
        ];

        // ACT
        const toExpectedMatchForm = (m: {helper: Student, helpee: Pupil}) => ({
            helper: {
                uuid: m.helper.wix_id
            },
            helpee: {
                uuid: m.helpee.wix_id
            }
        });

        const madeMatches = await saveMatchingToDB(matchesToMake.map(toExpectedMatchForm), manager);
        const tuteesMatched = await Promise.all(testTutees.map(t => getPupilByWixID(manager, t.wix_id)));
        const tutorsMatched = await Promise.all(testTutors.map(t => getStudentByWixID(manager, t.wix_id)));

        // ASSERT
        assert.deepEqual(tuteesMatched.map(t => t.openMatchRequestCount), [0, 0, 0, 0]);
        assert.deepEqual(tutorsMatched.map( t => t.openMatchRequestCount), [1, 0, 0]);
    });
});
