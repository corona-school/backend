import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, patchItem, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff } from './diff';
import { Logger } from '../../../common/logger/logger';
import moment from 'moment';
import { lecture } from '@prisma/client';
import { getWebflowSubcourses } from './queries';

const lectureCollectionId = process.env.WEBFLOW_LECTURE_COLLECTION_ID;

export interface LectureDTO extends WebflowMetadata {
    fieldData: {
        slug?: string;
        name?: string;

        start: string; // ISO Date String
        end: string; // ISO Date String (start + duration)
        duration: string;
    };
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
    return {
        ...emptyMetadata,
        fieldData: {
            name: `${lecture.id}`,
            slug: `${lecture.id}`,
            start: start.toISOString(),
            end: end.toISOString(),
            duration: `${lecture.duration} min.`,
        },
    };
}

export async function syncLectures(logger: Logger): Promise<{ itemsToDelete: WebflowMetadata[] }> {
    logger.addContext('CMSCollection', 'Lectures');

    logger.info('Start lecture sync');
    const webflowLectures = await getCollectionItems<WebflowMetadata>(lectureCollectionId, lectureDTOFactory);
    const subCourses = await getWebflowSubcourses();
    const dbLectures = subCourses
        .map((lecture) => lecture.lecture)
        .flat()
        .map(lectureToDTO);

    const result = diff(logger, webflowLectures, dbLectures);
    logger.debug('Webflow lecture diff', { result });

    const newIds: string[] = [];
    for (const row of result.new) {
        const newId = await createNewItem(lectureCollectionId, row);
        newIds.push(newId);
    }
    logger.info('created new items', { itemIds: newIds });

    for (const row of result.changed) {
        logger.info('patch item', { itemID: row.id });
        await patchItem(lectureCollectionId, row);
    }

    const publishedItems = await publishItems(lectureCollectionId);
    logger.info('publish new items', { itemIds: publishedItems });

    logger.info('finished lecture sync', { newItems: result.new.length, deletedItems: result.outdated.length });

    return { itemsToDelete: result.outdated };
}

export async function syncDeleteLectures(logger: Logger, itemsToDelete: WebflowMetadata[]): Promise<void> {
    if (itemsToDelete.length === 0) {
        return;
    }

    const outdatedIds = itemsToDelete.map((row) => row.id);
    logger.info('delete outdated items', { itemIds: outdatedIds });
    await deleteItems(lectureCollectionId, outdatedIds);
}
