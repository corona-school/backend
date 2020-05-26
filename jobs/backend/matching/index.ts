import {
    intersection,
    removeStudentWithEmail,
    randomIntFromInterval,
    gradeAsInt,
} from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getLogger } from "log4js";

import { createConnection, Connection, EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";

import { Pupil } from "../../../common/entity/Pupil";
import { insertTestData } from "./testdata";
import {
    convertToSubjectWithGradeDetail,
    intersectionWithRespectToGrade,
    subjectsAsArray,
} from "./subjectsutils";
import {
    getUnmatchedPupils,
    getUnmatchedAndVerifiedStudents,
} from "./dbconnection";
import { Match, haveDissolvedMatch } from "../../../common/entity/Match";

const logger = getLogger();

async function match(
    student: Student,
    pupil: Pupil,
    transactionManager: EntityManager
) {
    //create random string
    const matchID = uuidv4();

    //create a meeting proposal
    var meetingProposal = new Date();
    //date -> always tomorrow
    meetingProposal.setDate(meetingProposal.getDate() + 1);
    //time -> always between 9am and 7pm, in one hour distance
    meetingProposal.setMilliseconds(0);
    meetingProposal.setMinutes(0);
    meetingProposal.setHours(15);

    //save match, including meeting proposal in database
    const match = new Match();
    match.uuid = matchID;
    match.dissolved = false;
    match.proposedTime = meetingProposal;
    match.student = student;
    match.pupil = pupil;

    //save changes to db
    await transactionManager.save(match);

    logger.info(
        `matched student ${student.email} with pupil ${
            pupil.email
        } and meeting proposal ${meetingProposal.toLocaleTimeString()}`
    );
    return match;
}
export { match as matchTwo };

async function makeMatchings(transactionManager: EntityManager) {
    //for every unmatched pupil, find a fitting (by subject) student that it will be matched to
    const unmatchedPupils = await getUnmatchedPupils(transactionManager);
    let unmatchedAndVerifiedStudents = await getUnmatchedAndVerifiedStudents(
        transactionManager
    );

    let foundMatches: Match[] = [];

    for (var p of unmatchedPupils) {
        //find all unmatched and verified students, that have the same subjects as the pupil AND WHOSE GRADES FIT TOGETHER
        const studentsWithSubjectIntersection = unmatchedAndVerifiedStudents.filter(
            (s) => {
                return (
                    intersectionWithRespectToGrade(
                        subjectsAsArray(s.subjects),
                        subjectsAsArray(p.subjects),
                        gradeAsInt(p.grade)
                    ).length > 0
                );
            }
        );

        //filter out those students that were previously matched with the pupil //TODO: make helper function from the following
        const fittingStudents: Student[] = [];
        for (const s of studentsWithSubjectIntersection) {
            if (!(await haveDissolvedMatch(s, p, transactionManager))) {
                fittingStudents.push(s);
            }
        }

        //if no fitting students, then skip this student
        if (fittingStudents.length <= 0) {
            logger.info(`No fitting student found for pupil ${p.email}.`);
            continue;
        }

        const s = fittingStudents[0];

        //match p with the first student s that fits
        const m = await match(s, p, transactionManager);
        foundMatches.push(m);

        //remove student s from the unmatchedAndVerifiedStudents
        unmatchedAndVerifiedStudents = removeStudentWithEmail(
            unmatchedAndVerifiedStudents,
            s.email
        );
    }
    logger.info(`# of Found new matches: ${foundMatches.length}`);

    //return the found matches
    return foundMatches;
}

//main matching function, that matches every possible pair of matchings
export async function matchWhatPossible(manager: EntityManager) {
    //insert test data
    //await insertTestData(transactionManager)
    await makeMatchings(manager);
}
