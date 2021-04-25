import { getLogger } from "log4js";
import { EntityManager } from "typeorm";
import { requestInterestConfirmationOfNextPupils } from "../../../common/interest-confirmation/tutoring";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("Pupil Interest Confirmation Request job will be executed...");
    //request interest confirmation of "next" pupils
    await requestInterestConfirmationOfNextPupils(manager);
}
