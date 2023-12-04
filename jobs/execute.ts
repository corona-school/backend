import { JobName, allJobs } from './list';
import tracer from '../common/logger/tracing';
import { getLogger } from '../common/logger/logger';
import { metrics, metricsRouter } from '../common/logger/metrics';
import { prisma } from '../common/prisma';
import { Prisma } from '@prisma/client';

const logger = getLogger('Job Execution');

export async function runJob(name: JobName): Promise<boolean> {
    let success = false;

    try {
        logger.info(`Starting to run Job '${name}'`);

        // ---------- AQUIRE --------------
        // Prevent Job Runs running concurrently (across dynos), as jobs usually lack synchronization internally
        // To synchronize we use the 'job_run' table in our Postgres
        // During insert we need transaction level SERIALIZABLE to prevent two jobs from inserting a new job run
        // at the same time
        const jobRun = await prisma.$transaction(
            async (jobPrisma) => {
                const runningJob = await jobPrisma.job_run.findFirst({
                    where: {
                        job_name: name,
                        endedAt: { equals: null },
                    },
                });

                if (runningJob) {
                    throw new Error(
                        `Cannot concurrently execute Job '${name}' as it is already running on '${runningJob.worker}' since ${runningJob.startedAt}`
                    );
                }

                return await jobPrisma.job_run.create({
                    data: { job_name: name, worker: process.env.DYNO ?? '?' },
                });

                // It is important that the transaction ends here and the INSERT above is commited
                // Otherwise we would continue execution, and the commit would be rolled back after the job actually executed
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
        );

        logger.info(`Aquired Table Lock to run Job '${name}'`);

        // ---------- RUN ----------------

        const span = tracer.startSpan(name);
        await tracer.scope().activate(span, async () => {
            let hasError = false;
            try {
                const job = allJobs[name];
                await job();
                success = true;
            } catch (e) {
                logger.error(`Can't execute job: ${name} due to error`, e);
                logger.debug(e);
                hasError = true;
            }

            metrics.JobCountExecuted.inc({ hasError: `${hasError}`, name: name });

            span.finish();
        });

        logger.info(`Finished Running Job '${name}', releasing table lock`);

        // ---------- RELEASE -------------
        await prisma.job_run.update({
            where: { job_name_startedAt: { startedAt: jobRun.startedAt, job_name: jobRun.job_name } },
            data: { endedAt: new Date() },
        });

        logger.info(`Finished Job '${name}'`);
    } catch (error) {
        logger.error(`Failure during Job Scheduling - This might leave the system in a locked state requiring manual cleanup! - ${error.message}`, error);
        success = false;
        // Eventually we now have a job run in the job_run table that has no endedAt,
        // but which will never finish. To unlock this again, simply delete this entry
        // (This should only happen in the rare case that the Dyno is killed (!) during execution)
    }

    return success;
}
