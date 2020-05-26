import { createReadStream } from "fs";
import { parse, ParseResult } from "papaparse";
import {
    Student,
    getStudentByEmail,
    getStudentByWixID,
    activeMatchCountOfStudent,
} from "../../../../common/entity/Student";
import { createConnection, EntityManager, Connection } from "typeorm";
import { parsePromise } from "../../../utils/parsing";
import {
    Pupil,
    getPupilByWixID,
    activeMatchCountOfPupil,
} from "../../../../common/entity/Pupil";
import { Screening } from "../../../../common/entity/Screening";
import {
    getScreenerWithNumberFromOldDB,
    Screener,
} from "../../../../common/entity/Screener";
import { Paths } from "../paths";
import {
    alreadyMatched,
    Match,
    SourceType,
} from "../../../../common/entity/Match";
import { matchTwo } from "../../../backend/matching";

/***********************************
 *
 * Use this to import results from the matching algorithm into the database
 *
 */

function extractMatchesData(row: object) {
    return {
        number: row[""],
        pupilWixID: row["Schueler"],
        studentWixID: row["Student"],
    };
}

export async function importResultsFromMatchingAlgorithm(
    manager: EntityManager,
    parseConfig
) {
    const file = createReadStream(Paths.matchingResults.matches);
    const results: ParseResult = await parsePromise(file, parseConfig);
    file.close();

    for (const row of results.data) {
        //read object
        const data = extractMatchesData(row);

        //get screener and pupil that should be matched
        const student = await getStudentByWixID(manager, data.studentWixID);
        const pupil = await getPupilByWixID(manager, data.pupilWixID);

        //if one of both is not existant, log an error and skip
        if (!student || !pupil) {
            console.log(
                `ERROR: trying to match student with wixID ${data.studentWixID} with pupil with wixID ${data.pupilWixID} failed, because one of them does not exist in local Database!`
            );
            continue;
        }

        //if one of both is already matches, log an error and skip
        if (await alreadyMatched(student, pupil, manager)) {
            console.log(
                `ERROR: student with wixID ${data.studentWixID} is already matched with pupil with wixID ${data.pupilWixID}`
            );
            continue;
        }

        //if one of both has already an active match...
        if (
            (await activeMatchCountOfStudent(student, manager)) > 0 ||
            (await activeMatchCountOfPupil(pupil, manager)) > 0
        ) {
            console.log(
                `ERROR: student with wixID ${data.studentWixID} or pupil with wixID ${data.pupilWixID} already has an active match. Currently, another match is not allowed now. Skipping that...`
            );
            continue;
        }

        //create a match from both
        try {
            const match = await matchTwo(student, pupil, manager);

            //also mark this as an match matched using an external matching algorithm
            match.source = SourceType.MATCHEDEXTERNAL;

            //save chagnes...
            await manager.save(match);
        } catch (e) {
            console.log(
                `Cannot create Match between pupil ${data.pupilWixID} and student ${data.studentWixID}, error: ${e}`
            );
        }
    }
}
