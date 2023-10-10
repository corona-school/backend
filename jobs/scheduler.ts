import cron from 'cron';
import { getLogger } from '../common/logger/logger';
import tracer from '../common/logger/tracing';
import { CSCronJob } from './types';
import { metrics } from '../common/logger/metrics';

const logger = getLogger();

function executeJob(name: string, job: () => Promise<void>): () => Promise<void> {
    return async function () {
        const span = tracer.startSpan(name);
        return await tracer.scope().activate(span, async () => {
            //return a real function, not an arrow-function here, because we need this to be set according to the context defined as part of the CronJob creation
            //"this" is the context of the cron-job -> see definition of node cron package
            this.stop(); //start stop, so that the same job is never executed in parallel

            let hasError = false;
            try {
                //execute the job with the manager
                await job();
            } catch (e) {
                logger.error(`Can't execute job: ${job.name} due to error with message:`, e);
                logger.debug(e);
                hasError = true;
            }

            metrics.JOB_COUNT_EXECUTED.inc({ hasError: `${hasError}`, name: name });

            this.start();
            span.finish();
        });
    };
}

const scheduledJobs: cron.CronJob[] = [];

///Schedules a given set of Corona School Cron Jobs
export function scheduleJobs(jobs: CSCronJob[]) {
    //create actual cron jobs
    const cronJobs = jobs.map((j) => {
        return cron.job({
            cronTime: j.cronTime,
            runOnInit: false,
            onTick: executeJob(j.name, j.jobFunction),
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
