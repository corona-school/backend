import { EntityManager } from 'typeorm';
import { getLogger } from '../../utils/logging';

const logger = getLogger();

export default async function execute(_manager: EntityManager): Promise<void> {
    logger.info('test job');
}
