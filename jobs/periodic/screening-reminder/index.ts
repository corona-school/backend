import { EntityManager } from "typeorm";
import { getLogger } from "log4js";
import { remindAllThatShouldBeRemindedNow } from "./controller";

const logger = getLogger();

export default async function execute(manager: EntityManager) {
    //remind all
    await remindAllThatShouldBeRemindedNow(manager);
}