import { EntityManager } from "typeorm";
import { createMatching } from "./matching";
import { saveMatchingToDB } from "./matches/save";
import { validateMatching } from "./matching/validate";
import { tuteesToMatch } from "./people/tutees";
import { tutorsToMatch } from "./people/tutors";
import { notifyMatches } from "./matches/notify";
import { getLogger } from "../../../../jobs/utils/logging";


const logger = getLogger();

export async function matchMakingOfAllPossibleMatches(manager: EntityManager) {
    // get data for matching
    const tutors = await tutorsToMatch(manager);
    const tutees = await tuteesToMatch(manager);

    //create matching
    const { matching, stats } = await createMatching(tutors, tutees, manager);

    //validate matching (including the current database state)
    const validationResult = await validateMatching(matching, manager);

    if (validationResult !== true) {
        // a problem occurred, validation failed
        const tutorUUID = validationResult.match.helper.uuid;
        const tuteeUUID = validationResult.match.helpee.uuid;
        logger.warn(`Matching failed, because of ${validationResult.problem} for match between tutor ${tutorUUID} and tutee ${tuteeUUID}`);
        throw new Error(`Matching failed for match (tutor: ${tutorUUID}, tutee: ${tuteeUUID})!`);
    }

    //save matching in database (such that the database is in the state as the matching was performed)
    const databaseMatches = await saveMatchingToDB(matching, manager);

    //notify all matches
    await notifyMatches(databaseMatches, manager);

    logger.info(`Successfully created ${databaseMatches.length} new tutoring matches and notified the corresponding people`);
    logger.info(`Matches made: ${JSON.stringify(matching)}`);
    logger.info(`Matching stats: ${JSON.stringify(stats)}`);
}