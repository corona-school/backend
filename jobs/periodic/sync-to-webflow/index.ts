import { Course } from '../../../common/entity/Course';
import { EntityManager } from 'typeorm';
import { getLogger } from '../../utils/logging';
import { getCollectionItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';

const logger = getLogger();

interface Subject extends WebflowMetadata {
    name: string;
}

function subjectsFactory(data: any): Subject {
    // TODO: check if data exist
    return {
        _id: data._id,
        _archived: data._archived,
        name: data.name,
        databaseId: data.databaseid,
        hash: data.hash,
    };
}

function courseToSubject(course: Course): Subject {
    const subject: Subject = {
        _id: '',
        _archived: false,
        name: course.name,
        databaseId: course.id,
        hash: '',
    };
    subject.hash = hash(subject);
    return subject;
}

export default async function execute(manager: EntityManager): Promise<void> {
    const webflowSubjects = await getCollectionItems<Subject>(process.env.WEBFLOW_COLLECTION_ID, subjectsFactory);
    const dbSubjects = (await manager.find(Course, {})).map(courseToSubject);

    const result = diff(webflowSubjects, dbSubjects);

    console.log(JSON.stringify(result, null, 4));
    logger.info('done');
}
