import syncCourses from './sync-courses';
import { getLogger } from '../../../common/logger/logger';
import { syncDeleteLectures, syncLectures } from './sync-lectures';

const logger = getLogger('WebflowAPISync');

function validateEnvVars() {
    if (!process.env.WEBFLOW_API_BASE_URL) {
        throw new Error('WEBFLOW_API_BASE_URL env var has to be set');
    }
    if (!process.env.WEBFLOW_API_KEY) {
        throw new Error('WEBFLOW_API_KEY env var has to be set');
    }
    if (!process.env.WEBFLOW_COURSE_COLLECTION_ID) {
        throw new Error('WEBFLOW_COURSE_COLLECTION_ID env var has to be set');
    }
    if (!process.env.WEBFLOW_LECTURE_COLLECTION_ID) {
        throw new Error('WEBFLOW_LECTURE_COLLECTION_ID env var has to be set');
    }
    if (!process.env.WEBFLOW_COURSE_DEFAULT_IMAGE) {
        throw new Error('WEBFLOW_COURSE_DEFAULT_IMAGE env var has to be set');
    }
}

export default async function execute(): Promise<void> {
    // As we don't have a dev/staging webflow instance, we should only execute the job in production
    if (process.env.ENV !== 'production') {
        logger.info('Skipping webflow sync in non production environments');
        return;
    }
    try {
        logger.info('Run Webflow sync');
        validateEnvVars();
        const { itemsToDelete } = await syncLectures(logger);
        await syncCourses(logger);
        // The outdated lectures have to be removed from the courses first
        await syncDeleteLectures(logger, itemsToDelete);
        logger.info('Finished Webflow sync');
    } catch (e) {
        logger.error('Failed to sync Webflow data', e);
    }
}
