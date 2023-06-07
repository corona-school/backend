import _ from '../common/logger/tracing';
import { getLogger } from '../common/logger/logger';
import { Connection, createConnection, getConnection } from 'typeorm';
import { setupDevDB } from './dev';
import moment from 'moment-timezone';
import { isDev, isTest } from '../common/util/environment';
import { isCommandArg } from '../common/util/basic';

// Ensure Notification hooks are always loaded
import './../common/notification/hooks';

const logger = getLogger("WebServer");
logger.debug('Debug logging enabled');

moment.locale('de'); //set global moment date format
moment.tz.setDefault('Europe/Berlin'); //set global timezone (which is then used also for cron job scheduling and moment.format calls)

let dbConnection: Connection | null = null;

export const started = (async function main() {
    logger.info(`Starting the Webserver`);

    // -------- Database Connection ---------------
    dbConnection = await createConnection();
    logger.info(`Set up Database connection`);

    process.on('beforeExit', async () => {
        await getConnection()?.close();
        logger.info(`Closed Database connection`);
    });

    // -------- Fill DB on Dev -------------------
    if ((isDev || isTest) && !isCommandArg('--keepDB')) {
        await setupDevDB();
    }

    // -------- Start Webserver ------------------
    await import('./server');
})();
