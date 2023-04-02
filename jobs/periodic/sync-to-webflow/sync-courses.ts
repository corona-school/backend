import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, patchItem, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash, mapDBIdToId, DBIdMap } from './diff';
import { Logger } from 'log4js';
import moment, { Moment } from 'moment';
import { accessURLForKey } from '../../../common/file-bucket';
import { WebflowSubcourse, getWebflowSubcourses } from './queries';
import { lectureDTOFactory } from './sync-lectures';

const collectionId = process.env.WEBFLOW_COURSE_COLLECTION_ID;
const courseDefaultImage = process.env.WEBFLOW_COURSE_DEFAULT_IMAGE;
const lectureCollectionId = process.env.WEBFLOW_LECTURE_COLLECTION_ID;
const appBaseUrl = 'https://app.lern-fair.de/single-course';

interface CourseDTO extends WebflowMetadata {
    description: string;
    instructor: string;

    startingdate: string;
    weekday: string;
    courseduration: string; // like "45 min"
    lecturecount: number;
    time: string; // like 16:00 Uhr
    appointments: string;

    category: string;
    link: string;
    maxparticipants: number;
    participantscount: number;
    subject: string;

    mingrade: number;
    maxgrade: number;

    lectures: string[];

    image: {
        fileId: string;
        url: string;
        alt: string;
    };
}

function courseDTOFactory(data: any): WebflowMetadata {
    // This is just some syntactic sugar to convert the api data to an internal interface.
    // Late on we could implement some checks here, to verify the data.
    return data;
}

function generateInstructor(subcourse: WebflowSubcourse): string {
    const names = subcourse.subcourse_instructors_student.map((instructor) => `${instructor.student.firstname} ${instructor.student.lastname}`);
    return names.join(', ');
}

function getStartDate(subcourse: WebflowSubcourse): Moment | null {
    let earliestDate: Moment | null = null;
    for (const lecture of subcourse.lecture) {
        const startDate = moment(lecture.start);
        if (earliestDate == null || startDate.isBefore(earliestDate)) {
            earliestDate = moment(lecture.start);
        }
    }
    return earliestDate;
}

function getTotalCouseDuration(subcourse: WebflowSubcourse): number {
    let duration = 0;
    for (const lecture of subcourse.lecture) {
        duration += lecture.duration;
    }
    return duration;
}

function listLectureStartDates(subcourse: WebflowSubcourse): string {
    let appointments = [];
    for (const lecture of subcourse.lecture) {
        const startDate = moment(lecture.start).locale('de');
        appointments.push(startDate.format('dddd, DD. MMMM YYYY, HH:mm [Uhr]'));
    }
    return appointments.join('\n');
}

function mapLecturesToCourse(logger: Logger, subcourse: WebflowSubcourse, lectureIds: DBIdMap): string[] {
    const result = [];

    for (const lecture of subcourse.lecture) {
        if (lectureIds[lecture.id]) {
            result.push(lectureIds[lecture.id]);
        } else {
            logger.error('Cannot find lecture in webflow.', { lectureId: lecture.id, courseId: subcourse.id });
        }
    }

    return result;
}

function courseToDTO(logger: Logger, subcourse: WebflowSubcourse, lectureIds: DBIdMap): CourseDTO {
    const startDate: Moment = getStartDate(subcourse) || moment();
    // make sure that the weekday can be properly translated
    startDate.locale('de');

    const image = subcourse.course.imageKey ? accessURLForKey(subcourse.course.imageKey) : courseDefaultImage;
    const courseDTO: CourseDTO = {
        ...emptyMetadata,

        name: subcourse.course.name,
        slug: `${subcourse.id}`, // We are using a string to be safe for any case.

        description: subcourse.course.description,
        instructor: generateInstructor(subcourse),

        startingdate: startDate.toISOString(),
        weekday: startDate.format('dddd'),
        courseduration: `${getTotalCouseDuration(subcourse)} min`, // TODO: maybe this can be done in a nicer way. Maybe with the help of moment?
        lecturecount: subcourse.lecture.length,
        time: startDate.format('HH:mm'),
        appointments: listLectureStartDates(subcourse),

        category: subcourse.course.category,
        link: `${appBaseUrl}/${subcourse.id}`,
        maxparticipants: subcourse.maxParticipants,
        participantscount: subcourse.subcourse_participants_pupil.length,
        subject: subcourse.course.subject,

        mingrade: subcourse.minGrade,
        maxgrade: subcourse.maxGrade,

        lectures: mapLecturesToCourse(logger, subcourse, lectureIds),

        image: {
            fileId: 'placeholder', // not needed
            url: image,
            alt: '',
        },
    };
    courseDTO.hash = hash(courseDTO);
    return courseDTO;
}

export default async function syncCourses(logger: Logger): Promise<void> {
    logger.info('Start course sync');
    const webflowCourses = await getCollectionItems<WebflowMetadata>(collectionId, courseDTOFactory);
    const webflowLectures = await getCollectionItems<WebflowMetadata>(lectureCollectionId, lectureDTOFactory);
    const lectureDBIdMap = mapDBIdToId(webflowLectures);

    const subCourses = await getWebflowSubcourses();
    const dbCourses = subCourses.map((course) => courseToDTO(logger, course, lectureDBIdMap));

    const result = diff(webflowCourses, dbCourses);
    logger.debug('Webflow course diff', { result });

    for (const row of result.new) {
        await createNewItem(collectionId, row);
    }

    for (const row of result.changed) {
        await patchItem(collectionId, row);
    }

    if (result.outdated.length > 0) {
        const outdatedIds = result.outdated.map((row) => row._id);
        logger.info('delete outdated items', { itemIds: outdatedIds });
        await deleteItems(collectionId, outdatedIds);
    }

    const publishedItems = await publishItems(collectionId);
    logger.info('publish new items', { itemIds: publishedItems });

    logger.info('finished course sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
