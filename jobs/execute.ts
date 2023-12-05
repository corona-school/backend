import { JobName, allJobs } from './list';
import tracer from '../common/logger/tracing';
import { getLogger } from '../common/logger/logger';
import { metrics, metricsRouter } from '../common/logger/metrics';
import { prisma } from '../common/prisma';
import { Prisma, job_run } from '@prisma/client';
import assert from 'assert';

const logger = getLogger('Job Execution');

enum LockStatus {
    // We failed to aquire the lock as the transaction was rolled back by the database
    // (due to a conflict), but we don't yet know whether another job is currently running
    // Best to retry soon
    ROLLBACK = 1,
    // Failed to aquire a lock because the same job is already running
    CONFLICT = 2,
    AQUIRED = 3,
}

export async function runJob(name: JobName): Promise<boolean> {
    let success = false;

    try {
        logger.info(`Starting to run Job '${name}'`);

        // ---------- AQUIRE --------------
        // Prevent Job Runs running concurrently (across dynos), as jobs usually lack synchronization internally
        // To synchronize we use the 'job_run' table in our Postgres
        // During insert we need transaction level SERIALIZABLE to prevent two jobs from inserting a new job run
        // at the same time

        let jobRun: job_run;
        let lockStatus: LockStatus = LockStatus.ROLLBACK as LockStatus;
        let lockRetries = 5;

        do {
            try {
                // Wait between 0 and 1000ms to reduce the likelihood of transaction deadlocks
                // (as a lot of Cron Jobs fire at exactly the same time)
                await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000)));

                jobRun = await prisma.$transaction(
                    async (jobPrisma) => {
                        const runningJob = await jobPrisma.job_run.findFirst({
                            where: {
                                job_name: name,
                                endedAt: { equals: null },
                            },
                        });

                        if (runningJob) {
                            logger.warn(
                                `Cannot concurrently execute Job '${name}' as it is already running on '${runningJob.worker}' since ${runningJob.startedAt}`
                            );
                            lockStatus = LockStatus.CONFLICT;
                            return undefined;
                        }

                        lockStatus = LockStatus.AQUIRED;

                        return await jobPrisma.job_run.create({
                            data: { job_name: name, worker: process.env.DYNO ?? '?' },
                        });
                        // It is important that the transaction ends here and the INSERT above is commited
                        // Otherwise we would continue execution, and the commit would be rolled back after the job actually executed
                    },
                    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
                );
            } catch (error) {
                // The transaction was aborted, likely because the DB rolled back the deadlock
                lockStatus = LockStatus.ROLLBACK;
                lockRetries -= 1;
            }
        } while (lockStatus === LockStatus.ROLLBACK && lockRetries > 0);

        if (lockStatus === LockStatus.CONFLICT) {
            return false;
        }

        if (lockStatus === LockStatus.ROLLBACK) {
            logger.error(`Failed to aquire Lock after 5 retries`);
            return false;
        }

        assert.ok(lockStatus === LockStatus.AQUIRED);
        assert.ok(runJob != null);

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
        logger.error(error.message);
        logger.error(`Failure during Job Scheduling - This might leave the system in a locked state requiring manual cleanup!`, error);
        success = false;
        // Eventually we now have a job run in the job_run table that has no endedAt,
        // but which will never finish. To unlock this again, simply delete this entry
        // (This should only happen in the rare case that the Dyno is killed (!) during execution)
    }

    return success;
}
