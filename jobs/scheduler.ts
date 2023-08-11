import cron from 'cron';
import { getLogger } from '../common/logger/logger';
import tracer from '../common/logger/tracing';
import { Connection, createConnection, EntityManager } from 'typeorm';
import { CSCronJob } from './types';
import { metrics, stats } from '../common/logger/metrics';

const logger = getLogger();

let jobConnection: Promise<Connection> | null = null;
/// Returns the connection(pool) that should be used for all the jobs. The returned connection is always active, i.e. connected.
async function getActiveJobConnection() {
    if (jobConnection == null) {
        logger.info('Create new connection to database...');
        jobConnection = createConnection();
    }

    const connection = await jobConnection;

    if (!connection.isConnected) {
        logger.info('Job database connection is no longer connected. Reconnect...');
        await connection.connect();
    }

    return connection;
}

function executeJob(name: string, job: (manager: EntityManager) => Promise<void>, jobConnectionGetter: () => Promise<Connection>): () => Promise<void> {
    const span = tracer.startSpan(name);
    return tracer.scope().bind(async function () {
        //return a real function, not an arrow-function here, because we need this to be set according to the context defined as part of the CronJob creation
        //"this" is the context of the cron-job -> see definition of node cron package
        this.stop(); //start stop, so that the same job is never executed in parallel

        let hasError = false;
        try {
            //Get the connection that should be used to execute the job in
            //we assume that the returned connection is always active
            const connection = await jobConnectionGetter();

            //The entity manager that should be used to manage the entities
            const manager = connection.manager;

            //execute the job with the manager
            await job(manager);
        } catch (e) {
            logger.error(`Can't execute job: ${job.name} due to error with message:`, e);
            logger.debug(e);
            hasError = true;
        }

        stats.increment(metrics.JOB_COUNT_EXECUTED, 1, { hasError: `${hasError}`, name: name });

        this.start();
        span.finish();
    }, span);
}

const scheduledJobs: cron.CronJob[] = [];

///Schedules a given set of Corona School Cron Jobs
export function scheduleJobs(jobs: CSCronJob[]) {
    //create actual cron jobs
    const cronJobs = jobs.map((j) => {
        return cron.job({
            cronTime: j.cronTime,
            runOnInit: false,
            onTick: executeJob(j.name, j.jobFunction, getActiveJobConnection),
        });
    });

    //and start them...
    cronJobs.forEach((j) => j.start());

    logger.info('Jobs scheduled...');

    scheduledJobs.push(...cronJobs); //store all scheduled jobs of this scheduler

    return cronJobs; //return the scheduled jobs, if anyone needs them
}

export function unscheduleAllJobs() {
    scheduledJobs.forEach((j) => j.stop());
}

export async function shutdownConnection() {
    if (jobConnection != null) {
        await (await jobConnection)?.close();
        jobConnection = null;
    }
}
