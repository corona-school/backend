import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, patchItem, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, mapToDBId, DBIdMap } from './diff';
import { Logger } from '../../../common/logger/logger';
import moment, { Moment } from 'moment';
import { WebflowSubcourse, getWebflowSubcourses } from './queries';
import { LectureDTO, lectureDTOFactory } from './sync-lectures';
import { getCourseImageURL } from '../../../common/courses/util';
import { course_subject_enum as CourseSubjectEnum } from '@prisma/client';

const collectionId = process.env.WEBFLOW_COURSE_COLLECTION_ID;
const lectureCollectionId = process.env.WEBFLOW_LECTURE_COLLECTION_ID;
const appBaseUrl = 'https://app.lern-fair.de/single-course';

interface CourseDTO extends WebflowMetadata {
    fieldData: {
        slug?: string;
        name?: string;

        description: string;
        instructor: string;

        startingdate: string;
        endingdate: string;
        weekday: string;
        courseduration: string; // like "45 min"
        lecturecount: number;
        time: string; // like 16:00 Uhr
        appointments: string;

        category: string;
        link: string;
        maxparticipants: number;
        participantscount: number;
        openslots: number;
        subject: string;

        mingrade: number;
        maxgrade: number;

        lectures: string[];

        image: {
            fileId: string;
            url: string;
            alt: string;
        };
    };
}

function courseDTOFactory(data: any): CourseDTO {
    // This is just some syntactic sugar to convert the api data to an internal interface.
    // Late on we could implement some checks here, to verify the data.
    return data;
}

function generateInstructor(subcourse: WebflowSubcourse): string {
    const names = subcourse.subcourse_instructors_student.map((instructor) => `${instructor.student.firstname} ${instructor.student.lastname}`);
    return names.join(', ');
}

function getStartAndEndDate(subcourse: WebflowSubcourse): [Moment, Moment] | null {
    let earliestDate: Moment | null = null;
    let latestDate: Moment | null = null;
    for (const lecture of subcourse.lecture) {
        const lectureDate = moment(lecture.start);
        if (earliestDate === null || lectureDate.isBefore(earliestDate)) {
            earliestDate = moment(lecture.start);
        }
        if (latestDate === null || lectureDate.isAfter(latestDate)) {
            latestDate = moment(lecture.start);
        }
    }
    return earliestDate && latestDate ? [earliestDate, latestDate] : null;
}

function getTotalCouseDuration(subcourse: WebflowSubcourse): number {
    let duration = 0;
    for (const lecture of subcourse.lecture) {
        duration += lecture.duration;
    }
    return duration;
}

function listLectureStartDates(subcourse: WebflowSubcourse): string {
    const appointments = [];
    for (const lecture of subcourse.lecture) {
        const startDate = moment(lecture.start).locale('de');
        appointments.push(startDate.format('dddd, DD. MMMM YYYY, HH:mm [Uhr]'));
    }
    return appointments.join('\n');
}

function mapLecturesToCourse(logger: Logger, subcourse: WebflowSubcourse, lectureIds: DBIdMap<LectureDTO>): string[] {
    const result: LectureDTO[] = [];

    for (const lecture of subcourse.lecture) {
        if (lectureIds[lecture.id]) {
            result.push(lectureIds[lecture.id]);
        } else {
            logger.error('Cannot find lecture in webflow.', new Error('Cannot find lecture in webflow.'), { lectureId: lecture.id, courseId: subcourse.id });
        }
    }

    // This will make sure that the attached lectures are sorted by their start date.
    return result.sort((a, b) => new Date(a.fieldData.start).getTime() - new Date(b.fieldData.start).getTime()).map((lecture) => lecture.id);
}

// The description is a WYSIWYG editor that translates the information into HTML code, so we should do the same.
function parseDescription(description: string): string {
    // Replace new lines with <br> tags
    const newDescription = description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    // Wrap the description into a <p> tag, because webflow would do the same
    return `<p>${newDescription}</p>`;
}

function translateSubject(subject: CourseSubjectEnum): string {
    switch (subject) {
        case CourseSubjectEnum.P_dagogik:
            return 'Pädagogik';
        case CourseSubjectEnum.Franz_sisch:
            return 'Französisch';
        case CourseSubjectEnum.Niederl_ndisch:
            return 'Niederländisch';
        case CourseSubjectEnum.Deutsch_als_Zweitsprache:
            return 'Deutsch als Zweitsprache';
        default:
            return subject;
    }
}

function courseToDTO(logger: Logger, subcourse: WebflowSubcourse, lectureIds: DBIdMap<LectureDTO>): CourseDTO {
    const [startDate, endDate] = getStartAndEndDate(subcourse) || [moment(), moment()];

    // make sure that the weekday can be properly translated
    startDate.locale('de');

    const image = getCourseImageURL(subcourse.course);
    return {
        ...emptyMetadata,

        fieldData: {
            name: subcourse.course.name,
            slug: `${subcourse.id}`, // We are using a string to be safe for any case.

            description: parseDescription(subcourse.course.description),
            instructor: generateInstructor(subcourse),

            startingdate: startDate.toISOString(),
            endingdate: endDate.toISOString(),
            weekday: startDate.format('dddd'),
            courseduration: `${getTotalCouseDuration(subcourse)} min`, // TODO: maybe this can be done in a nicer way. Maybe with the help of moment?
            lecturecount: subcourse.lecture.length,
            time: startDate.format('HH:mm'),
            appointments: listLectureStartDates(subcourse),

            category: subcourse.course.category,
            link: `${appBaseUrl}/${subcourse.id}`,
            maxparticipants: subcourse.maxParticipants,
            participantscount: subcourse.subcourse_participants_pupil.length,
            openslots: subcourse.maxParticipants - subcourse.subcourse_participants_pupil.length,
            subject: translateSubject(subcourse.course.subject),

            mingrade: subcourse.minGrade,
            maxgrade: subcourse.maxGrade,

            lectures: mapLecturesToCourse(logger, subcourse, lectureIds),

            image: {
                fileId: 'placeholder', // not needed
                url: image,
                alt: image,
            },
        },
    };
}

function syncCourseImages(dbCourses: CourseDTO[], webflowCourses: CourseDTO[]) {
    const webflowCourseIdMap = mapToDBId(webflowCourses);

    for (const i in dbCourses) {
        if (!webflowCourseIdMap[dbCourses[i].fieldData.slug]) {
            continue;
        }
        const webflowCourse = webflowCourseIdMap[dbCourses[i].fieldData.slug];
        // We are misusing the alt of the image to store the original link.
        // Otherwise, we'll never know if webflow will change the link under the hood.
        if (dbCourses[i].fieldData.image.alt === webflowCourse.fieldData.image.alt) {
            dbCourses[i].fieldData.image = webflowCourse.fieldData.image;
        }
    }
}

export default async function syncCourses(logger: Logger): Promise<void> {
    logger.addContext('CMSCollection', 'Group Courses');

    logger.info('Start course sync');
    const webflowCourses = await getCollectionItems<CourseDTO>(collectionId, courseDTOFactory);
    const webflowLectures = await getCollectionItems<LectureDTO>(lectureCollectionId, lectureDTOFactory);
    logger.info(`Total courses retrieved from Webflow: ${webflowCourses.length}`);
    logger.info(`Total lectures retrieved from Webflow: ${webflowLectures.length}`);

    const lectureDBIdMap = mapToDBId<LectureDTO>(webflowLectures);

    const subCourses = await getWebflowSubcourses();
    const dbCourses = subCourses.map((course) => courseToDTO(logger, course, lectureDBIdMap));

    syncCourseImages(dbCourses, webflowCourses);
    const result = diff(logger, webflowCourses, dbCourses);
    logger.debug('Webflow course diff', { result });

    const newIds: string[] = [];
    for (const row of result.new) {
        try {
            const newId = await createNewItem(collectionId, row);
            newIds.push(newId);
        } catch (error) {
            logger.error('Could not create course in Webflow', error, { row });
        }
    }
    logger.info('created new items', { itemIds: newIds });

    for (const row of result.changed) {
        await patchItem(collectionId, row);
    }
    logger.info('updated items', { itemIds: result.changed.map((row) => row.id) });

    if (result.outdated.length > 0) {
        const outdatedIds = result.outdated.map((row) => row.id);
        logger.info('delete outdated items', { itemIds: outdatedIds });
        await deleteItems(collectionId, outdatedIds);
    }

    const publishedItems = await publishItems(collectionId);
    logger.info('publish new items', { itemIds: publishedItems });

    logger.info('finished course sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
