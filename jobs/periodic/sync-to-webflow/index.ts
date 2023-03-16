import { Course } from '../../../common/entity/Course';
import { EntityManager } from 'typeorm';
import { getLogger } from '../../utils/logging';
import { createNewItem, deleteItems, getCollectionItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';

const logger = getLogger();
const collectionId = process.env.WEBFLOW_COLLECTION_ID;

interface Subject extends WebflowMetadata {
    name: string;
}

function subjectsFactory(data: any): Subject {
    // TODO: check if data exist
    return {
        _id: data._id,
        _archived: data._archived,
        _draft: data._draft,
        name: data.name,
        databaseid: data.databaseid,
        hash: data.hash,
    };
}

function courseToSubject(course: Course): Subject {
    const subject: Subject = {
        _id: '',
        _archived: false,
        _draft: false,
        name: course.name,
        databaseid: course.id,
        hash: '',
    };
    subject.hash = hash(subject);
    return subject;
}

export default async function execute(manager: EntityManager): Promise<void> {
    const webflowSubjects = await getCollectionItems<Subject>(collectionId, subjectsFactory);
    const dbSubjects = (await manager.find(Course, {})).map(courseToSubject);

    const result = diff(webflowSubjects, dbSubjects);

    const changedIds: string[] = [];
    for (const row of result.new) {
        const newId = await createNewItem(collectionId, row);
        changedIds.push(newId);
    }

    const outdatedIds = result.outdated.map((row) => row._id);
    await deleteItems(collectionId, outdatedIds);

    console.log(JSON.stringify(result, null, 4));
    logger.info('done', changedIds);
}
