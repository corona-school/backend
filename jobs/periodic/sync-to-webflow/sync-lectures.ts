import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, patchItem, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from '../../../common/logger/logger';
import moment from 'moment';
import { lecture } from '@prisma/client';
import { getWebflowSubcourses } from './queries';

const lectureCollectionId = process.env.WEBFLOW_LECTURE_COLLECTION_ID;

export interface LectureDTO extends WebflowMetadata {
    start: string; // ISO Date String
    end: string; // ISO Date String (start + duration)
    duration: string;
}

export function lectureDTOFactory(data: any): LectureDTO {
    // This is just some syntactic sugar to convert the api data to an internal interface.
    // Late on we could implement some checks here, to verify the data.
    return data;
}

function lectureToDTO(lecture: lecture): LectureDTO {
    const start = moment(lecture.start).locale('de');
    // We have to clone the start variable, because .add is mutating the object
    const end = start.clone().add(lecture.duration, 'minutes');
    const lectureDto: LectureDTO = {
        ...emptyMetadata,
        slug: `${lecture.id}`,
        start: start.toISOString(),
        end: end.toISOString(),
        duration: `${lecture.duration} min.`,
    };
    lectureDto.hash = hash(lectureDto);
    // Lectures don't have any names, so to prevent collisions we are just using the hash, which should be unique.
    lectureDto.name = lectureDto.hash;
    return lectureDto;
}

export default async function syncLectures(logger: Logger): Promise<void> {
    logger.addContext('CMSCollection', 'Lectures');

    logger.info('Start lecture sync');
    const webflowLectures = await getCollectionItems<WebflowMetadata>(lectureCollectionId, lectureDTOFactory);
    const subCourses = await getWebflowSubcourses();
    const dbLectures = subCourses
        .map((lecture) => lecture.lecture)
        .flat()
        .map(lectureToDTO);

    const result = diff(webflowLectures, dbLectures);
    logger.debug('Webflow lecture diff', { result });

    const newIds: string[] = [];
    for (const row of result.new) {
        const newId = await createNewItem(lectureCollectionId, row);
        newIds.push(newId);
    }
    logger.info('created new items', { itemIds: newIds });

    for (const row of result.changed) {
        logger.info('patch item', { itemID: row._id });
        await patchItem(lectureCollectionId, row);
    }

    if (result.outdated.length > 0) {
        const outdatedIds = result.outdated.map((row) => row._id);
        logger.info('delete outdated items', { itemIds: outdatedIds });
        await deleteItems(lectureCollectionId, outdatedIds);
    }

    const publishedItems = await publishItems(lectureCollectionId);
    logger.info('publish new items', { itemIds: publishedItems });

    logger.info('finished lecture sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
