import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from 'log4js';
import { prisma } from '../../../common/prisma';
import moment, { Moment } from 'moment';
import { accessURLForKey } from '../../../common/file-bucket';
import { IS_PUBLIC_SUBCOURSE } from '../../../graphql/subcourse/fields';
import { Prisma } from '@prisma/client';

type WebflowSubcourse = Prisma.subcourseGetPayload<{
    include: {
        course: true;
        subcourse_instructors_student: { include: { student: true } };
        subcourse_participants_pupil: true;
        lecture: true;
    };
}>;

// This is needed so that the weekday will be translated properly.
moment.locale('de');

const collectionId = process.env.WEBFLOW_COLLECTION_ID;
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

// TODO create type with lectures
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
        const startDate = moment(lecture.start);
        appointments.push(startDate.format('dddd, DD. MMMM YYYY, HH:mm [Uhr]'));
    }
    return appointments.join('\n');
}

function courseToDTO(subcourse: WebflowSubcourse): CourseDTO {
    const startDate: Moment = getStartDate(subcourse) || moment();
    const courseDTO: CourseDTO = {
        ...emptyMetadata,

        name: subcourse.course.name,
        databaseid: `${subcourse.id}`, // We are using a string to be safe for any case.

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

        image: {
            fileId: 'placeholder', // not needed
            url: accessURLForKey(subcourse.course.imageKey),
            alt: '',
        },
    };
    courseDTO.slug = hash(courseDTO);
    return courseDTO;
}

export default async function syncCourses(logger: Logger): Promise<void> {
    logger.info('Start course sync');
    const webflowCourses = await getCollectionItems<WebflowMetadata>(collectionId, courseDTOFactory);
    const subCourses = await prisma.subcourse.findMany({
        where: IS_PUBLIC_SUBCOURSE(),
        include: {
            course: true,
            subcourse_instructors_student: { include: { student: true } },
            subcourse_participants_pupil: true,
            lecture: true,
        },
    });
    const dbCourses = subCourses.filter((course) => course.lecture.length > 0).map(courseToDTO);

    const result = diff(webflowCourses, dbCourses);
    logger.debug('Webflow course diff', { result });

    if (result.new.length) {
        const changedIds: string[] = [];
        for (const row of result.new) {
            const newId = await createNewItem(collectionId, row);
            changedIds.push(newId);
        }
        logger.info('publish new items', { itemIds: changedIds });
        await publishItems(collectionId, changedIds);
    }

    if (result.outdated.length > 0) {
        const outdatedIds = result.outdated.map((row) => row._id);
        logger.info('delete outdated items', { itemIds: outdatedIds });
        await deleteItems(collectionId, outdatedIds);
    }

    logger.info('finished course sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
