import { createNewItem, deleteItems, emptyMetadata, getCollectionItems, publishItems, WebflowMetadata } from './webflow-adapter';
import { diff, hash } from './diff';
import { Logger } from 'log4js';
import { prisma } from '../../../common/prisma';
import { course_coursestate_enum as courseState, Subcourse, Subcourse_instructors_student as SubcourseInstructorsStudent } from '../../../graphql/generated';

const collectionId = process.env.WEBFLOW_COLLECTION_ID;

interface CourseDTO extends WebflowMetadata {
    description: string;
    host: string;
    'short-description': string;

    'start-date': string;
    wochentag: string; // reference
    kursdauer: string; // reference
    repetitions: number;
    time: string; // maybe Date? was smth like 16:00;
    termine: string; // all appointments

    'course-type': string; // reference
    'link-to-course': string;
    'max-participants': number;
    'actual-participants': number;
    'subject-2': string; // reference

    vorkenntnisse: boolean;
    'min-grade': number;
    'max-grade': number;
    altergruppe: string; // reference

    'bild-copyright-info': string;
    thumbnail: {
        fileId: string; // reference
        url: string;
        alt: string | null;
    };
    'hero-image': {
        fileId: string; // reference
        url: string;
        alt: string | null;
    };
}

function courseDTOFactory(data: any): CourseDTO {
    // TODO: has to be implemented
    return data;
}

function generateHost(instructors: SubcourseInstructorsStudent[]): string {
    const names = instructors.map((instructor) => `${instructor.student.firstname} ${instructor.student.lastname}`);
    return names.join(', ');
}

function courseToDTO(subcourse: Subcourse): CourseDTO {
    const courseDTO: CourseDTO = {
        ...emptyMetadata,

        name: subcourse.course.name,
        // TODO add databaseid field ot cms
        databaseid: subcourse.id,

        description: subcourse.course.description,
        host: generateHost(subcourse.subcourse_instructors_student),
        'short-description': subcourse.course.outline,

        'start-date': '', // TODO: Einfach der Tag der ersten "Lecture"?
        wochentag: '', // TODO Wird noch gebraucht?
        kursdauer: '', // TODO on lecture level
        repetitions: subcourse.lecture.length,
        time: '', // maybe Date? was smth like 16:00;
        termine: '', // all appointments

        'course-type': subcourse.course.category, // TODO reference
        'link-to-course': '', // TODO Wird noch gebraucht?
        'max-participants': subcourse.maxParticipants,
        'actual-participants': subcourse.subcourse_participants_pupil.length,
        'subject-2': subcourse.course.subject, // TODO reference

        vorkenntnisse: false, // TODO Ich kann die Daten nicht finden
        'min-grade': subcourse.minGrade,
        'max-grade': subcourse.maxGrade,
        altergruppe: '', // TODO Wir haben die Daten nicht

        'bild-copyright-info': subcourse.course.imageKey,
        thumbnail: {
            fileId: '', // reference
            url: '',
            alt: '',
        },
        'hero-image': {
            fileId: '', // reference
            url: '',
            alt: '',
        },
    };
    courseDTO.slug = hash(courseDTO);
    return courseDTO;
}

export default async function syncCourses(logger: Logger): Promise<void> {
    logger.info('Start course sync');
    const webflowCourses = await getCollectionItems<CourseDTO>(collectionId, courseDTOFactory);
    const subCourses = await prisma.subcourse.findMany({
        where: { course: { courseState: courseState.allowed } },
        include: {
            course: true,
            subcourse_instructors_student: { include: { student: true } },
            subcourse_participants_pupil: true,
            lecture: true,
        },
    });
    const dbCourses = subCourses.map(courseToDTO);

    const result = diff(webflowCourses, dbCourses);

    const changedIds: string[] = [];
    for (const row of result.new) {
        const newId = await createNewItem(collectionId, row);
        changedIds.push(newId);
    }

    const outdatedIds = result.outdated.map((row) => row._id);
    await deleteItems(collectionId, outdatedIds);

    await publishItems(collectionId, changedIds);

    logger.info('finished course sync', { newItems: result.new.length, deletedItems: result.outdated.length });
}
