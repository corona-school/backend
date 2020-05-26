import { createConnection } from "typeorm";
import { importResultsFromMatchingAlgorithm } from "./matchingResults";

const parseConfig = {
    header: true,
};

async function main() {
    try {
        const connection = await createConnection();
        console.log("➡️ CONNECTED...");

        //create the tables
        await connection.synchronize();
        console.log("➡️ TABLES SYNCHRONIZED...");

        const manager = connection.manager;

        /*
         * FROM  EXTERNAL MATCH MAKING ALGORITHM
         */

        console.log("➡️ ... import MATCHES FROM ALGORITHM ...");
        await importResultsFromMatchingAlgorithm(manager, parseConfig);
        console.log("➡️ ... finished! ");

        console.log("➡️ COMPLETED!!!");
    } catch (e) {
        console.log("Error: ", e);
    }
}

main();
