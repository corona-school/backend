import { EntityManager } from "typeorm";
import { requestInterestConfirmationOfNextPupils } from "../../../common/interest-confirmation/tutoring";
import { getLogger } from '../../../common/logger/logger';

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("Pupil Interest Confirmation Request job will be executed...");
    //request interest confirmation of "next" pupils
    await requestInterestConfirmationOfNextPupils(manager);
}
