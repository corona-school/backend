import { ApiCourse,
         ApiCourseTag,
         ApiInstructor,
         ApiLecture,
         ApiSubcourse,
         IDeleteLecture,
         IDeletesubcourse,
         IGetCourse,
         IGetCourses,
         IGroupMail,
         IJoinleaveInterface,
         IPostCourse,
         IPostlecture,
         IPostSubcourse,
         IPutcourse,
         IPutlecture,
         IPutsubcourse,
         IInstructormail,
         IJoincourseMeeting,
         IPostaddcourseInstructor,
         IImageHandler,
         IInviteExternal,
         ApiExternalGuestJoinMeetingResult,
         IIssueCertificate} from './../../controllers/courseController/format';
import { getPupilByWixID, Pupil } from '../../../common/entity/Pupil';
import { ScreeningStatus, Student } from '../../../common/entity/Student';
import { getLogger } from 'log4js';
import { getManager } from 'typeorm';
import { isJoinableCourse } from '../../controllers/courseController/utils';
import {
    Course,
    CourseCategory,
    CourseState
} from '../../../common/entity/Course';
import { v4 as uuidv4 } from "uuid";
import * as mime from 'mime-types';
import { prisma } from '../../../common/prisma';
import { putFile } from '../../../common/file-bucket';
import { deleteFile } from '../../../common/file-bucket/delete';
import { accessURLForKey } from '../../../common/file-bucket/s3';
import { CourseCache } from '../../controllers/courseController/course-cache';
import { addCleanupAction } from '../../../common/util/cleanup';
import { getTransactionLog } from '../../../common/transactionlog';
import AccessedCourseEvent from '../../../common/transactionlog/types/AccessedCourseEvent';
import { CourseTag } from '../../../common/entity/CourseTag';
import CreateCourseEvent from '../../../common/transactionlog/types/CreateCourseEvent';
import { Subcourse } from '../../../common/entity/Subcourse';
import { Lecture } from '../../../common/entity/Lecture';
import moment from 'moment-timezone';
import { sendGuestInvitationMail, sendParticipantCourseCertificate, sendSubcourseCancelNotifications } from '../../../common/mails/courses';
import CancelCourseEvent from '../../../common/transactionlog/types/CancelCourseEvent';
import CancelSubcourseEvent from '../../../common/transactionlog/types/CancelSubcourseEvent';
import { sendParticipantRegistrationConfirmationMail } from '../../../common/mails/courses';
import ParticipantJoinedCourseEvent from '../../../common/transactionlog/types/ParticipantJoinedCourseEvent';
import ParticipantJoinedWaitingListEvent from '../../../common/transactionlog/types/ParticipantJoinedWaitingListEvent';
import ParticipantLeftCourseEvent from '../../../common/transactionlog/types/ParticipantLeftCourseEvent';
import ParticipantLeftWaitingListEvent from '../../../common/transactionlog/types/ParticipantLeftWaitingListEvent';
import { sendInstructorGroupMail } from '../../../common/mails/courses';
import { sendParticipantToInstructorMail } from '../../../common/mails/courses';
import { createBBBMeeting, createOrUpdateCourseAttendanceLog, getMeetingUrl, isBBBMeetingInDB, isBBBMeetingRunning, startBBBMeeting } from '../../../common/util/bbb';
import { BBBMeeting } from '../../../common/entity/BBBMeeting';
import { getBBBMeetingFromDB } from '../../../common/util/bbb';
import { uniqueNamesGenerator, adjectives as NAME_GENERATOR_ADJECTIVES, names as NAME_GENERATOR_NAMES } from 'unique-names-generator';
import { courseImageKey } from '../../../web/controllers/courseController/course-images';
import { generateNewCourseGuestToken } from '../../../common/entity/CourseGuest';
import { CourseGuest } from '../../../common/entity/CourseGuest';
import isEmail from "validator/lib/isEmail";
import { getCourseCertificate } from '../../../common/courses/certificates';
import InstructorIssuedCertificateEvent from '../../../common/transactionlog/types/InstructorIssuedCertificateEvent';
import { CourseParticipationCertificate } from '../../../common/entity/CourseParticipationCertificate';

const logger = getLogger();

export async function getCourses(coursesData: IGetCourses): Promise<ApiCourse[] | number> {
    const entityManager = getManager();

    const {student,
           pupil,
           fields,
           states,
           instructorId,
           participantId,
           onlyJoinableCourses} = coursesData;

    let authenticatedStudent = false;
    let authenticatedPupil = false;
    if (student instanceof Student) {
        authenticatedStudent = true;
    }
    if (pupil instanceof Pupil) {
        authenticatedPupil = true;
    }

    if (instructorId != undefined && !authenticatedStudent) {
        logger.warn(
            `Unauthenticated user tried to access courses created by instructor (ID: ${instructorId})`
        );
        return 401;
    }

    if (participantId != undefined && !authenticatedPupil) {
        logger.warn(
            `Unauthenticated user tried to access courses joined by pupil (ID: ${participantId})`
        );
        return 401;
    }

    if (
        instructorId != undefined &&
        authenticatedStudent &&
        student.wix_id != instructorId
    ) {
        logger.warn(
            `User (ID: ${student.wix_id}) tried to filter by instructor id ${instructorId}`
        );
        logger.debug(student, fields, states, instructorId);
        return 403;
    }

    if (
        participantId != undefined &&
        authenticatedPupil &&
        pupil.wix_id != participantId
    ) {
        logger.warn(
            `User (ID: ${pupil.wix_id}) tried to filter by participant id ${participantId}`
        );
        logger.debug(pupil, fields, participantId);
        return 403;
    }

    if (states.length != 1 || states[0] != 'allowed') {
        if (!authenticatedStudent) {
            logger.warn(
                `Unauthenticated user tried to filter by states ${states.join(
                    ','
                )}`
            );
            return 401;
        } else if (instructorId == undefined) {
            logger.warn(
                `User (ID: ${
                    student.wix_id
                }) tried to filter by states ${states.join(
                    ','
                )} without specifying an instructor id`
            );
            logger.debug(student, fields, states, instructorId);
            return 403;
        }
    }

    if (states.length == 0) {
        logger.warn(
            'Request for /courses while filtering with states=(empty). This would never return any results'
        );
        logger.debug(student, fields, states, instructorId);
        return 400;
    }

    let cachedCourses = undefined;
    if (!authenticatedPupil && !authenticatedStudent) {
        //we only wanna cache in those cases
        const cacheKey = `${fields.sort().join(',')}`;

        cachedCourses = cache.get(cacheKey);

        if (!cachedCourses) {
            //HIT: do request and cache
            const result = await getAPICourses(
                undefined,
                undefined,
                fields,
                states,
                instructorId,
                participantId,
                authenticatedStudent,
                authenticatedPupil
            );

            if (typeof result === 'number') {
                //it's so dirty...
                return result;
            }
            cachedCourses = result;

            cache.set(cacheKey, cachedCourses);
        }
    }

    let apiCourses =
        cachedCourses ??
        (await getAPICourses(
            student,
            pupil,
            fields,
            states,
            instructorId,
            participantId,
            authenticatedStudent,
            authenticatedPupil
        ));

    if (typeof apiCourses === 'number') {
        //it's so dirty again...
        return apiCourses;
    }

    //filter out onlyJoinableCourses, if requested
    if (onlyJoinableCourses) {
        apiCourses = apiCourses.filter(isJoinableCourse);
    }

    return apiCourses;
}

export async function getAPICourses(
    student: Student | undefined,
    pupil: Pupil | undefined,
    fields: string[],
    states: string[],
    instructorId: string | undefined,
    participantId: string | undefined,
    authenticatedStudent: boolean,
    authenticatedPupil: boolean
): Promise<ApiCourse[] | number> {
    let stateFilters = [];
    for (let i = 0; i < states.length; i++) {
        let state: CourseState;
        switch (states[i]) {
            case 'created':
                state = CourseState.CREATED;
                break;
            case 'submitted':
                state = CourseState.SUBMITTED;
                break;
            case 'allowed':
                state = CourseState.ALLOWED;
                break;
            case 'denied':
                state = CourseState.DENIED;
                break;
            case 'cancelled':
                state = CourseState.CANCELLED;
                break;
            default:
                logger.warn('Unknown state: ' + states[i]);
                logger.debug(student, fields, states, instructorId);
                return 400;
        }
        stateFilters.push(state);
    }

    let apiCourses: Array<ApiCourse> = [];
    try {
        let customFilter = [];
        if (instructorId) {
            customFilter = [
                {
                    subcourse: {
                        some: {
                            // eslint-disable-next-line
                            subcourse_instructors_student: {
                                some: {
                                    student: {
                                        wix_id: student?.wix_id ?? 'invalid'
                                    }
                                }
                            }
                        }
                    }
                }
            ];
        } else if (participantId) {
            customFilter = [
                {
                    subcourse: {
                        some: {
                            // eslint-disable-next-line
                            subcourse_participants_pupil: {
                                some: {
                                    pupil: {
                                        wix_id: pupil?.wix_id ?? 'invalid' //todo rewrite...
                                    }
                                }
                            }
                        }
                    }
                }
            ];
        }

        const courses = await prisma.course.findMany({
            where: {
                AND: [
                    {
                        courseState: {
                            in: stateFilters
                        }
                    },
                    ...customFilter
                ]
            },
            include: {
                subcourse: {
                    include: {
                        // eslint-disable-next-line
                        subcourse_participants_pupil: {
                            include: {
                                pupil: true
                            }
                        },
                        // eslint-disable-next-line
                        subcourse_instructors_student: {
                            include: {
                                student: true
                            }
                        },
                        // eslint-disable-next-line
                        subcourse_waiting_list_pupil: {
                            include: {
                                pupil: true
                            }
                        },
                        lecture: {
                            include: {
                                student: true
                            }
                        }
                    }
                },
                // eslint-disable-next-line
                course_tags_course_tag: {
                    include: {
                        // eslint-disable-next-line
                        course_tag: true,
                    }
                },
                // eslint-disable-next-line
                course_instructors_student: {
                    include: {
                        student: true
                    }
                },
                student: true //correspondent id...
            }
        });

        for (let i = 0; i < courses.length; i++) {
            let apiCourse: ApiCourse = {
                id: courses[i].id,
                publicRanking: courses[i].publicRanking,
                allowContact: courses[i].allowContact,
                correspondentID:
                    instructorId != null &&
                    instructorId === student?.wix_id &&
                    courses[i].student?.wix_id //only if this endpoint is accessed by a student who is also an instructor of that course, return the correspondentID
            };
            for (let j = 0; j < fields.length; j++) {
                switch (fields[j].toLowerCase()) {
                    case 'id':
                        break;
                    case 'instructors':
                        apiCourse.instructors = [];
                        for (
                            let k = 0;
                            k < courses[i].course_instructors_student.length;
                            k++
                        ) {
                            let instructor: ApiInstructor = {
                                firstname:
                                    courses[i].course_instructors_student[k]
                                        .student.firstname,
                                lastname:
                                    courses[i].course_instructors_student[k]
                                        .student.lastname
                            };
                            if (
                                authenticatedStudent &&
                                student.wix_id != instructorId
                            ) {
                                instructor.id =
                                    courses[i].course_instructors_student[
                                        k
                                    ].student.wix_id;
                            }
                            apiCourse.instructors.push(instructor);
                        }
                        break;
                    case 'name':
                        apiCourse.name = courses[i].name;
                        break;
                    case 'outline':
                        apiCourse.outline = courses[i].outline;
                        break;
                    case 'description':
                        apiCourse.description = courses[i].description;
                        break;
                    case 'image':
                        apiCourse.image = courses[i].imageKey
                            ? accessURLForKey(courses[i].imageKey)
                            : null;
                        break;
                    case 'category':
                        apiCourse.category = courses[i].category;
                        break;
                    case 'tags':
                        apiCourse.tags = [];
                        for (
                            let k = 0;
                            k < courses[i].course_tags_course_tag.length;
                            k++
                        ) {
                            let tag: ApiCourseTag = {
                                id: courses[i].course_tags_course_tag[k]
                                    .course_tag.identifier,
                                name: courses[i].course_tags_course_tag[k]
                                    .course_tag.name,
                                category:
                                    courses[i].course_tags_course_tag[k]
                                        .course_tag.category
                            };
                            apiCourse.tags.push(tag);
                        }
                        break;
                    case 'subcourses':
                        apiCourse.subcourses = [];
                        if (courses[i].subcourse) {
                            for (
                                let k = 0;
                                k < courses[i].subcourse.length;
                                k++
                            ) {
                                let subcourse: ApiSubcourse = {
                                    id: courses[i].subcourse[k].id,
                                    minGrade: courses[i].subcourse[k].minGrade,
                                    maxGrade: courses[i].subcourse[k].maxGrade,
                                    maxParticipants:
                                        courses[i].subcourse[k].maxParticipants,
                                    participants:
                                        courses[i].subcourse[k]
                                            .subcourse_participants_pupil
                                            .length,
                                    instructors: [],
                                    lectures: [],
                                    joinAfterStart:
                                        courses[i].subcourse[k].joinAfterStart
                                };
                                for (
                                    let l = 0;
                                    l <
                                    courses[i].subcourse[k]
                                        .subcourse_instructors_student.length;
                                    l++
                                ) {
                                    let instructor: ApiInstructor = {
                                        firstname:
                                            courses[i].subcourse[k]
                                                .subcourse_instructors_student[
                                                    l
                                                ].student.firstname,
                                        lastname:
                                            courses[i].subcourse[k]
                                                .subcourse_instructors_student[
                                                    l
                                                ].student.lastname
                                    };
                                    if (
                                        authenticatedStudent &&
                                        student.wix_id == instructorId
                                    ) {
                                        instructor.id =
                                            courses[i].subcourse[
                                                k
                                            ].subcourse_instructors_student[
                                                l
                                            ].student.wix_id;
                                    }
                                    subcourse.instructors.push(instructor);
                                }
                                for (
                                    let l = 0;
                                    l < courses[i].subcourse[k].lecture.length;
                                    l++
                                ) {
                                    let lecture: ApiLecture = {
                                        id: courses[i].subcourse[k].lecture[l]
                                            .id,
                                        instructor: {
                                            firstname:
                                                courses[i].subcourse[k].lecture[
                                                    l
                                                ].student.firstname,
                                            lastname:
                                                courses[i].subcourse[k].lecture[
                                                    l
                                                ].student.lastname
                                        },
                                        start:
                                            courses[i].subcourse[k].lecture[
                                                l
                                            ].start.getTime() / 1000, //see https://github.com/prisma/prisma/issues/5051 -> if your local time (and thus the time of your timestamps in your database) is not UTC, then this endpoint will return the wrong result
                                        duration:
                                            courses[i].subcourse[k].lecture[l]
                                                .duration
                                    };
                                    if (
                                        authenticatedStudent &&
                                        student.wix_id == instructorId
                                    ) {
                                        lecture.instructor.id =
                                            courses[i].subcourse[k].lecture[
                                                l
                                            ].student.wix_id;
                                    }
                                    subcourse.lectures.push(lecture);
                                }
                                if (
                                    authenticatedStudent &&
                                    student.wix_id == instructorId
                                ) {
                                    subcourse.participantList = [];
                                    for (
                                        let l = 0;
                                        l <
                                        courses[i].subcourse[k]
                                            .subcourse_participants_pupil
                                            .length;
                                        l++
                                    ) {
                                        subcourse.participantList.push({
                                            uuid: courses[i].subcourse[k]
                                                .subcourse_participants_pupil[l]
                                                .pupil.wix_id,
                                            firstname:
                                                courses[i].subcourse[k]
                                                    .subcourse_participants_pupil[
                                                        l
                                                    ].pupil.firstname,
                                            lastname:
                                                courses[i].subcourse[k]
                                                    .subcourse_participants_pupil[
                                                        l
                                                    ].pupil.lastname,
                                            email: courses[i].subcourse[k]
                                                .subcourse_participants_pupil[l]
                                                .pupil.email,
                                            grade: parseInt(
                                                courses[i].subcourse[k]
                                                    .subcourse_participants_pupil[
                                                        l
                                                    ].pupil.grade
                                            ),
                                            schooltype:
                                                courses[i].subcourse[k]
                                                    .subcourse_participants_pupil[
                                                        l
                                                    ].pupil.schooltype
                                        });
                                    }
                                }
                                if (
                                    authenticatedPupil &&
                                    pupil.wix_id == participantId
                                ) {
                                    subcourse.onWaitingList = courses[
                                        i
                                    ].subcourse[
                                        k
                                    ].subcourse_waiting_list_pupil.some(
                                        (wlp) => wlp.pupilId === pupil.id
                                    );
                                    subcourse.joined = false;
                                    for (
                                        let l = 0;
                                        l <
                                        courses[i].subcourse[k]
                                            .subcourse_participants_pupil
                                            .length;
                                        l++
                                    ) {
                                        if (
                                            courses[i].subcourse[k]
                                                .subcourse_participants_pupil[l]
                                                .pupil.wix_id == pupil.wix_id
                                        ) {
                                            subcourse.joined = true;
                                            break;
                                        }
                                    }
                                }
                                apiCourse.subcourses.push(subcourse);
                            }
                        } else {
                            logger.debug(courses[i]);
                        }
                        break;
                    case 'state':
                        apiCourse.state = courses[i].courseState;
                        break;
                }
            }
            apiCourses.push(apiCourse);
        }
    } catch (e) {
        logger.error("Can't fetch courses: " + e.message);
        logger.debug(e);
        return 500;
    }

    return apiCourses;
}

const CACHE_RELOAD_INTERVAL = 600000; // in milliseconds, i.e. every 10 minutes
let cache = new CourseCache<ApiCourse[]>(CACHE_RELOAD_INTERVAL, async (key) => {
    const fields: string[] = key.split(',');
    const result = await getAPICourses(
        undefined,
        undefined,
        fields,
        ['allowed'],
        undefined,
        undefined,
        false,
        false
    );

    if (typeof result === 'number') {
        //it's so dirty...
        return null; //no refresh
    }

    return result;
});

addCleanupAction(() => cache.stopAutoReload()); //stop cache refresh on sigkill

export async function getCourse(
    courseData: IGetCourse
): Promise<ApiCourse | number> {
    const { student, pupil, courseId } = courseData;
    const entityManager = getManager();

    let authenticatedStudent = false;
    let authorizedStudent = false;
    if (student instanceof Student) {
        authenticatedStudent = true;
    }
    let authenticatedPupil = false;
    if (pupil instanceof Pupil) {
        authenticatedPupil = true;
    }

    let apiCourse: ApiCourse;
    try {
        const course = await entityManager.findOne(Course, { id: courseId });

        if (authenticatedStudent) {
            for (let i = 0; i < course.instructors.length; i++) {
                // We don't need to compare wix_id here
                if (student.id == course.instructors[i].id) {
                    authorizedStudent = true;
                }
            }
        }

        if (!authorizedStudent && course.courseState != CourseState.ALLOWED) {
            logger.error("Unauthorized user tried to access course of state " + course.courseState);
            logger.debug(student);
            return 403;
        }

        if (authorizedStudent || authenticatedPupil) {
            // transactionlog, that user accessed course
            const transactionLog = getTransactionLog();
            await transactionLog.log(
                new AccessedCourseEvent(pupil ?? student, course)
            );
        }

        apiCourse = {
            id: course.id,
            publicRanking: course.publicRanking,
            instructors: [],
            name: course.name,
            outline: course.outline,
            description: course.description,
            image: course.imageKey ? accessURLForKey(course.imageKey) : null,
            category: course.category,
            tags: [],
            subcourses: [],
            allowContact: course.allowContact
        };

        if (authorizedStudent) {
            apiCourse.state = course.courseState;
            apiCourse.correspondentID = course.correspondent?.wix_id; //only add the correspondent ID when students are requesting the course...
        }

        for (let i = 0; i < course.instructors.length; i++) {
            if (authorizedStudent) {
                apiCourse.instructors.push({
                    id: course.instructors[i].wix_id,
                    firstname: course.instructors[i].firstname,
                    lastname: course.instructors[i].lastname
                });
            } else {
                apiCourse.instructors.push({
                    firstname: course.instructors[i].firstname,
                    lastname: course.instructors[i].lastname
                });
            }
        }

        for (let i = 0; i < course.tags.length; i++) {
            apiCourse.tags.push({
                id: course.tags[i].identifier,
                name: course.tags[i].name,
                category: course.tags[i].category
            });
        }

        for (let i = 0; i < course.subcourses.length; i++) {
            // Skip not published subcourses for unauthorized users
            if (!authorizedStudent && !course.subcourses[i].published) {
                continue;
            }

            let subcourse: ApiSubcourse = {
                id: course.subcourses[i].id,
                instructors: [],
                minGrade: course.subcourses[i].minGrade,
                maxGrade: course.subcourses[i].maxGrade,
                maxParticipants: course.subcourses[i].maxParticipants,
                participants: course.subcourses[i].participants.length,
                lectures: [],
                joinAfterStart: course.subcourses[i].joinAfterStart,
                cancelled: course.subcourses[i].cancelled
            };
            if (authorizedStudent) {
                subcourse.published = course.subcourses[i].published;
            }
            for (let j = 0; j < course.subcourses[i].instructors.length; j++) {
                if (authorizedStudent) {
                    subcourse.instructors.push({
                        id: course.subcourses[i].instructors[j].wix_id,
                        firstname:
                            course.subcourses[i].instructors[j].firstname,
                        lastname: course.subcourses[i].instructors[j].lastname
                    });
                } else {
                    subcourse.instructors.push({
                        firstname:
                            course.subcourses[i].instructors[j].firstname,
                        lastname: course.subcourses[i].instructors[j].lastname
                    });
                }
            }
            for (let j = 0; j < course.subcourses[i].lectures.length; j++) {
                let lecture: ApiLecture = {
                    id: course.subcourses[i].lectures[j].id,
                    instructor: {
                        firstname:
                            course.subcourses[i].lectures[j].instructor
                                .firstname,
                        lastname:
                            course.subcourses[i].lectures[j].instructor
                                .lastname
                    },
                    start:
                        course.subcourses[i].lectures[j].start.getTime() / 1000,
                    duration: course.subcourses[i].lectures[j].duration
                };
                if (authorizedStudent) {
                    lecture.instructor.id =
                        course.subcourses[i].lectures[j].instructor.wix_id;
                }
                subcourse.lectures.push(lecture);
            }
            if (authorizedStudent) {
                subcourse.participantList = [];
                for (
                    let j = 0;
                    j < course.subcourses[i].participants.length;
                    j++
                ) {
                    subcourse.participantList.push({
                        uuid: course.subcourses[i].participants[j].wix_id,
                        firstname:
                            course.subcourses[i].participants[j].firstname,
                        lastname: course.subcourses[i].participants[j].lastname,
                        email: course.subcourses[i].participants[j].email,
                        grade: parseInt(
                            course.subcourses[i].participants[j].grade
                        ),
                        schooltype:
                            course.subcourses[i].participants[j].schooltype
                    });
                }
            }
            if (authenticatedPupil) {
                subcourse.onWaitingList =
                    course.subcourses[i].isPupilOnWaitingList(pupil);
                subcourse.joined = false;
                for (
                    let j = 0;
                    j < course.subcourses[i].participants.length;
                    j++
                ) {
                    if (course.subcourses[i].participants[j].id == pupil.id) {
                        subcourse.joined = true;
                        break;
                    }
                }
            }
            apiCourse.subcourses.push(subcourse);
        }
    } catch (e) {
        logger.error("Can't fetch courses: " + e.message);
        logger.debug(e);
        return 500;
    }

    return apiCourse;
}

export async function getCourseTags() {
    const entityManager = getManager();

    const tags = await entityManager.find(CourseTag);

    let apiResponse: ApiCourseTag[] = [];

    for (let i = 0; i < tags.length; i++) {
        let apiTag: ApiCourseTag = {
            id: tags[i].identifier,
            name: tags[i].name,
            category: tags[i].category
        };

        apiResponse.push(apiTag);
    }

    return apiResponse;
}

export async function postCourse(
    postData: IPostCourse
): Promise<ApiCourse | number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();
    const { student, apiCourse } = postData;

    if (
        !student.isInstructor ||
        (await student.instructorScreeningStatus()) != ScreeningStatus.Accepted
    ) {
        logger.warn(
            `Student (ID ${student.id}) tried to add an course, but is no instructor.`
        );
        logger.debug(student);
        return 403;
    }

    // Some checks
    if (apiCourse.instructors.indexOf(student.wix_id) < 0) {
        logger.warn(
            `Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(
                ', '
            )}`
        );
        logger.debug(apiCourse);
        return 400;
    }

    let filters = [];
    for (let i = 0; i < apiCourse.instructors.length; i++) {
        filters.push({
            wix_id: apiCourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, { where: filters });
    if (instructors.length != apiCourse.instructors.length) {
        logger.warn(
            `Field 'instructors' contains invalid values: ${apiCourse.instructors.join(
                ', '
            )}`
        );
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.name.length == 0 || apiCourse.name.length > 200) {
        logger.warn(`Invalid length of field 'name': ${apiCourse.name.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.outline.length == 0 || apiCourse.outline.length > 200) {
        logger.warn(
            `Invalid length of field 'outline': ${apiCourse.outline.length}`
        );
        logger.debug(apiCourse);
        return 400;
    }

    if (
        apiCourse.description.length == 0 ||
        apiCourse.description.length > 3000
    ) {
        logger.warn(
            `Invalid length of field 'description': ${apiCourse.description.length}`
        );
        logger.debug(apiCourse);
        return 400;
    }

    let category: CourseCategory;
    switch (apiCourse.category) {
        case 'revision':
            category = CourseCategory.REVISION;
            break;
        case 'club':
            category = CourseCategory.CLUB;
            break;
        case 'coaching':
            category = CourseCategory.COACHING;
            break;
        default:
            logger.warn(`Invalid course category: ${apiCourse.category}`);
            logger.debug(apiCourse);
            return 400;
    }

    filters = [];
    for (let i = 0; i < apiCourse.tags.length; i++) {
        filters.push({
            identifier: apiCourse.tags[i]
        });
    }
    let tags: CourseTag[] = [];
    if (filters.length > 0) {
        tags = await entityManager.find(CourseTag, { where: filters });
        if (tags.length != apiCourse.tags.length) {
            logger.warn(
                `Field 'tags' contains invalid values: ${apiCourse.tags.join(
                    ', '
                )}`
            );
            logger.debug(apiCourse, tags);
            return 400;
        }
    }

    if (
        apiCourse.allowContact === true &&
        typeof apiCourse.correspondentID !== 'string'
    ) {
        logger.warn(
            `Cannot allow contact for new course '${apiCourse.name}' without having provided a correspondentID!`
        );
        return 400;
    }

    const correspondent = instructors.find(
        (i) => i.wix_id === apiCourse.correspondentID
    );
    if (apiCourse.correspondentID != null && !correspondent) {
        logger.warn(
            `Cannot use correspondentID '${apiCourse.correspondentID}' for new course '${apiCourse.name}' because there is no user with such an ID who is part of the course's instructors.`
        );
        return 400;
    }

    const course = new Course();
    course.instructors = instructors;
    course.name = apiCourse.name;
    course.outline = apiCourse.outline;
    course.description = apiCourse.description;
    course.imageKey = undefined;
    course.category = category;
    course.tags = tags;
    course.subcourses = [];
    course.courseState = apiCourse.submit
        ? CourseState.SUBMITTED
        : CourseState.CREATED;
    course.allowContact = apiCourse.allowContact;
    course.correspondent = correspondent;

    try {
        await entityManager.save(Course, course);
        await transactionLog.log(new CreateCourseEvent(student, course));
        logger.info('Successfully saved new course');

        return {
            id: course.id,
            publicRanking: course.publicRanking,
            allowContact: course.allowContact
        };
    } catch (e) {
        logger.error("Can't save new course: " + e.message);
        logger.debug(course, e);
        return 500;
    }
}

export async function postSubcourse(
    postSubcourse: IPostSubcourse
): Promise<ApiSubcourse | number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const { student, courseId, apiSubcourse} = postSubcourse;

    if (
        !student.isInstructor ||
        (await student.instructorScreeningStatus()) != ScreeningStatus.Accepted
    ) {
        logger.warn(
            `Student (ID ${student.id}) tried to add an subcourse, but is no instructor.`
        );
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(
            `User tried to add subcourse to non existent course (ID ${courseId})`
        );
        logger.debug(student, apiSubcourse);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(
            `User tried to add subcourse, but has no access rights (ID ${courseId})`
        );
        logger.debug(student, apiSubcourse);
        return 403;
    }

    // Check validity of fields
    let filters = [];
    for (let i = 0; i < apiSubcourse.instructors.length; i++) {
        filters.push({
            wix_id: apiSubcourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, { where: filters });
    if (
        instructors.length == 0 ||
        instructors.length != apiSubcourse.instructors.length
    ) {
        logger.warn(
            `Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(
                ', '
            )}`
        );
        logger.debug(apiSubcourse);
        return 400;
    }

    if (
        !Number.isInteger(apiSubcourse.minGrade) ||
        apiSubcourse.minGrade < 1 ||
        apiSubcourse.minGrade > 13
    ) {
        logger.warn(
            `Field 'minGrade' contains an illegal value: ${apiSubcourse.minGrade}`
        );
        logger.debug(apiSubcourse);
        return 400;
    }

    if (
        !Number.isInteger(apiSubcourse.maxGrade) ||
        apiSubcourse.maxGrade < 1 ||
        apiSubcourse.maxGrade > 13
    ) {
        logger.warn(
            `Field 'maxGrade' contains an illegal value: ${apiSubcourse.maxGrade}`
        );
        logger.debug(apiSubcourse);
        return 400;
    }

    if (apiSubcourse.maxGrade < apiSubcourse.minGrade) {
        logger.warn(
            `Field 'maxGrade' is smaller than field 'minGrade': ${apiSubcourse.maxGrade} < ${apiSubcourse.minGrade}`
        );
        logger.debug(apiSubcourse);
        return 400;
    }

    if (apiSubcourse.maxParticipants == undefined) {
        apiSubcourse.maxParticipants = 30;
    }
    if (
        !Number.isInteger(apiSubcourse.maxParticipants) ||
        apiSubcourse.maxParticipants < 3 ||
        apiSubcourse.maxParticipants > 100
    ) {
        logger.warn(
            `Field 'maxParticipants' contains an illegal value: ${apiSubcourse.maxParticipants}`
        );
        logger.debug(apiSubcourse);
        return 400;
    }

    const subcourse = new Subcourse();
    subcourse.instructors = instructors;
    subcourse.course = course;
    subcourse.lectures = [];
    subcourse.minGrade = apiSubcourse.minGrade;
    subcourse.maxGrade = apiSubcourse.maxGrade;
    subcourse.maxParticipants = apiSubcourse.maxParticipants;
    subcourse.published = apiSubcourse.published;
    subcourse.joinAfterStart = apiSubcourse.joinAfterStart;
    subcourse.cancelled = false;

    try {
        await entityManager.save(Subcourse, subcourse);
        // todo add transactionlog
        logger.info('Successfully saved new subcourse');

        return {
            id: subcourse.id
        };
    } catch (e) {
        logger.error("Can't save new subcourse: " + e.message);
        logger.debug(subcourse, e);
        return 500;
    }
}

export async function postLecture(
    postLectureData: IPostlecture
): Promise<{ id: number } | number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const { student, courseId, subcourseId, apiLecture } = postLectureData;

    if (
        !student.isInstructor ||
        (await student.instructorScreeningStatus()) != ScreeningStatus.Accepted
    ) {
        logger.warn(
            `Student (ID ${student.id}) tried to add a lecture, but is no instructor.`
        );
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(
            `User tried to add lecture to non-existent course (ID ${courseId})`
        );
        logger.debug(student, apiLecture);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {
        id: subcourseId,
        course: course
    });
    if (subcourse == undefined) {
        logger.warn(
            `User tried to add lecture to non-existent subcourse (ID ${subcourseId})`
        );
        logger.debug(student, apiLecture);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(
            `User tried to add lecture, but has no access rights (ID ${courseId})`
        );
        logger.debug(student, apiLecture);
        return 403;
    }

    // Check validity of fields
    let instructor: Student = undefined;
    for (let i = 0; i < subcourse.instructors.length; i++) {
        if (apiLecture.instructor == subcourse.instructors[i].wix_id) {
            instructor = subcourse.instructors[i];
        }
    }
    if (instructor == undefined) {
        logger.warn(
            `Field 'instructor' contains an illegal value: ${apiLecture.instructor}`
        );
        logger.debug(apiLecture);
        return 400;
    }

    // You can only create lectures that start at least in 2 days (but don't respect the time while doing this check) – but this restriction does not apply if the course is already submitted
    if (
        !Number.isInteger(apiLecture.start) ||
        (course.courseState !== CourseState.CREATED &&
            moment.unix(apiLecture.start).isBefore(moment())) ||
        (course.courseState === CourseState.CREATED &&
            moment
                .unix(apiLecture.start)
                .isBefore(moment().add(7, 'days')
                    .startOf('day')))
    ) {
        logger.warn(
            `Field 'start' contains an illegal value: ${apiLecture.start}`
        );
        logger.debug(apiLecture);
        return 400;
    }

    if (
        !Number.isInteger(apiLecture.duration) ||
        apiLecture.duration < 15 ||
        apiLecture.duration > 480
    ) {
        logger.warn(
            `Field 'duration' contains an illegal value: ${apiLecture.duration}`
        );
        logger.debug(apiLecture);
        return 400;
    }

    const lecture = new Lecture();
    lecture.instructor = instructor;
    lecture.subcourse = subcourse;
    lecture.start = new Date(apiLecture.start * 1000);
    lecture.duration = apiLecture.duration;

    try {
        await entityManager.save(Lecture, lecture);
        // todo add transactionlog
        logger.info('Successfully saved new lecture');

        return {
            id: lecture.id
        };
    } catch (e) {
        logger.error("Can't save new lecture: " + e.message);
        logger.debug(lecture, e);
        return 500;
    }
}

export async function putCourse(
    putcourseData: IPutcourse
): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const {student, courseId, apiCourse } = putcourseData;
    if (
        !student.isInstructor ||
        (await student.instructorScreeningStatus()) != ScreeningStatus.Accepted
    ) {
        logger.warn(
            `Student (ID ${student.id}) tried to edit a course, but is no instructor.`
        );
        logger.debug(student);
        return 403;
    }

    // Check access right
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to edit non-existent course (ID ${courseId})`);
        logger.debug(student, apiCourse);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(
            `User tried to edit course, but has no access rights (ID ${courseId})`
        );
        logger.debug(student, apiCourse);
        return 403;
    }

    // Validate input
    if (apiCourse.instructors.indexOf(student.wix_id) < 0) {
        logger.warn(
            `Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(
                ', '
            )}`
        );
        logger.debug(apiCourse);
        return 400;
    }

    let filters = [];
    for (let i = 0; i < apiCourse.instructors.length; i++) {
        filters.push({
            wix_id: apiCourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, { where: filters });
    if (instructors.length != apiCourse.instructors.length) {
        logger.warn(
            `Field 'instructors' contains invalid values: ${apiCourse.instructors.join(
                ', '
            )}`
        );
        logger.debug(apiCourse);
        return 400;
    }
    course.instructors = instructors;

    if (apiCourse.name != undefined) {
        if (apiCourse.name.length == 0 || apiCourse.name.length > 200) {
            logger.warn(
                `Invalid length of field 'name': ${apiCourse.name.length}`
            );
            logger.debug(apiCourse);
            return 400;
        }
        course.name = apiCourse.name;
    }

    if (apiCourse.outline != undefined) {
        if (apiCourse.outline.length == 0 || apiCourse.outline.length > 200) {
            logger.warn(
                `Invalid length of field 'outline': ${apiCourse.outline.length}`
            );
            logger.debug(apiCourse);
            return 400;
        }
        course.outline = apiCourse.outline;
    }

    if (
        apiCourse.description.length == 0 ||
        apiCourse.description.length > 3000
    ) {
        logger.warn(
            `Invalid length of field 'description': ${apiCourse.description.length}`
        );
        logger.debug(apiCourse);
        return 400;
    }
    course.description = apiCourse.description;

    if (
        apiCourse.allowContact === true &&
        typeof apiCourse.correspondentID !== 'string'
    ) {
        logger.warn(
            `Cannot allow contact for course ${course.id} without having provided a correspondentID!`
        );
        return 400;
    }
    course.allowContact = apiCourse.allowContact;

    //check correspondent ID
    const correspondent = course.instructors.find(
        (i) => i.wix_id === apiCourse.correspondentID
    );
    if (apiCourse.correspondentID != null && !correspondent) {
        logger.warn(
            `Cannot use correspondentID '${apiCourse.correspondentID}' for course ${course.id} because there is no user with such an ID who is part of the course's instructors.`
        );
        return 400;
    }
    course.correspondent = correspondent;

    if (apiCourse.category != undefined) {
        let category: CourseCategory;
        switch (apiCourse.category) {
            case 'revision':
                category = CourseCategory.REVISION;
                break;
            case 'club':
                category = CourseCategory.CLUB;
                break;
            case 'coaching':
                category = CourseCategory.COACHING;
                break;
            default:
                logger.warn(`Invalid course category: ${apiCourse.category}`);
                logger.debug(apiCourse);
                return 400;
        }
        course.category = category;
    }

    filters = [];
    for (let i = 0; i < apiCourse.tags.length; i++) {
        filters.push({
            identifier: apiCourse.tags[i]
        });
    }
    let tags: CourseTag[] = [];
    if (filters.length > 0) {
        tags = await entityManager.find(CourseTag, { where: filters });
        if (tags.length != apiCourse.tags.length) {
            logger.warn(
                `Field 'tags' contains invalid values: ${apiCourse.tags.join(
                    ', '
                )}`
            );
            logger.debug(apiCourse, tags);
            return 400;
        }
    }
    course.tags = tags;

    //if course is already reviewed (i.e. either allowed, denied or cancelled) or submitted, the course state should not change at all
    if (
        course.courseState === CourseState.CREATED &&
        apiCourse.submit != undefined
    ) {
        //so only if course is created, it could be possible to change the course state to submitted
        course.courseState = apiCourse.submit
            ? CourseState.SUBMITTED
            : CourseState.CREATED;
    } else if (apiCourse.submit === false) {
        logger.warn(`Field 'submit' is not editable on submitted courses`);
        logger.debug(apiCourse);
        return 403;
    } else if (apiCourse.submit != undefined) {
        //only change the course state, if the submit value is part of the request
        //just issue a warning message...
        logger.warn(
            `Course submission state for course number ${course.id} will not be changed, since it was already reviewed`
        );
    }

    try {
        await entityManager.save(Course, course);
        // todo add transaction log
        logger.info('Successfully edited course');

        return 204;
    } catch (e) {
        logger.error("Can't edit course: " + e.message);
        logger.debug(course, e);
        return 500;
    }
}

export async function putSubcourse(putSubcourseData: IPutsubcourse): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    const { student, courseId, subcourseId, apiSubcourse} = putSubcourseData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to edit a subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to edit subcourse of non existent course (ID ${courseId})`);
        logger.debug(student, apiSubcourse);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn(`User tried to edit non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student, apiSubcourse);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(`User tried to edit subcourse, but has no access rights (ID ${courseId})`);
        logger.debug(student, apiSubcourse);
        return 403;
    }

    // Check validity of fields
    let filters = [];
    for (let i = 0; i < apiSubcourse.instructors.length; i++) {
        filters.push({
            wix_id: apiSubcourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, { where: filters });
    if (instructors.length == 0 || instructors.length != apiSubcourse.instructors.length) {
        logger.warn(`Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(', ')}`);
        logger.debug(apiSubcourse);
        return 400;
    }
    subcourse.instructors = instructors;

    // Always allow raising the maxGrade
    if (!Number.isInteger(apiSubcourse.minGrade) || apiSubcourse.minGrade < 1 || apiSubcourse.minGrade > 13) {
        logger.warn(`Field 'minGrade' contains an illegal value: ${apiSubcourse.minGrade}`);
        logger.debug(apiSubcourse);
        return 400;
    }

    // Always allow lowering the minGrade
    if (!Number.isInteger(apiSubcourse.maxGrade) || apiSubcourse.maxGrade < 1 || apiSubcourse.maxGrade > 13) {
        logger.warn(`Field 'maxGrade' contains an illegal value: ${apiSubcourse.maxGrade}`);
        logger.debug(apiSubcourse);
        return 400;
    }

    if (apiSubcourse.maxGrade < apiSubcourse.minGrade) {
        logger.warn(`Field 'maxGrade' is smaller than field 'minGrade': ${apiSubcourse.maxGrade} < ${apiSubcourse.minGrade}`);
        logger.debug(apiSubcourse);
        return 400;
    }
    subcourse.minGrade = apiSubcourse.minGrade;
    subcourse.maxGrade = apiSubcourse.maxGrade;

    // Always allow lowering the maxParticipants
    if (!Number.isInteger(apiSubcourse.maxParticipants) || apiSubcourse.maxParticipants < 3 || apiSubcourse.maxParticipants > 100) {
        logger.warn(`Field 'maxParticipants' contains an illegal value: ${apiSubcourse.maxParticipants}`);
        logger.debug(apiSubcourse);
        return 400;
    }
    subcourse.maxParticipants = apiSubcourse.maxParticipants;

    if (subcourse.published && !apiSubcourse.published) {
        logger.warn("Can't unpublish subcourse");
        logger.debug(subcourseId, apiSubcourse);
        return 400;
    }
    subcourse.published = apiSubcourse.published;

    subcourse.joinAfterStart = apiSubcourse.joinAfterStart;

    try {
        await entityManager.save(Subcourse, subcourse);
        // todo add transactionlog
        logger.info("Successfully edited subcourse");

        return 204;
    } catch (e) {
        logger.error("Can't save new subcourse: " + e.message);
        logger.debug(subcourse, e);
        return 500;
    }
}

/**
 * @api {PUT} /course/:id/subcourse/:subid/lecture/:lecid EditLecture
 * @apiVersion 1.1.0
 * @apiDescription
 * Edit a lecture.
 *
 * This endpoint allows editing an existing lecture.
 * A lecture can only be editable by owners of the main course.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {int} lecid ID of the lecture
 *
 * @apiName EditLecture
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PutLecture
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/lecture/<LECID> -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function putLecture(putLectureData: IPutlecture): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const { student, courseId, subcourseId, lectureId, apiLecture} = putLectureData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add a lecture, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to edit lecture of non-existent course (ID ${courseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn(`User tried to edit lecture of non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    const lecture = await entityManager.findOne(Lecture, { id: lectureId, subcourse: subcourse });
    if (lecture == undefined) {
        logger.warn(`User tried to edit non-existent lecture (ID ${subcourseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(`User tried to edit lecture, but has no access rights (ID ${courseId})`);
        logger.debug(student, apiLecture);
        return 403;
    }

    if (lecture.start.getTime() < (new Date()).getTime()) {
        logger.warn(`User tried to edit lecture from the past (ID ${courseId})`);
        logger.debug(student, apiLecture);
        return 403;
    }

    // Check validity of fields
    let instructor: Student = undefined;
    for (let i = 0; i < subcourse.instructors.length; i++) {
        if (apiLecture.instructor == subcourse.instructors[i].wix_id) {
            instructor = subcourse.instructors[i];
        }
    }
    if (instructor == undefined) {
        logger.warn(`Field 'instructor' contains an illegal value: ${apiLecture.instructor}`);
        logger.debug(apiLecture);
        return 400;
    }
    lecture.instructor = instructor;

    // the 2 day restriction does not apply when editing lectures -> the lecture date must only be in the future
    if (!Number.isInteger(apiLecture.start) || moment.unix(apiLecture.start).isBefore(moment())) {
        logger.warn(`Field 'start' contains an illegal value: ${apiLecture.start}`);
        logger.debug(apiLecture);
        return 400;
    }
    lecture.start = new Date(apiLecture.start * 1000);

    if (!Number.isInteger(apiLecture.duration) || apiLecture.duration < 15 || apiLecture.duration > 480) {
        logger.warn(`Field 'duration' contains an illegal value: ${apiLecture.duration}`);
        logger.debug(apiLecture);
        return 400;
    }
    lecture.duration = apiLecture.duration;

    try {
        await entityManager.save(Lecture, lecture);
        // todo add transactionlog
        logger.info("Successfully edited lecture");

        return 204;
    } catch (e) {
        logger.error("Can't save edited lecture: " + e.message);
        logger.debug(lecture, e);
        return 500;
    }
}


/**
 * @api {DELETE} /course/:id CancelCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Cancel a course.
 *
 * This endpoint allows cancelling a course, which means that all planned subcourses will be cancelled.
 * Furthermore the registered participants will be notified and the course won't appear in the public register anymore.
 * The course and all subresources won't be editable anymore
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName CancelCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function deleteCourse(student: Student, courseId: number): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to cancel a course, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access right
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to cancel non-existent course (ID ${courseId})`);
        logger.debug(student);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(`User tried to cancel course, but has no access rights (ID ${courseId})`);
        logger.debug(student);
        return 403;
    }

    if (course.courseState != CourseState.CANCELLED) {
        // We have a non-mitigated race condition here: Someone could post a new subcourse into the course, while the course gets cancelled
        try {
            // Run in transaction, so we may not have a mixed state, where some subcourses are cancelled, but others are not
            await entityManager.transaction(async em => {

                for (let i = 0; i < course.subcourses.length; i++) {
                    if (!course.subcourses[i].cancelled) {
                        course.subcourses[i].cancelled = true;
                        await em.save(Subcourse, course.subcourses[i]);
                        sendSubcourseCancelNotifications(course, course.subcourses[i]);
                    }
                }

                course.courseState = CourseState.CANCELLED;
                await em.save(Course, course);

            }).catch(e => {
                logger.error("Can't cancel course");
                logger.debug(course, e);
            });

            transactionLog.log(new CancelCourseEvent(student, course));
            logger.info("Successfully cancelled course");

            return 204;
        } catch (e) {
            logger.error("Can't cancel course: " + e.message);
            logger.debug(course, e);
            return 500;
        }
    } else {
        logger.warn(`User tried to delete course repeatedly (ID ${courseId})`);
        logger.debug(student);
        return 403;
    }
}

/**
 * @api {DELETE} /course/:id/subcourse/:subid CancelSubcourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Cancel a subcourse.
 *
 * This endpoint allows cancelling a subcourse.
 * All registered participants will be notified and the course won't appear in the public register anymore.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName CancelCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function deleteSubcourse(deletesubcourseData: IDeletesubcourse): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    const { student, courseId, subcourseId } = deletesubcourseData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to cancel a subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to cancel subcourse of non existent course (ID ${courseId})`);
        logger.debug(student);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn(`User tried to cancel non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(`User tried to cancel subcourse, but has no access rights (ID ${courseId})`);
        logger.debug(student);
        return 403;
    }

    if (!subcourse.cancelled) {
        subcourse.cancelled = true;
    } else {
        logger.warn(`User tried to cancel subcourse repeatedly (ID ${subcourseId})`);
        logger.debug(student);
        return 403;
    }

    try {
        await entityManager.save(Subcourse, subcourse);
        await sendSubcourseCancelNotifications(course, subcourse);
        await transactionLog.log(new CancelSubcourseEvent(student, subcourse));
        logger.info("Successfully cancelled subcourse");

        return 204;
    } catch (e) {
        logger.error("Can't cancelled subcourse: " + e.message);
        logger.debug(subcourse, e);
        return 500;
    }
}

/**
 * @api {DELETE} /course/:id/subcourse/:subid/lecture/:lecid DeleteLecture
 * @apiVersion 1.1.0
 * @apiDescription
 * Delete a lecture.
 *
 * This endpoint allows deleting a lecture.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {int} lecid ID of the lecture
 *
 * @apiName CancelCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/lecture/<LECID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function deleteLecture(deleteLectureData: IDeleteLecture): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const {student, courseId, subcourseId, lectureId} = deleteLectureData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to delete a lecture, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        logger.warn(`User tried to delete a lecture of non-existent course (ID ${courseId})`);
        logger.debug(student);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn(`User tried to delete a lecture of non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student);
        return 404;
    }

    const lecture = await entityManager.findOne(Lecture, { id: lectureId, subcourse: subcourse });
    if (lecture == undefined) {
        logger.warn(`User tried to delete non-existent lecture (ID ${subcourseId})`);
        logger.debug(student);
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn(`User tried to delete lecture, but has no access rights (ID ${courseId})`);
        logger.debug(student);
        return 403;
    }

    if (lecture.start.getTime() < (new Date()).getTime()) {
        logger.warn(`User tried to delete lecture from the past (ID ${courseId})`);
        logger.debug(student);
        return 403;
    }

    try {
        await entityManager.remove(Lecture, lecture);
        // todo add transactionlog
        logger.info("Successfully deleted lecture");

        return 204;
    } catch (e) {
        logger.error("Can't delete lecture: " + e.message);
        logger.debug(lecture, e);
        return 500;
    }
}

/**
 * @api {POST} /course/:id/subcourse/:subid/participants/:userid JoinCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Join a (sub)course.
 *
 * This endpoint allows joining a subcourse.
 * Only accessable for authorized participants.
 * If all places are already taken or subcourse has already started 409 Conflict is returned
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {string} userid ID of the participant
 *
 * @apiName JoinCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/participants/<USERID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */

export async function joinSubcourse(joinsubcourseData: IJoinleaveInterface): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const {pupil, courseId, subcourseId, userId}= joinsubcourseData;

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        logger.warn("Unauthorized pupil tried to join course");
        logger.debug(pupil, userId);
        return 403;
    }

    // Try to join course
    let status = 204;
    await entityManager.transaction(async em => {
        try {
            const course = await em.findOneOrFail(Course, { id: courseId, courseState: CourseState.ALLOWED });
            const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course, published: true });

            // Check if course is full
            if (subcourse.maxParticipants <= subcourse.participants.length) {
                logger.warn("Pupil can't join subcourse, because it is already full");
                logger.debug(subcourse);
                status = 409;
                return;
            }
            // Check if course has already started
            let startDate = (new Date()).getTime() + 3600000;
            for (let i = 0; i < subcourse.lectures.length; i++) {
                if (startDate > subcourse.lectures[i].start.getTime()) {
                    startDate = subcourse.lectures[i].start.getTime();
                }
            }
            if (startDate < (new Date()).getTime() && !subcourse.joinAfterStart) {
                logger.warn("Pupil can't join subcourse, because it has already started");
                logger.debug(subcourse);
                status = 409;
                return;
            }

            //check if pupil has less than 3 active courses (because a pupil is allowed to only have 3 active courses at a time)
            const pupilWithSubcourses = await em.findOne(Pupil, { //quick and dirty solution without rewriting large parts of the code -> refetch from database including the subcourses...
                where: {
                    wix_id: pupil.wix_id
                },
                relations: ["subcourses"]
            });
            const numberOfActiveSubcourses = pupilWithSubcourses.subcourses?.filter(s => s.isActiveSubcourse()).length;
            if (numberOfActiveSubcourses >= 10) { //todo: don't hardcode this constant here...
                logger.warn(`Pupil with id ${pupil.id} can't join subcourse, because she already has ${numberOfActiveSubcourses} active courses`);
                status = 429; //use this to quickly indicate that the pupil has too much active subcourses
                return;
            }

            //remove participant from waiting list, if he is on the waiting list
            subcourse.removePupilFromWaitingList(pupil);

            subcourse.participants.push(pupil);
            await em.save(Subcourse, subcourse);

            logger.info("Pupil successfully joined subcourse");

            //send confirmation to participant
            try {
                await sendParticipantRegistrationConfirmationMail(pupil, course, subcourse);
            } catch (e) {
                logger.warn(`Will not send participant confirmation mail for subcourse with ID ${subcourse.id} due to error ${e.toString()}. However the participant ${pupil.id} has still been enrolled in the course.`);
            }

            // transactionlog
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantJoinedCourseEvent(pupil, subcourse));

        } catch (e) {
            logger.warn("Can't join subcourse");
            logger.debug(e);
            status = 400;
        }
    });

    return status;
}
/**
 * @api {POST} /course/:id/subcourse/:subid/waitinglist/:userid JoinCourseWaitingList
 * @apiVersion 1.1.0
 * @apiDescription
 * Join a (sub)course waiting list.
 *
 * This endpoint allows joining a subcourse's waiting list.
 * Only accessable for authorized participants.
 * If subcourse has already started or pupil already is on the waiting list 409 Conflict is returned. Joining the waiting list is only possible if course is full.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {string} userid ID of the participant
 *
 * @apiName JoinCourseWaitingList
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/waitinglist/<USERID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */

export async function joinWaitingList(joinwaitinglistData: IJoinleaveInterface): Promise<number> {
    const entityManager = getManager();
    const {pupil, courseId, subcourseId, userId}= joinwaitinglistData;

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        logger.warn("Unauthorized pupil tried to join course waiting list");
        logger.debug(pupil, userId);
        return 403;
    }

    // Try to join course
    let status = 204;
    await entityManager.transaction(async em => {
        try {
            const course = await em.findOneOrFail(Course, { id: courseId, courseState: CourseState.ALLOWED });
            const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course, published: true });

            // make sure course not already started
            const firstLecture = subcourse.firstLecture();

            if (firstLecture && moment(firstLecture.start).isBefore(moment()) && !course.subcourses[0].joinAfterStart) {
                //cannot queue on waiting list, because late join is not allowed
                logger.info(`Pupil ${pupil.id} cannot join waiting list of subcourse ${subcourseId}, because the course already started and late joins are not permitted.`);
                status = 409;
                return;
            }

            // Check if course is full
            if (subcourse.maxParticipants <= subcourse.participants.length) {
                //check if pupil is already on the waiting list
                if (subcourse.isPupilOnWaitingList(pupil)) {
                    status = 409;
                    logger.info(`Pupil ${pupil.id} cannot join waiting list of subcourse ${subcourseId}, because he's already on the waiting list`);
                    return;
                }

                //add pupil to the waiting list
                subcourse.addPupilToWaitingList(pupil);

                status = 202; //indicate that probably the join will be completed later (i.e. the pupil is on the waiting list)

                await em.save(Subcourse, subcourse);
                logger.info(`Pupil ${pupil.id} successfully joined waiting list of subcourse ${subcourseId}`);

                // transactionlog (remove this, if there is a performance problem with joining the waiting list -> because this introduces some performance problems!)
                const transactionLog = getTransactionLog();
                await transactionLog.log(new ParticipantJoinedWaitingListEvent(pupil, course));

                return;
            } else {
                logger.warn(`Pupil  ${pupil.id} can't join waiting list of subcourse ${subcourseId}, because the course is not full.`);
            }
        } catch (e) {
            logger.warn("Can't join waitinglist of subcourse");
            logger.debug(e);
            status = 400;
        }
    });

    return status;
}

/**
 * @api {DELETE} /course/:id/subcourse/:subid/participants/:userid LeaveCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Leave a course.
 *
 * This endpoint allows leaving an already joined course.
 * Only accessable for authorized participants.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {string} userid ID of the participant
 *
 * @apiName LeaveCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/participants/<USERID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function leaveSubcourse(leavesubcourseData: IJoinleaveInterface): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const {pupil, courseId, subcourseId, userId} = leavesubcourseData;

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        logger.warn("Unauthorized pupil tried to leave course");
        logger.debug(pupil, userId);
        return 403;
    }

    // Try to leave course
    let status = 204;
    await entityManager.transaction(async em => {
        // Note: The transaction here is important, since concurrent accesses to subcourse.participants are not safe
        try {
            const course = await em.findOneOrFail(Course, { id: courseId });
            const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course });

            // Check if pupil is participant
            let index: number = undefined;
            for (let i = 0; i < subcourse.participants.length; i++) {
                if (subcourse.participants[i].wix_id == userId) {
                    index = i;
                    break;
                }
            }
            if (index == undefined) {
                logger.warn("Pupil tried to leave subcourse he didn't join");
                logger.debug(subcourse, userId);
                status = 400;
                return;
            }

            subcourse.participants.splice(index, 1);
            await em.save(Subcourse, subcourse);

            logger.info("Pupil successfully left subcourse");

            // transactionlog
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantLeftCourseEvent(pupil, subcourse));

        } catch (e) {
            logger.warn("Can't leave subcourse");
            logger.debug(e);
            status = 400;
        }
    });

    return status;
}
/**
 * @api {DELETE} /course/:id/subcourse/:subid/waitinglist/:userid LeaveCourseWaitingList
 * @apiVersion 1.1.0
 * @apiDescription
 * Leave a course's waiting list.
 *
 * This endpoint allows leaving the waiting list of a course.
 * Only accessable for authorized participants.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 * @apiParam (URL Parameter) {string} userid ID of the participant
 *
 * @apiName LeaveCourseWaitingList
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/waitinglist/<USERID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function leaveWaitingList(leavewaitinglistData: IJoinleaveInterface): Promise<number> {
    const entityManager = getManager();

    const {pupil, courseId, subcourseId, userId} = leavewaitinglistData;

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        logger.warn("Unauthorized pupil tried to leave course's waitinglist");
        logger.debug(pupil, userId);
        return 403;
    }

    // Try to leave course
    let status = 204;
    await entityManager.transaction(async em => {
        // Note: The transaction here is important, since concurrent accesses to subcourse.participants are not safe
        try {
            const course = await em.findOneOrFail(Course, { id: courseId });
            const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course });

            // Check if pupil is on waiting list
            if (!subcourse.isPupilOnWaitingList(pupil)) {
                logger.warn(`Pupil ${pupil.id} tried to leave waiting list of subcourse nr ${subcourseId} he didn't join`);
                status = 400;
                return;
            }

            //leave waiting list
            subcourse.removePupilFromWaitingList(pupil);
            await em.save(Subcourse, subcourse);

            logger.info(`Pupil ${pupil.id} successfully left waiting list of subcourse nr ${subcourseId}`);

            //             transactionlog
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantLeftWaitingListEvent(pupil, course));
        } catch (e) {
            logger.warn("Can't leave subcourse's waiting list");
            logger.debug(e);
            status = 400;
        }
    });

    return status;
}

/**
 * @api {POST} /course/:id/subcourse/:subid/groupmail GroupMail
 * @apiVersion 1.1.0
 * @apiDescription
 * Send a group mail to all participants.
 *
 * The course and subcourse instructors may use this endpoint to send a mail to all participants
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName GroupMail
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiUse PostGroupMail
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/groupmail -d "<REQUEST"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function groupMail(groupMailData: IGroupMail) {

    const {student, courseId, subcourseId, mailSubject, mailBody} = groupMailData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn("Group mail requested by student who is no instructor or not instructor-screened");
        return 403;
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId });

    if (course == undefined) {
        logger.warn("Tried to send group mail to invalid course");
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn("Tried to send group mail to invalid subcourse");
        return 404;
    }

    let authorized = false;
    for (let i = 0; i < course.instructors.length; i++) {
        if (student.id == course.instructors[i].id) {
            authorized = true;
            break;
        }
    }
    if (!authorized) {
        logger.warn("Tried to send group mail as user who is not instructor of this course");
        logger.debug(student);
        return 403;
    }

    try {
        for (let participant of subcourse.participants) {
            await sendInstructorGroupMail(participant, student, course, mailSubject, mailBody);
        }
    } catch (e) {
        logger.warn("Unable to send group mail");
        logger.debug(e);
        return 400;
    }

    return 204;
}

/**
 * @api {POST} /course/:id/subcourse/:subid/instructormail InstructorMail
 * @apiVersion 1.1.0
 * @apiDescription
 * Send an email to a course's instructors
 *
 * The subcourse's participants may use this endpoint to send an email to all instructors of that course
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName InstructorMail
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiUse PostInstructorMail
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/instructormail -d "<REQUEST"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

export async function instructorMail(instructormailData: IInstructormail) {

    const {pupil, courseId, subcourseId, mailSubject, mailBody}= instructormailData;

    if (!pupil.isParticipant || !pupil.active) {
        logger.warn("Instructor mail requested by pupil who is no participant or no longer active");
        return 403;
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId });

    if (course == undefined) {
        logger.warn("Tried to send instructor mail to invalid course");
        return 404;
    }

    if (!course.allowContact) {
        logger.warn("Tried to send mail to correspondent of a course where contact isn't permitted.");
        return 404;
    }

    if (!course.correspondent) {
        logger.error(`Tried to send mail to instructors of course (id: ${course.id}) where no correspondent was defined.`);
        return 500; //usually this should not happen – but if it happens, it will indicates some bug or someone who manually changed database entries...
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        logger.warn("Tried to send instructor mail to invalid subcourse");
        return 404;
    }


    try {
        // send mail to correspondnet
        await sendParticipantToInstructorMail(pupil, course.correspondent, course, mailSubject, mailBody);
    } catch (e) {
        logger.warn("Unable to send instructor mail");
        logger.debug(e);
        return 400;
    }

    return 204;
}

/**
 * @api {GET} /course/:id/subcourse/:subid/meeting/join JoinCourseMeetingHandler
 * @apiVersion 1.1.0
 * @apiDescription
 * Get the BBB-Meeting for a given subcourse
 *
 * This endpoint provides the BBB-Meeting of a subcourse.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName GetCourseMeeting
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse BBBMeetingReturn
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<ID>/meeting/join
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */

export async function joinCourseMeeting(joinCourseMeetingData: IJoincourseMeeting) {
    // Destructuring the data from the object
    const { user, courseId, subcourseId, ip} = joinCourseMeetingData;
    const meetingInDB: boolean = await isBBBMeetingInDB(subcourseId);
    let course: ApiCourse;
    let meeting: BBBMeeting;

    if (courseId != null && subcourseId != null) {
        let authenticatedStudent = false;
        let authenticatedPupil = false;
        if (user instanceof Student) {
            authenticatedStudent = true;
        }
        if (user instanceof Pupil) {
            authenticatedPupil = true;
        }
        try {

            if (authenticatedPupil || authenticatedStudent) {
                if (meetingInDB) {
                    meeting = await getBBBMeetingFromDB(subcourseId);
                } else {
                    // todo this should get its own method and not use a method from some other route
                    const courseObject: IGetCourse = {
                        student: authenticatedStudent ? (user instanceof Student) ? user : undefined : undefined,
                        pupil: authenticatedPupil ? (user instanceof Pupil) ? user : undefined : undefined,
                        courseId: Number.parseInt(courseId, 10)
                    };

                    let obj = await getCourse(courseObject);

                    if (typeof obj == 'number') {
                        return obj;
                    } else {
                        course = obj;
                        meeting = await createBBBMeeting(course.name, subcourseId, user);
                    }
                }

                if (!!meeting.alternativeUrl) {
                    return { url: meeting.alternativeUrl };

                } else if (authenticatedStudent) {
                    let userStudent: Student = (user instanceof Student) ? user : undefined;

                    await startBBBMeeting(meeting);

                    return {
                        url: getMeetingUrl(subcourseId, `${userStudent.firstname} ${userStudent.lastname}`, meeting.moderatorPW)
                    };

                } else if (authenticatedPupil) {
                    const meetingIsRunning: boolean = await isBBBMeetingRunning(subcourseId);
                    if (meetingIsRunning) {
                        let userPupil: Pupil = (user instanceof Pupil) ? user : undefined;
                        // BBB logging
                        await createOrUpdateCourseAttendanceLog(userPupil, ip, subcourseId);

                        return {
                            url: getMeetingUrl(subcourseId, `${userPupil.firstname} ${userPupil.lastname}`, meeting.attendeePW, user.wix_id)
                        };
                    } else {
                        logger.error("BBB-Meeting has not startet yet");
                        return 400;
                    }
                }

            } else {
                logger.warn("An unauthorized user wanted to join a BBB-Meeting");
                logger.debug(user);
                return 403;
            }

        } catch (e) {
            logger.error("An error occurred during GET /course/:id/subcourse/:subid/meeting/join: " + e.message);
            logger.debug(joinCourseMeetingData, e);
            return 500;
        }
    } else {
        logger.error("Expected courseId is not on route or subcourseId is not in request body");
        return 400;
    }
}

/**
 * @api {GET} /course/test/meeting/join TestJoinCourseMeetingHandler
 * @apiVersion 1.1.0
 * @apiDescription
 * Get a new empty BBB-Meeting for testing purposes.
 *
 * This endpoint will provide a url to join the BBB meeting with a randomly generated name (and if called with an auth token, that user's name will be taken)
 *
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/test/meeting/join
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function testJoinCourseMeeting(user: Student | Pupil | undefined) {

    const meeting: BBBMeeting = {
        id: -1, // default value, because of we're not creating a database instance of BBBMeeting (through typeorm) – IMPORTANT: this is not the meetingID!
        meetingID: `Test-${user?.wix_id ?? uuidv4()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        attendeePW: user?.wix_id.concat("ATTENDEE-PW") ?? uuidv4(),
        moderatorPW: user?.wix_id.concat("MODERATOR-PW") ?? uuidv4(),
        meetingName: "Test-Meeting",
        alternativeUrl: null
    };

    // start the meeting
    await startBBBMeeting(meeting);

    const userName = user?.fullName() ?? uniqueNamesGenerator({
        dictionaries: [NAME_GENERATOR_ADJECTIVES, NAME_GENERATOR_NAMES],
        separator: " ",
        length: 2,
        style: "capital"
    });

    const hasModeratorRights = user instanceof Student;
    const meetingPW = hasModeratorRights ? meeting.moderatorPW : meeting.attendeePW;

    // log that test meeting
    logger.info(`Test BBB meeting created for a user (${user?.wix_id ?? "unauthenticated"}, with${!hasModeratorRights ? "out": ""} moderator rights) called ${userName} with settings: ${JSON.stringify(meeting)}`);

    // get the meeting url
    const meetingURL = getMeetingUrl(meeting.meetingID, userName, meetingPW);

    // immediately redirect to the meeting
    return meetingURL;
}


export async function postAddCourseInstructor(postAddcourseData: IPostaddcourseInstructor): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    const { student, courseID, apiInstructorToAdd} = postAddcourseData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add an instructor to a course, but is no accepted instructor himself.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseID });
    if (course == undefined) {
        logger.warn(`User tried to add an instructor to non-existent course (ID ${courseID})`);
        logger.debug(student, apiInstructorToAdd);
        return 404;
    }

    let authorized = course.instructors.some(i => student.id === i.id);

    if (!authorized) {
        logger.warn(`User tried to add an instructor to a course, but has no access rights for that course (ID ${courseID})`);
        logger.debug(student, apiInstructorToAdd);
        return 403;
    }

    // Check validity of instructor that should be added
    let instructorToAdd = await entityManager.findOne(Student, {
        email: apiInstructorToAdd.email
    });

    if (!instructorToAdd) {
        logger.warn(`Cannot find a person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email}`);
        return 404;
    }

    if (!instructorToAdd.active) {
        logger.warn(`Person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not active. It cannot be added to a course!`);
        return 404;
    }

    if (!instructorToAdd.isInstructor) {
        logger.warn(`The person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not a course instructor. It cannot be added to a course!`);
        return 403;
    }

    if (await instructorToAdd.instructorScreeningStatus() !== ScreeningStatus.Accepted) {
        logger.warn(`The instructor (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not successfully screened as an instructor. S*he thus cannot be added to a course!`);
        return 403;
    }

    if (course.instructors.some(i => i.id === instructorToAdd.id)) {
        logger.warn(`The instructor with email address ${apiInstructorToAdd.email} is already an instructor of course number ${courseID}!`);
        return 409;
    }


    //add that instructor to the course (and all of it's subcourses)
    course.instructors.push(instructorToAdd);
    course.subcourses.forEach(sc => sc.instructors.push(instructorToAdd));

    try {
        for (const sc of course.subcourses) { //save subcourses
            await entityManager.save(sc);
        }

        await entityManager.save(course); //save course...

        // todo add transactionlog
        logger.info(`Successfully added instructor with email ${instructorToAdd.email} to course with id ${courseID} and all of it's subcourses`);

        return 200;
    } catch (e) {
        logger.error("Can't save the changes applied while adding an instructor to a course: " + e.message);
        logger.debug(course, e);
        return 500;
    }
}

export async function setCourseImage(imageData: IImageHandler): Promise<number | { imageURL?: string }> {
    const entityManager = getManager();
    //TODO: Implement transactionLog
    const { student, courseID, imageFile } = imageData;

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to change course image, but is no accepted instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseID });
    if (course == undefined) {
        logger.warn(`User tried to change course image of non existent course (ID ${courseID})`);
        logger.debug(student);
        return 404;
    }

    let authorized = course.instructors.some(i => student.id === i.id);

    if (!authorized) {
        logger.warn(`User tried to change course image, but has no access rights for that course (ID ${courseID})`);
        logger.debug(student);
        return 403;
    }


    try {
        if (imageFile) {
            // TODO: Check validity of image (i.e. a valid JPEG, and not just mime type or something like that)

            const fileExtension = mime.extension(imageFile.mimetype);

            if (!fileExtension) {
                logger.warn(`User tried to change course image for course with ID ${courseID}, but the provided file of wrong mime type`);
                return 400;
            }

            const key = courseImageKey(courseID, fileExtension);

            // TODO: resize images to provide different resolutions
            await putFile(imageFile.buffer, key);

            course.imageKey = key;
        } else if (course.imageKey) { //otherwise, there's nothing to delete
            //delete image if no image is given
            await deleteFile(course.imageKey);

            course.imageKey = null;
        }
    } catch (e) {
        logger.error(`Error while uploading/modifying image for course ${courseID}`, e);
        return 503;
    }

    try {
        await entityManager.save(course); //save course...

        // todo add transactionlog
        logger.info(`Successfully changed image of course with ID ${courseID}`);

        return { imageURL: course.imageURL() };
    } catch (e) {
        logger.error("Can't save changed image key to database: " + e.message);
        logger.debug(course, e);
        return 500;
    }
}

export async function inviteExternal(inviteeData: IInviteExternal): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    const { student, courseID, inviteeInfo} = inviteeData;
    // Check authorization
    if (!student.active || !student.isInstructor || await student.instructorScreeningStatus() !== ScreeningStatus.Accepted) {
        logger.warn(`Unauthorized student ${student.id} tried to invite external guest to course ${courseID}`);
        return 403;
    }

    // Check access rights of student to the course
    const course = await entityManager.findOne(Course, { id: courseID }, {
        relations: ["guests"]
    });
    if (course == undefined) {
        logger.warn(`Student ${student.id} tried to invite external guest to non-existent course (ID ${courseID})`);
        return 404;
    }

    let authorized = course.instructors.some(i => student.id === i.id);

    if (!authorized) {
        logger.warn(`Student ${student.id} tried to invite an external guest to a course, but has no access rights for that course (ID ${courseID})`);
        return 403;
    }

    if (course.courseState !== CourseState.ALLOWED) {
        logger.warn(`Student ${student.id} tried to invite an external guest to a course (ID ${courseID}) but that course is not yet allowed!`);
        return 403;
    }

    //check inviteeInfo
    const guestEmail = inviteeInfo.email.toLowerCase(); //always lower case...
    if (!isEmail(guestEmail)) {
        logger.warn(`Student ${student.id} tried to invite an external guest for course (ID ${courseID}), but the given email address is invalid`);
        return 400;
    }

    const currentGuests = course.guests;
    //make sure that at most 10 persons are invited per course
    if (currentGuests.length >= 10) {
        logger.warn(`Student ${student.id} tried to invite another external guest for course with ID ${courseID}, but that course already has 10 invited guests`);
        return 429; //indicate that no more guests could be invited
    }

    //check if person is already invited
    if (currentGuests.some(g => g.email === guestEmail)) {
        logger.warn(`Student ${student.id} tried to invite another external guest with email ${guestEmail} for course with ID ${courseID}, but that guest was already invited!`);
        return 409; //conflict
    }

    //create new guest instance
    const uniqueToken = await generateNewCourseGuestToken(entityManager); //unique one...
    const newGuest = new CourseGuest(guestEmail, inviteeInfo.firstname, inviteeInfo.lastname, course, student, uniqueToken);

    //save that new guest
    try {
        await entityManager.save(newGuest);

        //send the corresponding mail to the guest
        await sendGuestInvitationMail(newGuest);

        return 200;
    } catch (e) {
        logger.error(`An error occurred during invitation of guest ${guestEmail} for course ${courseID}: ${e}`);
        return 500;
    }
}

export async function joinCourseMeetingExternalGuest(token: string): Promise<number | ApiExternalGuestJoinMeetingResult> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    // Check token
    const guest = await entityManager.findOne(CourseGuest, {
        where: {
            token
        },
        relations: ["course"]
    });

    if (!guest) {
        logger.error(`Join course using token failed: Cannot find guest info corresponding to token '${token}'`);
        return 400;
    }

    const course = guest.course;

    //get the first subcourse of this course (because my code here has no special handling for the subcourses case -> not good, but quick and dirty since the entire courses code will entirely gets deleted in a few weeks...)
    const subcourse = course?.subcourses?.[0];

    if (!subcourse) {
        logger.error(`Cannot join meeting as guest ${guest.email} for course ${course?.id} since that course has no subcourses!`);
        return 500;
    }

    const subcourseIDString = ""+subcourse.id;
    //get the meeting for that subcourse
    const meeting = await getBBBMeetingFromDB(subcourseIDString);

    if (!meeting) {
        logger.error(`Cannot join meeting as guest ${guest.email} for course ${course.id} since there is no meeting started yet`);
        return 428; //use this to indicate the meeting hasn't started yet
    }

    //return alternative url if available and skip BBB related steps
    if (meeting.alternativeUrl) {
        return {
            url: meeting.alternativeUrl
        };
    }

    //check if the meeting is running
    const meetingIsRunning: boolean = await isBBBMeetingRunning(subcourseIDString);

    if (!meetingIsRunning) {
        logger.error(`Cannot join meeting as guest ${guest.email} for course ${course.id} since the meeting exists, but wasn't yet started by the instructor`);
        return 428; //use this to indicate the meeting hasn't started yet
    }

    //create the join url
    const joinURL = getMeetingUrl(meeting.meetingID, guest.fullName(), meeting.attendeePW, undefined); // no last parameter `userID` since guests should be "anonymous"

    return {
        url: joinURL
    };
}

export async function issueCourseCertificate(certificateData: IIssueCertificate) {

    const { student, courseId, subcourseId, receivers } = certificateData;
    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`User ${student.wix_id} cannot issue a course certificate for subcourse with ID ${subcourseId} since that student is no (successfully screened) instructor`);
        return 403;
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId }, {
        loadEagerRelations: false,
        relations: ["instructors"]
    });

    if (course == undefined) {
        logger.warn(`User ${student.wix_id} tried to issue course certificates for invalid course with ID ${courseId}`);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course }, {
        loadEagerRelations: false,
        relations: ["lectures"]
    });
    if (subcourse == undefined) {
        logger.warn(`User ${student.wix_id} tried to issue course certificate for invalid subcourse with ID ${subcourseId}.`);
        return 404;
    }

    let authorized = course.instructors.some(i => i.id === student.id);
    if (!authorized) {
        logger.warn(`User ${student.wix_id} tried to issue course certificate as user who is not instructor of course with ID ${course}`);
        logger.debug(student);
        return 403;
    }


    //check participants list
    if (receivers.length === 0) {
        logger.warn(`User ${student.wix_id} tried to issue course certificate for NO receivers at all. That is not possible.`);
        return 400;
    }
    if (receivers.some(r => typeof r !== "string")) {
        logger.warn(`User ${student.wix_id} tried to issue course certificate for receivers in array where not all elements are strings(receivers: ${JSON.stringify(receivers)})`);
        return 400;
    }
    const participants = await Promise.all(receivers.map(r => getPupilByWixID(entityManager, r)));

    const unknownParticipants = participants.filter(p => p == null);

    if (unknownParticipants.length > 0) {
        logger.warn(`User ${student.wix_id} tried to issue course certificate for at least one unknown receiver, which is not allowed (unknown receivers: ${JSON.stringify(unknownParticipants)})`);
        return 400;
    }


    //everything looks fine, so issue the certificates and send them via email.
    try {
        // get the transaction log
        const transactionLog = getTransactionLog();

        //compute course meta data
        const courseDuration = subcourse.totalDuration() / 60; //because we wanna have it in hours...

        for (let participant of participants) {
            //create course certificate buffer
            const certificateBuffer = await getCourseCertificate(
                student.wix_id,
                participant.wix_id,
                participant.fullName(),
                course.name,
                subcourse.lectures,
                courseDuration
            );

            //send mail to pupil
            await sendParticipantCourseCertificate(participant, course, certificateBuffer);

            //TRANSACTION LOG to know who got issued when a certificate by which instructor...
            await transactionLog.log(new InstructorIssuedCertificateEvent(student, participant, subcourse));

            //save certificate issuing to database
            const courseParticipationCertificate = new CourseParticipationCertificate(student, participant, subcourse);
            await entityManager.save(courseParticipationCertificate);
        }
    } catch (e) {
        logger.warn("Unable to issue course certificate");
        logger.debug(e);
        return 400;
    }

    return 204;
}