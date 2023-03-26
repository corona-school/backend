import syncCourses from './sync-courses';
import { getLogger } from '../../utils/logging';
import syncLectures from './sync-lectures';

const logger = getLogger();

export default async function execute(): Promise<void> {
    try {
        logger.info('Run Webflow sync');
        await syncLectures(logger);
        await syncCourses(logger);
        logger.info('Finished Webflow sync');
    } catch (e) {
        logger.error('Failed to sync Webflow data', e);
    }
}
