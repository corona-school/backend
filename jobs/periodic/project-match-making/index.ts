import { EntityManager } from "typeorm";
import { getLogger } from '../../../common/logger/logger';
import { shouldPerformAutomaticProjectCoachingMatching } from "./pre-check";
import { matchMakingOfAllPossibleMatches } from "../../../common/administration/match-making/project-coaching";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    if (!await shouldPerformAutomaticProjectCoachingMatching(manager)) {
        logger.info("---> Will not try project coaching matching today (too few people waiting for their match)");
        return;
    }

    //make all possible matches...
    await matchMakingOfAllPossibleMatches(manager);
}
