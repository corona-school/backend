import { EntityManager } from 'typeorm';
import { getLogger } from '../../utils/logging';
import { getCollectionItems, WebflowMetadata } from './webflow-adapter';

const logger = getLogger();

interface Subject extends WebflowMetadata {
    name: string;
}

function subjectsFactory(data: any): Subject {
    // TODO: check if data exist
    return {
        _archived: data._archived,
        name: data.name,
    };
}

export default async function execute(_manager: EntityManager): Promise<void> {
    const items = await getCollectionItems<Subject>(process.env.WEBFLOW_COLLECTION_ID, subjectsFactory);
    // const isso = await manager.find(Course, {});
    logger.info(items);
}
