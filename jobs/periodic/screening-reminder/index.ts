import { EntityManager } from "typeorm";
import { getLogger } from "log4js";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.debug("Screening Reminder Job not yet implemented...");
}