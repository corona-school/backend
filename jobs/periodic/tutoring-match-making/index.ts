import { EntityManager } from "typeorm";
import { getLogger } from "log4js";
import { shouldPerformAutomaticTutoringMatching } from "./pre-check";
import { matchMakingOfAllPossibleMatches } from "../../../common/administration/match-making/tutoring";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    if (!await shouldPerformAutomaticTutoringMatching(manager)) {
        logger.info("---> Will not try tutoring matching today (too few people waiting for their match)");
        return;
    }

    //make all possible matches...
    await matchMakingOfAllPossibleMatches(manager);
}