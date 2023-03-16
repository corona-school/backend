import { EntityManager } from 'typeorm';
import syncCourses from './sync-courses';
import { getLogger } from '../../utils/logging';

const logger = getLogger();

export default async function execute(manager: EntityManager): Promise<void> {
    await syncCourses(manager, logger);
}
