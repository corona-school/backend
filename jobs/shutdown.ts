import { getLogger } from '../common/logger/logger';

const logger = getLogger();

interface ShutdownableScheduler {
    unscheduleAllJobs();
    shutdownConnection();
}

export function configureGracefulShutdown(scheduler: ShutdownableScheduler) {
    //NOTE: use this to cleanup node's event loop
    process.on("SIGTERM", async () => {
        logger.debug("SIGTERM signal received: Starting graceful shutdown procedures...");

        scheduler.unscheduleAllJobs();
        logger.debug("✅ All future jobs unscheduled!");

        //now, the process will automatically exit if node has no more async operations to perform (i.e. finished sending out all open mails that weren't awaited for etc.)
    });

    //NOTE: Use the following to perform async actions before exiting. This is called if node's event loop is empty and thus it will only add async operations that, when completed lead to an empty event loop, such that node can exit then.
    process.on("beforeExit", async () => {
        console.log("BEFORE EXIT TRIGGERED...."); //event loop is empty now...

        //Close database connection
        scheduler.shutdownConnection();
        logger.debug("✅ The used database connection was successfully closed!");

        //Finish...
        logger.debug("Graceful Shutdown completed 🎉"); //event loop now fully cleaned up, Node will exit...
    });
}
