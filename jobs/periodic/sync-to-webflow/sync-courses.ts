import { Course } from '../../../common/entity/Course';
import { EntityManager } from 'typeorm';
import { createNewItem, deleteItems, getCollectionItems, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from 'log4js';

const collectionId = process.env.WEBFLOW_COLLECTION_ID;

interface CourseDTO extends WebflowMetadata {
    outline: string;
}

function courseDTOFactory(data: any): CourseDTO {
    // TODO: check if data exist
    return {
        _id: data._id,
        _archived: data._archived,
        _draft: data._draft,
        name: data.name,
        slug: data.slug,
        databaseid: data.databaseid,
        outline: data.outline,
    };
}

function courseToDTO(course: Course): CourseDTO {
    const courseDTO: CourseDTO = {
        _id: '',
        _archived: false,
        _draft: false,
        name: course.name,
        databaseid: course.id,
        slug: '',
        outline: course.outline,
    };
    courseDTO.slug = hash(course);
    return courseDTO;
}

export default async function syncCourses(manager: EntityManager, logger: Logger): Promise<void> {
    const webflowCourses = await getCollectionItems<CourseDTO>(collectionId, courseDTOFactory);
    const dbCourses = (await manager.find(Course, {})).map(courseToDTO);

    const result = diff(webflowCourses, dbCourses);

    const changedIds: string[] = [];
    for (const row of result.new) {
        const newId = await createNewItem(collectionId, row);
        changedIds.push(newId);
    }

    const outdatedIds = result.outdated.map((row) => row._id);
    await deleteItems(collectionId, outdatedIds);

    await publishItems(collectionId, changedIds);

    console.log(JSON.stringify(result, null, 4));
    logger.info('done', changedIds);
}
