import { fetchFromWixToDb } from "./backend/fetch";
import { getConnection } from "typeorm";
import { getLogger } from "log4js";
import { generateAuthTokenAndSendMail } from "./backend/authtoken";

const logger = getLogger();

export async function fetchJob() {
    try {
        logger.info("Fetch from Wix to DB");
        await fetchFromWixToDb();
    } catch (e) {
        logger.warn("Can't perform FetchJob: " + e.message);
        logger.debug(e);
    }
}

export async function authJob() {
    try {
        logger.info("Starting AuthJob");
        await generateAuthTokenAndSendMail(15);
    } catch (e) {
        logger.warn("Can't perform AuthJob: " + e.message);
        logger.debug(e);
    }
}

export async function matchingJob() {
    try {
        let conn = await getConnection();

        //do the transaction stuff in the closure
        await conn.transaction(async (transactionManager) => {
            logger.info("Perform matches...");
            //perform matches // at the moment, the matches are performed externally and imported, so the main loop just need to notify the matches at the moment
            //await matchWhatPossible(transactionManager);
        });
    } catch (e) {
        logger.info("WARNING: ", e);
    }
}
