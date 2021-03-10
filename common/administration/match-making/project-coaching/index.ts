import { EntityManager } from "typeorm";
import { createMatching } from "./matching";
import { saveMatchingToDB } from "./matches/save";
import { validateMatching } from "./matching/validate";
import { coacheesToMatch } from "./people/coachees";
import { coachesToMatch } from "./people/coaches";
import { notifyMatches } from "./matches/notify";
import { getLogger } from "../../../../jobs/utils/logging";


const logger = getLogger();

export async function matchMakingOfAllPossibleMatches(manager: EntityManager) {
    // get data for matching
    const coaches = await coachesToMatch(manager);
    const coachees = await coacheesToMatch(manager);

    //create matching
    const { matching, stats } = await createMatching(coaches, coachees, manager);

    //validate matching (including the current database state)
    const validationResult = await validateMatching(matching, manager);

    if (validationResult !== true) {
        // a problem occurred, validation failed
        const coachUUID = validationResult.match.helper.uuid;
        const coacheeUUID = validationResult.match.helpee.uuid;
        logger.warn(`Matching failed, because of ${validationResult.problem} for match between coach ${coachUUID} and coachee ${coacheeUUID}`);
        throw new Error(`Matching failed for match (coach: ${coachUUID}, coachee: ${coacheeUUID})!`);
    }

    //save matching in database (such that the database is in the state as the matching was performed)
    const databaseProjectMatches = await saveMatchingToDB(matching, manager);

    //notify all matches
    await notifyMatches(databaseProjectMatches, manager);

    logger.info(`Successfully created ${databaseProjectMatches.length} new project matches and notified the corresponding people`);
    logger.info(`Matches made: ${JSON.stringify(matching)}`);
    logger.info(`Matching stats: ${JSON.stringify(stats)}`);
}