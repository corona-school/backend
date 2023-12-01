import '../common/logger/tracing';
import { getLogger } from '../common/logger/logger';
import moment from 'moment-timezone';
import { isDev, isTest } from '../common/util/environment';
import { isCommandArg } from '../common/util/basic';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';
import { registerAchievementMetrics } from '../common/achievement/metric';

const logger = getLogger('WebServer');
logger.debug('Debug logging enabled');

moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)
registerAchievementMetrics();

export const started = (async function main() {
    logger.info(`Starting the Webserver`);

    // -------- Start Webserver ------------------
    return (await import('./server')).server;
})();

export async function shutdown() {
    logger.info(`Shutting down manually`);
    const server = await started;

    await new Promise<void>((res, rej) => server.close((err) => (err ? rej(err) : res())));
    logger.info(`Webserver stopped`);

    logger.info(`Server shut down manually`);
}
