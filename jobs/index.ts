import "reflect-metadata";
import * as moment from "moment";
import { configure, getLogger } from "log4js";
import { createConnection, Connection } from "typeorm";
import { authJob, fetchJob, matchingJob } from "./jobs";
import { invalidateActiveTransactionLog } from "../common/transactionlog";

try {
    configure("jobs/logconfig.json");
} catch (e) {
    console.warn("Couldn't setup logger", e);
}

const logger = getLogger();
logger.info("Backend started");

async function loop() {
    let conn: Connection;

    try {
        conn = await createConnection();

        await fetchJob();

        // await matchingJob();

        // await authJob();
    } catch (e) {
        logger.error("Can't execute loop: ", e.message);
        logger.debug(e);
    } finally {
        if (conn) {
            await conn.close();
            conn = null;
        }
        //Do this always, to have no transaction log that uses a connection that was closed (which then would result in errors)
        invalidateActiveTransactionLog();
    }
}

// run for infinitly in a certain interval
function runLoop() {
    const seconds = 30;

    loop().then(() => {
        setTimeout(runLoop, seconds * 1000);
        logger.info("Sleeping for " + seconds + " seconds");
    });
}

//set global moment date format
moment.locale("de");

//run the main loop...
runLoop();
