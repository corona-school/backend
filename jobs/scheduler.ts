import cron from 'cron';
import { getLogger } from '../common/logger/logger';
import { JobName, ScheduledJob } from './list';
import { runJob } from './execute';

const logger = getLogger('Job Execution');

const scheduledJobs: cron.CronJob[] = [];

export function scheduleJobs(jobs: ScheduledJob[]) {
    const cronJobs = jobs.map((job) =>
        cron.job({
            cronTime: job.cronTime,
            runOnInit: false,
            onTick: () => {
                // fire and forget the job, the cron framework won't handle it anyways
                void runJob(job.name);
            },
        })
    );

    //and start them...
    cronJobs.forEach((j) => j.start());

    logger.info('Jobs scheduled');

    scheduledJobs.push(...cronJobs);
}

export function unscheduleAllJobs() {
    scheduledJobs.forEach((j) => j.stop());
}
