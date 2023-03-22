import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from 'log4js';
import { prisma } from '../../../common/prisma';
import { course_coursestate_enum as courseState, Subcourse, Subcourse_instructors_student as SubcourseInstructorsStudent } from '../../../graphql/generated';
import moment, { Moment } from 'moment';

// This is needed so that the weekday will be translated properly.
moment.locale('de');

const collectionId = process.env.WEBFLOW_COLLECTION_ID;

interface CourseDTO extends WebflowMetadata {
    description: string;
    instructor: string;
    aboutinstructor: string;
    subheading: string;

    startingdate: string;
    weekday: string;
    courseduration: string; // like "45 min"
    lessoncount: number;
    time: string; // like 16:00 Uhr
    appointments: string;

    category: string;
    link: string;
    maxparticipants: number;
    actualparticipants: number;
    subject: string;

    mingrade: number;
    maxgrade: number;
    priorknowledge: boolean;
    agegroup: string;
    level: string;

    imagecopyrightinfo: string;
    thumbnail: {
        fileId: string;
        url: string;
        alt: string;
    };
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

function generateInstructor(instructors: SubcourseInstructorsStudent[]): string {
    const names = instructors.map((instructor) => `${instructor.student.firstname} ${instructor.student.lastname}`);
    return names.join(', ');
}

function getStartDate(subcourse: Subcourse): Moment | null {
    let earliestDate: Moment | null = null;
    for (const lecture of subcourse.lecture) {
        const startDate = moment(lecture.start);
        if (earliestDate == null || startDate.isBefore(earliestDate)) {
            earliestDate = moment(lecture.start);
        }
    }
    return earliestDate;
}

function getCouseDuration(subcourse: Subcourse): number {
    let duration = 0;
    for (const lecture of subcourse.lecture) {
        duration += lecture.duration;
    }
    return duration;
}

function listAppointments(subcourse: Subcourse): string {
    let appointments = [];
    for (const lecture of subcourse.lecture) {
        const startDate = moment(lecture.start);
        appointments.push(startDate.format('dddd, DD. MMMM YYYY, HH:mm [Uhr]'));
    }
    return appointments.join('\n');
}

function courseToDTO(subcourse: Subcourse): CourseDTO {
    const startDate: Moment = getStartDate(subcourse) || moment();
    const courseDTO: CourseDTO = {
        ...emptyMetadata,

        name: subcourse.course.name,
        databaseid: `${subcourse.id}`, // We are using a string to be safe for any case.

        description: subcourse.course.description,
        instructor: generateInstructor(subcourse.subcourse_instructors_student),
        aboutinstructor: '', // TODO
        subheading: subcourse.course.outline,

        startingdate: startDate.toISOString(),
        weekday: startDate.format('dddd'),
        courseduration: `${getCouseDuration(subcourse)} min`, // TODO: maybe this can be done in a nicer way. Maybe with the help of moment?
        lessoncount: subcourse.lecture.length,
        time: startDate.format('HH:mm'),
        appointments: listAppointments(subcourse),

        category: subcourse.course.category,
        link: '', // TODO Wird noch gebraucht?
        maxparticipants: subcourse.maxParticipants,
        actualparticipants: subcourse.subcourse_participants_pupil.length,
        subject: subcourse.course.subject,

        mingrade: subcourse.minGrade,
        maxgrade: subcourse.maxGrade,
        priorknowledge: false, // TODO No data in DB
        agegroup: '', // TODO No data in DB
        level: '', // TODO

        imagecopyrightinfo: subcourse.course.imageKey,
        thumbnail: {
            fileId: 'placeholder', // not needed
            url: subcourse.course.imageKey,
            alt: '',
        },
        image: {
            fileId: 'placeholder', // not needed
            url: subcourse.course.imageKey,
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
        where: { course: { courseState: courseState.allowed } },
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
