import { assert } from "chai";
import * as sinon from "sinon";
import { Connection } from "typeorm";
import { saveMatchingToDB } from "../../../../../../common/administration/match-making/project-coaching/matches/save";
import databaseHelper from "../../../../../utils/databaseHelper";
import { createPupil, createStudent } from "../../../../../utils/test-data";
import { getStudentByWixID, Student } from "../../../../../../common/entity/Student";
import { getPupilByWixID, Pupil } from "../../../../../../common/entity/Pupil";

describe("Saving Project Coaching Matches", function() {
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

        //note: only use the openProjectMatchRequestCount property here, the other properties do not matter if purely testing saving
        const testTutors = [
            createStudent({
                openProjectMatchRequestCount: 3
            }),
            createStudent({
                openProjectMatchRequestCount: 1
            }),
            createStudent({
                openProjectMatchRequestCount: 2
            })
        ];
        const testTutees = [
            createPupil({
                openProjectMatchRequestCount: 1
            }),
            createPupil({
                openProjectMatchRequestCount: 2
            }),
            createPupil({
                openProjectMatchRequestCount: 1
            }),
            createPupil({
                openProjectMatchRequestCount: 1
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
        assert.deepEqual(tuteesMatched.map(t => t.openProjectMatchRequestCount), [0, 0, 0, 0]);
        assert.deepEqual(tutorsMatched.map(t => t.openProjectMatchRequestCount), [1, 0, 0]);
    });
});
