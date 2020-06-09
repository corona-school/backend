import * as cron from "cron";
import {Mutex} from 'async-mutex';
import { getLogger } from "log4js";
import { Connection, createConnection, EntityManager } from "typeorm";
import { CSCronJob } from "./types";
import { invalidateActiveTransactionLog } from "../common/transactionlog";

const logger = getLogger();



const activeConnectionMutex = new Mutex();
let jobConnection: Connection;
/// Returns the connection(pool) that should be used for all the jobs. The returned connection is always active, i.e. connected. 
async function getActiveJobConnection() {
    const release = await activeConnectionMutex.acquire(); //restrict access to this function to only one concurrent caller (to prevent creating two default connections, which occurs primarily if two jobs are scheduled at just the same time)
    
    if (!jobConnection) {
        logger.info("Create new connection to database...")
        jobConnection = await createConnection()
    }
    else if (!jobConnection.isConnected) {
        logger.info("Job database connection is no longer connected. Reconnect...")
        //Do this always, to have no transaction log that uses a connection that was closed (which then would result in errors)
        invalidateActiveTransactionLog() // that might not be necessary here, but include it for safety reasons
        await jobConnection.connect()
    }

    release();

    return jobConnection
}


function executeJob(job: (manager: EntityManager) => Promise<void>, jobConnectionGetter: () => Promise<Connection>): () => Promise<void> {
    return async function() { //return a real function, not an arrow-function here, because we need this to be set according to the context defined as part of the CronJob creation
        //"this" is the context of the cron-job -> see definition of node cron package
        this.stop() //start stop, so that the same job is never executed in parallel

        try {
            //Get the connection that should be used to execute the job in
            //we assume that the returned connection is always active
            const connection = await jobConnectionGetter()
            
            //The entity manager that should be used to manage the entities
            const manager = connection.manager

            //execute the job with the manager
            await job(manager)
        }
        catch (e) {
            logger.error(`Can't execute job: ${job.name} due to error with message: ${e.message}`)
            logger.debug(e)
        }

        this.start()
    }
}


///Schedules a given set of Corona School Cron Jobs
export async function scheduleJobs(jobs: CSCronJob[]) {
    //create actual cron jobs
    const cronJobs = jobs.map( j => {
        return cron.job({
            cronTime: j.cronTime,
            runOnInit: false,
            onTick: executeJob(j.jobFunction, getActiveJobConnection)
        })
    }
    );

    //and start them...
    cronJobs.forEach( j => j.start() );

    logger.info("Jobs scheduled...");
}
