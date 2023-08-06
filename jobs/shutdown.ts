import { getLogger } from '../common/logger/logger';

const logger = getLogger();

interface ShutdownableScheduler {
    unscheduleAllJobs();
}

export function configureGracefulShutdown(scheduler: ShutdownableScheduler) {
    //NOTE: use this to cleanup node's event loop
    process.on("SIGTERM", async () => {
        logger.debug("SIGTERM signal received: Starting graceful shutdown procedures...");

        scheduler.unscheduleAllJobs();
        logger.debug("✅ All future jobs unscheduled!");

        //now, the process will automatically exit if node has no more async operations to perform (i.e. finished sending out all open mails that weren't awaited for etc.)
    });
}
