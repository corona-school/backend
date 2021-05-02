import { EntityManager } from "typeorm";
import { createMatching } from "./matching";
import { saveMatchingToDB } from "./matches/save";
import { validateMatching } from "./matching/validate";
import { tuteesToMatch } from "./people/tutees";
import { tutorsToMatch } from "./people/tutors";
import { notifyMatches } from "./matches/notify";
import { getLogger } from "../../../../jobs/utils/logging";
import { getStudentByWixID, Student } from "../../../entity/Student";
import { getPupilByWixID, Pupil } from "../../../entity/Pupil";
import { MatchMakingOptions } from "./types/options";
import { MatchMakingResult } from "./types/matchmaking-result";


const logger = getLogger();

/// Execute matching on all given tutors and tutees, respecting the given matching options.
export async function matchMakingWithPersons(tutorsToMatch: Student[], tuteesToMatch: Pupil[], options: MatchMakingOptions, manager: EntityManager): Promise<MatchMakingResult> {
    //create matching
    const { matching, stats } = await createMatching(tutorsToMatch, tuteesToMatch, manager, options.matchingAlgoSettings);

    //validate matching (including the current database state)
    const validationResult = await validateMatching(matching, manager);

    if (validationResult !== true) {
        // a problem occurred, validation failed
        const tutorUUID = validationResult.match.helper.uuid;
        const tuteeUUID = validationResult.match.helpee.uuid;
        logger.warn(`Matching failed, because of ${validationResult.problem} for match between tutor ${tutorUUID} and tutee ${tuteeUUID}`);
        throw new Error(`Matching failed for match (tutor: ${tutorUUID}, tutee: ${tuteeUUID})!`);
    }

    //print logging information
    logger.info(`Made new matches (dryRun: ${options.dryRun ? "TRUE": "FALSE"}): Matches made: ${JSON.stringify(matching)}`);
    logger.info(`Matching stats: ${JSON.stringify(stats)}`);

    //create return result based on dry run
    const result: MatchMakingResult = {
        dryRun: options.dryRun,
        matchingStats: stats,
        notifications: options.notifications,
        failedNotifications: null,
        createdMatches: null
    };
    if (!options.dryRun) {
        //save matching in database (such that the database is in the state as the matching was performed)
        const savedDatabaseMatches = await manager.transaction( async transactionManager => { //do this in a transaction, such that all or no matches were saved
            return await saveMatchingToDB(matching, transactionManager);
        });

        logger.info(`Successfully created ${savedDatabaseMatches.length} new tutoring matches.`);

        //notify all matches
        const notificationStates = await notifyMatches(savedDatabaseMatches, options.notifications, manager);

        return {
            ...result,
            createdMatches: savedDatabaseMatches,
            failedNotifications: notificationStates.filter(ns => !ns.isOK)
        };
    }
    else {
        return { //if dry run, only query the pupil and student pairs from the database and return them
            ...result,
            createdMatches: await Promise.all(matching.map(async m => ({
                pupil: await getPupilByWixID(manager, m.helpee.uuid),
                student: await getStudentByWixID(manager, m.helper.uuid)
            })))
        };
    }
}

export async function matchMakingOfAllPossibleMatches(manager: EntityManager, restrictToThoseWithConfirmedInterest: boolean, options: MatchMakingOptions = { dryRun: false, notifications: { email: true, sms: false}}) {
    // get data for matching
    const tutors = await tutorsToMatch(manager);
    const tutees = await tuteesToMatch(manager, restrictToThoseWithConfirmedInterest);

    await matchMakingWithPersons(tutors, tutees, options, manager);
}