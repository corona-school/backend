import syncCourses from './sync-courses';
import { getLogger } from '../../utils/logging';
import syncLectures from './sync-lectures';

const logger = getLogger();

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
}

export default async function execute(): Promise<void> {
    try {
        logger.info('Run Webflow sync');
        validateEnvVars();
        await syncLectures(logger);
        await syncCourses(logger);
        logger.info('Finished Webflow sync');
    } catch (e) {
        logger.error('Failed to sync Webflow data', e);
    }
}
