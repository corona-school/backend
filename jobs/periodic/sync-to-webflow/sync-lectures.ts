import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from 'log4js';
import moment from 'moment';
import { lecture } from '@prisma/client';
import { getWebflowSubcourses } from './queries';

const lectureCollectionId = process.env.WEBFLOW_LECTURE_COLLECTION_ID;

export interface LectureDTO extends WebflowMetadata {
    start: string; // ISO Date String
    duration: string;
}

export function lectureDTOFactory(data: any): WebflowMetadata {
    // This is just some syntactic sugar to convert the api data to an internal interface.
    // Late on we could implement some checks here, to verify the data.
    return data;
}

function lectureToDTO(lecture: lecture): LectureDTO {
    const start = moment(lecture.start).locale('de');
    const lectureDto: LectureDTO = {
        ...emptyMetadata,
        slug: `${lecture.id}`,
        start: start.toISOString(),
        duration: `${lecture.duration} min.`,
    };
    lectureDto.hash = hash(lectureDto);
    // Lectures don't have any names, so to prevent collisions we are just using the hash, which should be unique.
    lectureDto.name = lectureDto.hash;
    return lectureDto;
}

export default async function syncLectures(logger: Logger): Promise<void> {
    logger.info('Start course sync');
    const webflowLectures = await getCollectionItems<WebflowMetadata>(lectureCollectionId, lectureDTOFactory);
    const subCourses = await getWebflowSubcourses();
    const dbLectures = subCourses
        .map((course) => course.lecture)
        .flat()
        .map(lectureToDTO);

    const result = diff(webflowLectures, dbLectures);
    logger.debug('Webflow lecture diff', { result });

    for (const row of result.new) {
        await createNewItem(lectureCollectionId, row);
    }

    if (result.outdated.length > 0) {
        const outdatedIds = result.outdated.map((row) => row._id);
        logger.info('delete outdated items', { itemIds: outdatedIds });
        await deleteItems(lectureCollectionId, outdatedIds);
    }

    const publishedItems = await publishItems(lectureCollectionId);
    logger.info('publish new items', { itemIds: publishedItems });

    logger.info('finished course sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
