import { getLogger } from "log4js";
import { EntityManager } from "typeorm";
import { remindNextPupils } from "../../../common/interest-confirmation/tutoring";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    logger.info("Pupil Interest Confirmation Request Reminder job will be executed...");
    //request interest confirmation of "next" pupils
    await remindNextPupils(manager);
}