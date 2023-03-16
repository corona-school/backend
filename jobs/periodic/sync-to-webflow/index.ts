import { EntityManager } from 'typeorm';
import syncCourses from './sync-courses';
import { getLogger } from '../../utils/logging';

const logger = getLogger();

export default async function execute(manager: EntityManager): Promise<void> {
    try {
        logger.info('Run Webflow sync');
        await syncCourses(manager, logger);
        logger.info('Finished Webflow sync');
    } catch (e) {
        logger.error('Failed to sync Webflow data', e);
    }
}
