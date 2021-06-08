import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { getManager } from 'typeorm';
import { ScreeningStatus, Student } from '../../../common/entity/Student';
import { CourseParticipationCertificate } from '../../../common/entity/CourseParticipationCertificate';
import {
    ApiAddCourse,
    ApiAddLecture,
    ApiAddSubcourse,
    ApiCourse,
    ApiCourseTag,
    ApiEditCourse,
    ApiEditLecture,
    ApiEditSubcourse,
    ApiExternalGuestJoinMeetingResult,
    ApiInstructor,
    ApiInstructorID,
    ApiLecture,
    ApiPostExternalInvite,
    ApiSubcourse
} from './format';
import { Course, CourseCategory, CourseState } from '../../../common/entity/Course';
import { getTransactionLog } from '../../../common/transactionlog';
import CreateCourseEvent from '../../../common/transactionlog/types/CreateCourseEvent';
import CancelSubcourseEvent from '../../../common/transactionlog/types/CancelSubcourseEvent';
import CancelCourseEvent from '../../../common/transactionlog/types/CancelCourseEvent';
import { CourseTag } from '../../../common/entity/CourseTag';
import { Subcourse } from '../../../common/entity/Subcourse';
import { Lecture } from '../../../common/entity/Lecture';
import { getPupilByWixID, Pupil } from '../../../common/entity/Pupil';
import { sendSubcourseCancelNotifications, sendInstructorGroupMail, sendParticipantToInstructorMail, sendParticipantRegistrationConfirmationMail, sendGuestInvitationMail, sendParticipantCourseCertificate } from '../../../common/mails/courses';
import {
    createBBBMeeting,
    isBBBMeetingRunning,
    createOrUpdateCourseAttendanceLog,
    getBBBMeetingFromDB, isBBBMeetingInDB, getMeetingUrl, startBBBMeeting
} from '../../../common/util/bbb';
import { isJoinableCourse } from './utils';
import { BBBMeeting } from "../../../common/entity/BBBMeeting";
import * as moment from 'moment-timezone';
import { putFile } from '../../../common/file-bucket';
import { deleteFile } from '../../../common/file-bucket/delete';
import { courseImageKey } from './course-images';
import { accessURLForKey } from '../../../common/file-bucket/s3';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from "uuid";
import { uniqueNamesGenerator, adjectives as NAME_GENERATOR_ADJECTIVES, names as NAME_GENERATOR_NAMES } from 'unique-names-generator';
import ParticipantJoinedCourseEvent from '../../../common/transactionlog/types/ParticipantJoinedCourseEvent';
import ParticipantLeftCourseEvent from '../../../common/transactionlog/types/ParticipantLeftCourseEvent';
import ParticipantLeftWaitingListEvent from '../../../common/transactionlog/types/ParticipantLeftWaitingListEvent';
import ParticipantJoinedWaitingListEvent from '../../../common/transactionlog/types/ParticipantJoinedWaitingListEvent';
import AccessedCourseEvent from '../../../common/transactionlog/types/AccessedCourseEvent';
import { prisma } from '../../../common/prisma';
import { CourseCache } from './course-cache';
import isEmail from "validator/lib/isEmail";
import { CourseGuest, generateNewCourseGuestToken } from '../../../common/entity/CourseGuest';
import { getCourseCertificate } from '../../../common/courses/certificates';
import InstructorIssuedCertificateEvent from '../../../common/transactionlog/types/InstructorIssuedCertificateEvent';
import { addCleanupAction } from '../../../common/util/cleanup';
import { handleError, HTTPError } from '../error';
import * as Validation from "../validation";

const logger = getLogger();

/**
 * @api {GET} /courses GetCourses
 * @apiVersion 1.1.0
 * @apiDescription
 * Request a list of all available courses.
 *
 * <p>This endpoint can be called with authentication as well as without.
 * Authentication unlocks some additional fields and request parameters (see below).
 * The request has to specify if additional fields should be included.
 * Additionally some search parameters can be used to limit the result to matching courses.</p>
 *
 * @apiName GetCourses
 * @apiGroup Courses
 *
 * @apiUse OptionalAuthentication
 *
 * @apiParam (Query Parameter) {string} fields <em>(optional)</em> Comma seperated list of additionally requested fields (<code>id</code> will be always included). Example: <code>fields=name,outline,tags</code>. If you want optional marked fields of subobjects, you need to specify the subobject and the requested subobject properties. Example: <code>fields=subcourses,subcourses.maxParticipants,subcourses.participants</code>
 * @apiParam (Query Parameter) {string} states <em>(optional, Default: <code>allowed</code>) Comma seperated list of possible states of the course. Requires the <code>instructor</code> parameter to be set.
 * @apiParam (Query Parameter) {string} instructor <em>(optional)</em> Id of an instructor. Return only courses owned by this instructor. This parameter requires authentication as the specified instructor.
 * @apiParam (Query Parameter) {string} participant <em>(optional)</em> Id of a participant. Return only courses this participant has joined. This parameter requires authentication as the specified participant.
 * @apiParam (Query Parameter) {boolean} onlyJoinableCourses <em>(optional)</em> Default is true. If true, it will return only those courses that are still joinable (i.e. courses with outstanding lectures and late join allowed if course has started but not yet finished)
 *
 * @apiUse Courses
 * @apiUse Course
 * @apiUse Subcourse
 * @apiUse Lecture
 * @apiUse Instructor
 * @apiUse CourseTag
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET "https://api.corona-school.de/api/courses?fields=name,outline,category,startDate"
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCoursesHandler(req: Request, res: Response) {
    handleError(res, async () => {
        let authenticatedStudent = (res.locals.user instanceof Student);
        let authenticatedPupil = (res.locals.user instanceof Pupil);

        let fields = req.query.fields?.split(',') ?? [];
        let states = req.query.states?.split(',') ?? ['allowed'];
        let instructorId = req.query.instructor;
        const participantId = req.query.participant;
        const onlyJoinableCourses = (req.query.onlyJoinableCourses !== 'false');

        const courses = await getCourses(
            authenticatedStudent ? res.locals.user : undefined,
            authenticatedPupil ? res.locals.user : undefined,
            fields,
            states,
            instructorId,
            participantId,
            onlyJoinableCourses
        );
        res.json(courses);
    });
}

const CACHE_RELOAD_INTERVAL = 600000; // in milliseconds, i.e. every 10 minutes
let cache = new CourseCache<ApiCourse[]>(CACHE_RELOAD_INTERVAL, async (key) => {
    const fields: string[] = key.split(",");
    const result = await getAPICourses(undefined, undefined, fields, ['allowed'], undefined, undefined, false, false);

    if (typeof result === "number") { //it's so dirty...
        return null; //no refresh
    }

    return result;
});
addCleanupAction(() => cache.stopAutoReload()); //stop cache refresh on sigkill

async function getCourses(student: Student | undefined,
                          pupil: Pupil | undefined, fields: Array<string>,
                          states: Array<string>,
                          instructorId: string | undefined,
                          participantId: string | undefined,
                          onlyJoinableCourses: boolean): Promise<ApiCourse[] | never> {
    const authenticatedStudent = student instanceof Student;
    const authenticatedPupil = pupil instanceof Pupil;

    if (instructorId != undefined && !authenticatedStudent) {
        throw new HTTPError(401, `Unauthenticated user tried to access courses created by instructor (ID: ${instructorId})`);
    }

    if (participantId != undefined && !authenticatedPupil) {
        throw new HTTPError(401, `Unauthenticated user tried to access courses joined by pupil (ID: ${participantId})`);
    }

    if (instructorId != undefined && authenticatedStudent && student.wix_id != instructorId) {
        throw new HTTPError(403, `User (ID: ${student.wix_id}) tried to filter by instructor id ${instructorId}`);
    }

    if (participantId != undefined && authenticatedPupil && pupil.wix_id != participantId) {
        throw new HTTPError(403, `User (ID: ${pupil.wix_id}) tried to filter by participant id ${participantId}`);
    }


    if (states.length != 1 || states[0] != 'allowed') {
        if (!authenticatedStudent) {
            throw new HTTPError(401, `Unauthenticated user tried to filter by states ${states.join(',')}`);
        } else if (instructorId == undefined) {
            throw new HTTPError(403, `User (ID: ${student.wix_id}) tried to filter by states ${states.join(',')} without specifying an instructor id`);
        }
    }

    if (states.length == 0) {
        throw new HTTPError(400, "Request for /courses while filtering with states=(empty). This would never return any results");
    }

    let cachedCourses = undefined;
    if (!authenticatedPupil && !authenticatedStudent) {
        //we only wanna cache in those cases
        const cacheKey = `${fields.sort().join(",")}`;

        cachedCourses = cache.get(cacheKey);

        if (!cachedCourses) {
            //HIT: do request and cache
            cachedCourses = await getAPICourses(undefined, undefined, fields, states, instructorId, participantId, authenticatedStudent, authenticatedPupil);
            cache.set(cacheKey, cachedCourses);
        }
    }


    let apiCourses = cachedCourses ?? await getAPICourses(student, pupil, fields, states, instructorId, participantId, authenticatedStudent, authenticatedPupil);

    //filter out onlyJoinableCourses, if requested
    if (onlyJoinableCourses) {
        apiCourses = apiCourses.filter(isJoinableCourse);
    }

    return apiCourses;
}

async function getAPICourses(student: Student | undefined,
                             pupil: Pupil | undefined,
                             fields: Array<string>,
                             states: Array<string>,
                             instructorId: string | undefined,
                             participantId: string | undefined,
                             authenticatedStudent: boolean,
                             authenticatedPupil: boolean): Promise<Array<ApiCourse> | never> {
    let stateFilters = [];
    for (const inputState of states) {
        let state: CourseState;
        switch (inputState) {
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
                throw new HTTPError(400, "Unknown state: " + inputState);
        }
        stateFilters.push(state);
    }

    let apiCourses: Array<ApiCourse> = [];
    try {
        let customFilter = [];
        if (instructorId) {
            customFilter = [{
                subcourse: {
                    some: {
                        // eslint-disable-next-line
                        subcourse_instructors_student: {
                            some: {
                                student: {
                                    wix_id: student?.wix_id ?? "invalid"
                                }
                            }
                        }
                    }
                }
            }];
        }
        else if (participantId) {
            customFilter = [{
                subcourse: {
                    some: {
                        // eslint-disable-next-line
                        subcourse_participants_pupil: {
                            some: {
                                pupil: {
                                    wix_id: pupil?.wix_id ?? "invalid" //todo rewrite...
                                }
                            }
                        }
                    }
                }
            }];
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
                        course_tag: true
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


        for (const course of courses) {
            let apiCourse: ApiCourse = {
                id: course.id,
                publicRanking: course.publicRanking,
                allowContact: course.allowContact,
                correspondentID: instructorId != null && instructorId === student?.wix_id && course.student?.wix_id //only if this endpoint is accessed by a student who is also an instructor of that course, return the correspondentID
            };

            for (const field of fields) {
                switch (field.toLowerCase()) {
                    case 'id':
                        break;
                    case 'instructors':
                        apiCourse.instructors = [];
                        for (const instructor of course.course_instructors_student) {
                            let apiInstructor: ApiInstructor = {
                                firstname: instructor.student.firstname,
                                lastname: instructor.student.lastname
                            };
                            if (authenticatedStudent && student.wix_id != instructorId) {
                                apiInstructor.id = instructor.student.wix_id;
                            }
                            apiCourse.instructors.push(apiInstructor);
                        }
                        break;
                    case 'name':
                        apiCourse.name = course.name;
                        break;
                    case 'outline':
                        apiCourse.outline = course.outline;
                        break;
                    case 'description':
                        apiCourse.description = course.description;
                        break;
                    case 'image':
                        apiCourse.image = course.imageKey ? accessURLForKey(course.imageKey) : null;
                        break;
                    case 'category':
                        apiCourse.category = course.category;
                        break;
                    case 'tags':
                        apiCourse.tags = [];
                        for (const tag of course.course_tags_course_tag) {
                            let apiTag: ApiCourseTag = {
                                id: tag.course_tag.identifier,
                                name: tag.course_tag.name,
                                category: tag.course_tag.category
                            };
                            apiCourse.tags.push(apiTag);
                        }
                        break;
                    case 'subcourses':
                        apiCourse.subcourses = [];
                        if (course.subcourse) {
                            for (const subcourse of course.subcourse) {
                                let apiSubcourse: ApiSubcourse = {
                                    id: subcourse.id,
                                    minGrade: subcourse.minGrade,
                                    maxGrade: subcourse.maxGrade,
                                    maxParticipants: subcourse.maxParticipants,
                                    participants: subcourse.subcourse_participants_pupil.length,
                                    instructors: [],
                                    lectures: [],
                                    joinAfterStart: subcourse.joinAfterStart
                                };
                                for (const subcourseInstructor of subcourse.subcourse_instructors_student) {
                                    const apiSubcourseInstructor: ApiInstructor = {
                                        firstname: subcourseInstructor.student.firstname,
                                        lastname: subcourseInstructor.student.lastname
                                    };
                                    if (authenticatedStudent && student.wix_id == instructorId) {
                                        apiSubcourseInstructor.id = subcourseInstructor.student.wix_id;
                                    }
                                    apiSubcourse.instructors.push(apiSubcourseInstructor);
                                }
                                for (const lecture of subcourse.lecture) {
                                    let apiLecture: ApiLecture = {
                                        id: lecture.id,
                                        instructor: {
                                            firstname: lecture.student.firstname,
                                            lastname: lecture.student.lastname
                                        },
                                        start: lecture.start.getTime() / 1000, //see https://github.com/prisma/prisma/issues/5051 -> if your local time (and thus the time of your timestamps in your database) is not UTC, then this endpoint will return the wrong result
                                        duration: lecture.duration
                                    };
                                    if (authenticatedStudent && student.wix_id == instructorId) {
                                        apiLecture.instructor.id = lecture.student.wix_id;
                                    }
                                    apiSubcourse.lectures.push(apiLecture);
                                }
                                if (authenticatedStudent && student.wix_id == instructorId) {
                                    apiSubcourse.participantList = [];
                                    for (const { pupil } of subcourse.subcourse_participants_pupil) {
                                        apiSubcourse.participantList.push({
                                            uuid: pupil.wix_id,
                                            firstname: pupil.firstname,
                                            lastname: pupil.lastname,
                                            email: pupil.email,
                                            grade: parseInt(pupil.grade),
                                            schooltype: pupil.schooltype
                                        });
                                    }
                                }
                                if (authenticatedPupil && pupil.wix_id == participantId) {
                                    apiSubcourse.onWaitingList = subcourse.subcourse_waiting_list_pupil.some(wlp => wlp.pupilId === pupil.id);
                                    apiSubcourse.joined = subcourse.subcourse_participants_pupil.some((it) => it.pupil.wix_id === pupil.wix_id);
                                }
                                apiCourse.subcourses.push(apiSubcourse);
                            }
                        }
                        break;
                    case 'state':
                        apiCourse.state = course.courseState;
                        break;
                }
            }
            apiCourses.push(apiCourse);
        }

        return apiCourses;
    } catch (error) {
        throw new HTTPError(500, "Can't fetch courses", error);
    }

}


/**
 * @api {GET} /course/:id GetCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Get details about an existing course
 *
 * This endpoint allows getting details about a course.
 * The available fields depend on whether this request is authenticated and whether the user is the instructor of the course
 *
 * @apiName GetCourse
 * @apiGroup Courses
 *
 * @apiUse OptionalAuthentication
 *
 * @apiUse Course
 * @apiUse Subcourse
 * @apiUse Lecture
 * @apiUse Instructor
 * @apiUse CourseTag
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        if (!req.params.id) {
            throw new HTTPError(400, "Expected id parameter on route");
        }

        const course = await getCourse(
            res.locals.user instanceof Student ? res.locals.user : undefined,
            res.locals.user instanceof Pupil ? res.locals.user : undefined,
            Number.parseInt(req.params.id, 10)
        );

        res.json(course);
    });
}

async function getCourse(student: Student | undefined, pupil: Pupil | undefined, courseId: number): Promise<ApiCourse> {
    const entityManager = getManager();

    let authenticatedStudent = student instanceof Student;
    let authenticatedPupil = pupil instanceof Pupil;

    try {
        const course = await entityManager.findOne(Course, { id: courseId });

        let isInstructor = course.instructors.some(it => it.id === student.id);

        if (!isInstructor && course.courseState != CourseState.ALLOWED) {
            throw new HTTPError(403, "Unauthorized user tried to access course of state " + course.courseState);
        }

        if (authenticatedStudent || authenticatedPupil) {
            // transactionlog, that user accessed course
            const transactionLog = getTransactionLog();
            await transactionLog.log(new AccessedCourseEvent(pupil ?? student, course));
        }

        const apiCourse: ApiCourse = {
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

        if (isInstructor) {
            apiCourse.state = course.courseState;
            apiCourse.correspondentID = course.correspondent?.wix_id; //only add the correspondent ID when students are requesting the course...
        }

        for (const instructor of course.instructors) {
            if (isInstructor) {
                apiCourse.instructors.push({
                    id: instructor.wix_id,
                    firstname: instructor.firstname,
                    lastname: instructor.lastname
                });
            } else {
                apiCourse.instructors.push({
                    firstname: instructor.firstname,
                    lastname: instructor.lastname
                });
            }
        }

        apiCourse.tags = course.tags.map(({ identifier, name, category }) => ({ id: identifier, name, category }));

        for (const subcourse of course.subcourses) {
            // Skip not published subcourses for unauthorized users
            if (!isInstructor && !subcourse.published) continue;

            const apiSubcourse: ApiSubcourse = {
                id: subcourse.id,
                instructors: [],
                minGrade: subcourse.minGrade,
                maxGrade: subcourse.maxGrade,
                maxParticipants: subcourse.maxParticipants,
                participants: subcourse.participants.length,
                lectures: [],
                joinAfterStart: subcourse.joinAfterStart,
                cancelled: subcourse.cancelled
            };

            if (isInstructor) {
                apiSubcourse.published = subcourse.published;
            }

            for (const instructor of subcourse.instructors) {
                if (isInstructor) {
                    apiSubcourse.instructors.push({
                        id: instructor.wix_id,
                        firstname: instructor.firstname,
                        lastname: instructor.lastname
                    });
                } else {
                    apiSubcourse.instructors.push({
                        firstname: instructor.firstname,
                        lastname: instructor.lastname
                    });
                }
            }
            for (const lecture of subcourse.lectures) {
                let apiLecture: ApiLecture = {
                    id: lecture.id,
                    instructor: {
                        firstname: lecture.instructor.firstname,
                        lastname: lecture.instructor.lastname
                    },
                    start: lecture.start.getTime() / 1000,
                    duration: lecture.duration
                };
                if (isInstructor) {
                    apiLecture.instructor.id = lecture.instructor.wix_id;
                }
                apiSubcourse.lectures.push(apiLecture);
            }

            if (isInstructor) {
                apiSubcourse.participantList = [];
                for (const participant of subcourse.participants) {
                    apiSubcourse.participantList.push({
                        uuid: participant.wix_id,
                        firstname: participant.firstname,
                        lastname: participant.lastname,
                        email: participant.email,
                        grade: parseInt(participant.grade),
                        schooltype: participant.schooltype
                    });
                }
            }

            if (authenticatedPupil) {
                apiSubcourse.onWaitingList = subcourse.isPupilOnWaitingList(pupil);
                apiSubcourse.joined = subcourse.participants.some(it => it.id === pupil.id);
            }
            apiCourse.subcourses.push(apiSubcourse);
        }

        return apiCourse;
    } catch (error) {
        throw new HTTPError(500, "Can't fetch courses", error);
    }
}

/**
 * @api {POST} /course AddCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Add a new course.
 *
 * This endpoint allows adding a new course.
 * If successful the ID of the newly created course will be returned.
 *
 * @apiName AddCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PostCourse
 * @apiUse PostCourseReturn
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course -d "<REQUEST>"
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postCourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);

        Validation.hasBody(req, { instructors: "string[]", name: "string", outline: "string", description: "string", category: "string", tags: "string[]", submit: "boolean", allowContact: "boolean", correspondentID: "boolean?" });

        const course = await postCourse(res.locals.user, req.body);
        res.json(course);
    });
}

async function postCourse(student: Student, apiCourse: ApiAddCourse): Promise<ApiCourse | never> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    await Validation.isAcceptedInstructor(student);

    // Some checks
    if (apiCourse.instructors.indexOf(student.wix_id) < 0) {
        throw new HTTPError(400, `Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(', ')}`);
    }

    const instructorFilters = apiCourse.instructors.map(it => ({ wix_id: it }));

    const instructors = await entityManager.find(Student, { where: instructorFilters });

    if (instructors.length != apiCourse.instructors.length) {
        throw new HTTPError(400, `Field 'instructors' contains invalid values: ${apiCourse.instructors.join(', ')}`);
    }

    Validation.hasLength(apiCourse, "name", 1, 200);
    Validation.hasLength(apiCourse, "outline", 1, 200);
    Validation.hasLength(apiCourse, "description", 1, 3000);

    let category: CourseCategory;
    switch (apiCourse.category) {
        case "revision":
            category = CourseCategory.REVISION;
            break;
        case "club":
            category = CourseCategory.CLUB;
            break;
        case "coaching":
            category = CourseCategory.COACHING;
            break;
        default:
            throw new HTTPError(400, `Invalid course category: ${apiCourse.category}`);
    }

    const courseTagFilters = apiCourse.tags.map(it => ({ identifier: it }));
    let tags: CourseTag[] = [];

    if (courseTagFilters.length > 0) {
        tags = await entityManager.find(CourseTag, { where: courseTagFilters });
        if (tags.length != apiCourse.tags.length) {
            throw new HTTPError(400, `Field 'tags' contains invalid values: ${apiCourse.tags.join(', ')}`);
        }
    }

    if (apiCourse.allowContact === true && typeof apiCourse.correspondentID !== "string") {
        throw new HTTPError(400, `Cannot allow contact for new course '${apiCourse.name}' without having provided a correspondentID!`);
    }

    const correspondent = instructors.find(i => i.wix_id === apiCourse.correspondentID);
    if (apiCourse.correspondentID != null && !correspondent) {
        throw new HTTPError(400, `Cannot use correspondentID '${apiCourse.correspondentID}' for new course '${apiCourse.name}' because there is no user with such an ID who is part of the course's instructors.`);
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
    course.courseState = apiCourse.submit ? CourseState.SUBMITTED : CourseState.CREATED;
    course.allowContact = apiCourse.allowContact;
    course.correspondent = correspondent;

    try {
        await entityManager.save(Course, course);
        await transactionLog.log(new CreateCourseEvent(student, course));
        logger.info("Successfully saved new course");

        return {
            id: course.id,
            publicRanking: course.publicRanking,
            allowContact: course.allowContact
        };
    } catch (error) {
        throw new HTTPError(500, "Can't save new course", error);
    }
}

/**
 * @api {POST} /course/:id/subcourse AddSubcourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Add a new subcourse under an existing course
 *
 * This endpoint allows adding a new subcourse.
 * If successful the ID of the newly created subcourse will be returned.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName AddSubcourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PostSubcourse
 * @apiUse PostSubcourseReturn
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course/<ID>/subcourse -d "<REQUEST>"
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postSubcourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);

        Validation.hasParams(req, "id");
        Validation.hasBody(req, { instructors: "string[]", minGrade: "number", maxGrade: "number", maxParticipants: "number?", joinAfterStart: "boolean", published: "boolean" });

        const subcourse = await postSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), req.body);
        res.json(subcourse);
    });
}

async function postSubcourse(student: Student, courseId: number, apiSubcourse: ApiAddSubcourse): Promise<ApiSubcourse | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to add subcourse to non existent course (ID ${courseId})`);
    }

    Validation.isInstructorOf(student, course);

    const instructorFilters = apiSubcourse.instructors.map(it => ({ wix_id: it }));

    const instructors = await entityManager.find(Student, { where: instructorFilters });

    if (instructors.length == 0 || instructors.length != apiSubcourse.instructors.length) {
        throw new HTTPError(400, `Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(', ')}`);
    }

    Validation.isInIntegerRange(apiSubcourse, "minGrade", 1, 13);
    Validation.isInIntegerRange(apiSubcourse, "maxGrade", 1, 13);

    if (apiSubcourse.maxGrade < apiSubcourse.minGrade) {
        throw new HTTPError(400, `Field 'maxGrade' is smaller than field 'minGrade': ${apiSubcourse.maxGrade} < ${apiSubcourse.minGrade}`);
    }

    if (apiSubcourse.maxParticipants == undefined) apiSubcourse.maxParticipants = 30;
    Validation.isInIntegerRange(apiSubcourse, "maxParticipants", 3, 100);

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
        logger.info("Successfully saved new subcourse");

        return {
            id: subcourse.id
        };
    } catch (error) {
        throw new HTTPError(500, "Can't save new subcourse", error);
    }
}

/**
 * @api {POST} /course/:id/subcourse/:subid/lecture AddLecture
 * @apiVersion 1.1.0
 * @apiDescription
 * Add a new lecture under an existing subcourse
 *
 * This endpoint allows adding a new lecture.
 * If successful the ID of the newly created lecture will be returned.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName AddLecture
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PostLecture
 * @apiUse PostLectureReturn
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/lecture -d "<REQUEST>"
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postLectureHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);

        Validation.hasParams(req, "id", "subid");
        Validation.hasBody(req, { instructor: "string", start: "number", duration: "number" });

        const lecture = await postLecture(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body);
        res.json(lecture);
    });
}

async function postLecture(student: Student, courseId: number, subcourseId: number, apiLecture: ApiAddLecture): Promise<{ id: number } | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to add lecture to non-existent course (ID ${courseId})`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, `User tried to add lecture to non-existent subcourse (ID ${subcourseId})`);
    }

    Validation.isInstructorOf(student, course);

    // Check validity of fields
    let instructor: Student = subcourse.instructors.find(it => it.wix_id === apiLecture.instructor);

    if (instructor == undefined) {
        throw new HTTPError(400, `Field 'instructor' contains an illegal value: ${apiLecture.instructor}`);
    }

    // You can only create lectures that start at least in 2 days (but don't respect the time while doing this check) – but this restriction does not apply if the course is already submitted
    if (!Number.isInteger(apiLecture.start) || (course.courseState !== CourseState.CREATED && moment.unix(apiLecture.start).isBefore(moment())) || (course.courseState === CourseState.CREATED && moment.unix(apiLecture.start).isBefore(moment().add(7, "days").startOf("day")))) {
        throw new HTTPError(400, `Field 'start' contains an illegal value: ${apiLecture.start}`);
    }

    Validation.isInIntegerRange(apiLecture, "duration", 15, 480);

    const lecture = new Lecture();
    lecture.instructor = instructor;
    lecture.subcourse = subcourse;
    lecture.start = new Date(apiLecture.start * 1000);
    lecture.duration = apiLecture.duration;

    try {
        await entityManager.save(Lecture, lecture);
        // todo add transactionlog
        logger.info("Successfully saved new lecture");

        return {
            id: lecture.id
        };
    } catch (error) {
        throw new HTTPError(500, "Can't save new lecture", error);
    }
}

/**
 * @api {PUT} /course/:id EditCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Edit a course.
 *
 * This endpoint allows editing an existing course.
 * Only an instructor is allowed to edit his own courses.
 * There are some constraints on the editability of fields, especially when submitted.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName EditCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PutCourse
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course/<ID> -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function putCourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);

        Validation.hasParams(req, "id");
        Validation.hasBody(req, { instructors: "string[]", description: "string", allowedContact: "boolean", name: "string?", outline: "string?", correspondentID: "string?", tags: "string[]" });
        if (
            (req.body.outline !== undefined && typeof req.body.category !== 'string') ||
            (req.body.outline !== undefined && typeof req.body.submit !== 'boolean')) {
            throw new HTTPError(400, "Invalid request for PUT /course");
        }

        await putCourse(res.locals.user, Number.parseInt(req.params.id, 10), req.body);

        res.status(204).send("Created course");
    });
}

async function putCourse(student: Student, courseId: number, apiCourse: ApiEditCourse): Promise<void | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to edit non-existent course (ID ${courseId})`);
    }

    Validation.isInstructorOf(student, course);

    // Validate input
    if (!apiCourse.instructors.includes(student.wix_id)) {
        throw new HTTPError(400, `Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(', ')}`);
    }

    const studentFilters = apiCourse.instructors.map(it => ({ wix_id: it }));
    const instructors = await entityManager.find(Student, { where: studentFilters });

    if (instructors.length != apiCourse.instructors.length) {
        throw new HTTPError(400, `Field 'instructors' contains invalid values: ${apiCourse.instructors.join(', ')}`);
    }

    course.instructors = instructors;

    if (apiCourse.name != undefined) {
        Validation.hasLength(apiCourse, "name", 1, 200);
        course.name = apiCourse.name;
    }

    if (apiCourse.outline != undefined) {
        Validation.hasLength(apiCourse, "outline", 1, 200);
        course.outline = apiCourse.outline;
    }

    Validation.hasLength(apiCourse, "description", 1, 3000);

    course.description = apiCourse.description;

    if (apiCourse.allowContact === true && typeof apiCourse.correspondentID !== "string") {
        throw new HTTPError(400, `Cannot allow contact for course ${course.id} without having provided a correspondentID!`);
    }
    course.allowContact = apiCourse.allowContact;

    //check correspondent ID
    const correspondent = course.instructors.find(i => i.wix_id === apiCourse.correspondentID);
    if (apiCourse.correspondentID != null && !correspondent) {
        throw new HTTPError(400, `Cannot use correspondentID '${apiCourse.correspondentID}' for course ${course.id} because there is no user with such an ID who is part of the course's instructors.`);
    }

    course.correspondent = correspondent;

    if (apiCourse.category != undefined) {
        let category: CourseCategory;
        switch (apiCourse.category) {
            case "revision":
                category = CourseCategory.REVISION;
                break;
            case "club":
                category = CourseCategory.CLUB;
                break;
            case "coaching":
                category = CourseCategory.COACHING;
                break;
            default:
                throw new HTTPError(400, `Invalid course category: ${apiCourse.category}`);
        }

        course.category = category;
    }

    const filters = apiCourse.tags.map(it => ({ identifier: it }));

    let tags: CourseTag[] = [];
    if (filters.length > 0) {
        tags = await entityManager.find(CourseTag, { where: filters });
        if (tags.length != apiCourse.tags.length) {
            throw new HTTPError(400, `Field 'tags' contains invalid values: ${apiCourse.tags.join(', ')}`);
        }
    }
    course.tags = tags;

    //if course is already reviewed (i.e. either allowed, denied or cancelled) or submitted, the course state should not change at all
    if (course.courseState === CourseState.CREATED && apiCourse.submit != undefined) { //so only if course is created, it could be possible to change the course state to submitted
        course.courseState = apiCourse.submit ? CourseState.SUBMITTED : CourseState.CREATED;
    }

    else if (apiCourse.submit === false) {
        throw new HTTPError(403, `Field 'submit' is not editable on submitted courses`);
    } else if (apiCourse.submit != undefined) { //only change the course state, if the submit value is part of the request
        //just issue a warning message...
        logger.warn(`Course submission state for course number ${course.id} will not be changed, since it was already reviewed`);
    }


    try {
        await entityManager.save(Course, course);
        // todo add transaction log
        logger.info("Successfully edited course");
    } catch (error) {
        throw new HTTPError(500, "Can't edit course", error);
    }
}

/**
 * @api {PUT} /course/:id/subcourse/:subid EditSubcourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Edit a subcourse.
 *
 * This endpoint allows editing an existing subcourse.
 * A subcourse can only be editable by owners of the main course.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName EditSubcourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse PutSubcourse
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID> -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function putSubcourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid");
        Validation.hasBody(req, { instructors: "string[]", minGrade: "number", maxGrade: "number", maxParticipants: "number", published: "boolean", joinAfterStart: "boolean" });

        await putSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body);
        res.status(204).send("Updates Subcourse");
    });
}

async function putSubcourse(student: Student, courseId: number, subcourseId: number, apiSubcourse: ApiEditSubcourse): Promise<void | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to edit subcourse of non existent course (ID ${courseId})`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, `User tried to edit non-existent subcourse (ID ${subcourseId})`);
    }

    Validation.isInstructorOf(student, course);

    // Check validity of fields
    let filters = apiSubcourse.instructors.map(it => ({ wix_id: it }));
    const instructors = await entityManager.find(Student, { where: filters });

    if (instructors.length == 0 || instructors.length != apiSubcourse.instructors.length) {
        throw new HTTPError(400, `Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(', ')}`);
    }
    subcourse.instructors = instructors;

    Validation.isInIntegerRange(apiSubcourse, "minGrade", 1, 13);
    Validation.isInIntegerRange(apiSubcourse, "maxGrade", 1, 13);

    if (apiSubcourse.maxGrade < apiSubcourse.minGrade) {
        throw new HTTPError(400, `Field 'maxGrade' is smaller than field 'minGrade': ${apiSubcourse.maxGrade} < ${apiSubcourse.minGrade}`);
    }

    subcourse.minGrade = apiSubcourse.minGrade;
    subcourse.maxGrade = apiSubcourse.maxGrade;

    Validation.isInIntegerRange(apiSubcourse, "maxParticipants", 3, 100);

    subcourse.maxParticipants = apiSubcourse.maxParticipants;

    if (subcourse.published && !apiSubcourse.published) {
        throw new HTTPError(400, "Can't unpublish subcourse");
    }

    subcourse.published = apiSubcourse.published;

    subcourse.joinAfterStart = apiSubcourse.joinAfterStart;

    try {
        await entityManager.save(Subcourse, subcourse);
        // todo add transactionlog
        logger.info("Successfully edited subcourse");
    } catch (error) {
        throw new HTTPError(500, "Can't save new subcourse", error);
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
export async function putLectureHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);

        Validation.hasParams(req, "id", "subid", "lecid");
        const { id, subid, lecid } = req.params;

        Validation.hasBody(req, { instructor: "string", start: "number", duration: "number" });

        await putLecture(res.locals.user, Number.parseInt(id, 10), Number.parseInt(subid, 10), Number.parseInt(lecid, 10), req.body);
    });
}

async function putLecture(student: Student, courseId: number, subcourseId: number, lectureId: number, apiLecture: ApiEditLecture): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to edit lecture of non-existent course (ID ${courseId})`);
    }

    Validation.isInstructorOf(student, course);

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
export async function deleteCourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id");
        await deleteCourse(res.locals.user, Number.parseInt(req.params.id, 10));

        res.status(204).send("Course deleted successfully");
    });
}

async function deleteCourse(student: Student, courseId: number): Promise<void | never> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    await Validation.isAcceptedInstructor(student);

    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to cancel non-existent course (ID ${courseId})`);
    }

    Validation.isInstructorOf(student, course);

    if (course.courseState === CourseState.CANCELLED) {
        throw new HTTPError(403, `User tried to delete course repeatedly (ID ${courseId})`);
    }
    // We have a non-mitigated race condition here: Someone could post a new subcourse into the course, while the course gets cancelled
    try {
        // Run in transaction, so we may not have a mixed state, where some subcourses are cancelled, but others are not
        await entityManager.transaction(async em => {

            for (const subcourse of course.subcourses) {
                if (!subcourse.cancelled) {
                    subcourse.cancelled = true;
                    await em.save(Subcourse, subcourse);
                    sendSubcourseCancelNotifications(course, subcourse);
                }
            }

            course.courseState = CourseState.CANCELLED;
            await em.save(Course, course);

        });

        transactionLog.log(new CancelCourseEvent(student, course));
        logger.info("Successfully cancelled course");
    } catch (error) {
        throw new HTTPError(500, "Can't cancel course", error);
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
export async function deleteSubcourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid");

        await deleteSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10));
        res.status(204).send("Deleted subcourse sucessfully");
    });
}

async function deleteSubcourse(student: Student, courseId: number, subcourseId: number): Promise<void | never> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    await Validation.isAcceptedInstructor(student);

    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to cancel subcourse of non existent course (ID ${courseId})`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, `User tried to cancel non-existent subcourse (ID ${subcourseId})`);
    }

    Validation.isInstructorOf(student, course);

    if (subcourse.cancelled) {
        throw new HTTPError(403, `User tried to cancel subcourse repeatedly (ID ${subcourseId})`);
    }

    subcourse.cancelled = true;


    try {
        await entityManager.save(Subcourse, subcourse);
        await sendSubcourseCancelNotifications(course, subcourse);
        await transactionLog.log(new CancelSubcourseEvent(student, subcourse));
        logger.info("Successfully cancelled subcourse");
    } catch (error) {
        throw new HTTPError(500, "Can't cancel subcourse", error);
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
export async function deleteLectureHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid", "lecid");

        await deleteLecture(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), Number.parseInt(req.params.lecid, 10));

        res.status(204).send("Lecture deleted successfully");
    });
}

async function deleteLecture(student: Student, courseId: number, subcourseId: number, lectureId: number): Promise<void | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseId });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to delete a lecture of non-existent course (ID ${courseId})`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, `User tried to delete a lecture of non-existent subcourse (ID ${subcourseId})`);
    }

    const lecture = await entityManager.findOne(Lecture, { id: lectureId, subcourse: subcourse });
    if (lecture == undefined) {
        throw new HTTPError(404, `User tried to delete non-existent lecture (ID ${subcourseId})`);
    }

    Validation.isInstructorOf(student, course);

    if (lecture.start.getTime() < (new Date()).getTime()) {
        throw new HTTPError(403, `User tried to delete lecture from the past (ID ${courseId})`);
    }

    try {
        await entityManager.remove(Lecture, lecture);
        // todo add transactionlog
        logger.info("Successfully deleted lecture");
    } catch (error) {
        throw new HTTPError(500, "Can't delete lecture", error);
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
export async function joinSubcourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid", "userid");

        await joinSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);

    });
}

async function joinSubcourse(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<void | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    if (!pupil.isParticipant || pupil.wix_id != userId) {
        throw new HTTPError(403, "Unauthorized pupil tried to join course");
    }

    // TODO: This looks highly inefficient for something that will probably be run very often
    // Maybe  we can use application side locking instead?
    await entityManager.transaction(async em => {

        const course = await em.findOneOrFail(Course, { id: courseId, courseState: CourseState.ALLOWED });
        const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course, published: true });

        // Check if course is full
        if (subcourse.maxParticipants <= subcourse.participants.length) {
            throw new HTTPError(409, "Pupil can't join subcourse, because it is already full");
        }

        // Check if course has already started
        let startDate = (new Date()).getTime() + 3600000;
        for (const lecture of subcourse.lectures) {
            if (startDate > lecture.start.getTime())
                startDate = lecture.start.getTime();
        }
        if (startDate < (new Date()).getTime() && !subcourse.joinAfterStart) {
            throw new HTTPError(409, "Pupil can't join subcourse, because it has already started");
        }

        //check if pupil has less than 3 active courses (because a pupil is allowed to only have 3 active courses at a time)
        const pupilWithSubcourses = await em.findOne(Pupil, { //quick and dirty solution without rewriting large parts of the code -> refetch from database including the subcourses...
            where: {
                wix_id: pupil.wix_id
            },
            relations: ["subcourses"]
        });
        const numberOfActiveSubcourses = pupilWithSubcourses.subcourses?.filter(s => s.isActiveSubcourse()).length;
        if (numberOfActiveSubcourses >= 6) { //todo: don't hardcode this constant here...
            throw new HTTPError(429, `Pupil with id ${pupil.id} can't join subcourse, because she already has ${numberOfActiveSubcourses} active courses`);
        }

        try {
            //remove participant from waiting list, if he is on the waiting list
            subcourse.removePupilFromWaitingList(pupil);

            subcourse.participants.push(pupil);
            await em.save(Subcourse, subcourse);

            logger.info("Pupil successfully joined subcourse");

        } catch (error) {
            throw new HTTPError(400, "Can't join subcourse", error);
        }

        //send confirmation to participant
        /* no await */ sendParticipantRegistrationConfirmationMail(pupil, course, subcourse).catch(error => {
            logger.warn(`Will not send participant confirmation mail for subcourse with ID ${subcourse.id} due to error ${error.toString()}. However the participant ${pupil.id} has still been enrolled in the course.`);
        });

        // transactionlog
        const transactionLog = getTransactionLog();
        await transactionLog.log(new ParticipantJoinedCourseEvent(pupil, subcourse));
    });
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
export async function joinWaitingListHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isPupil(res);
        Validation.hasParams(req, "id", "subid", "userid");

        await joinWaitingList(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);
        res.status(202).send("Sucessfully joined waiting list");
    });
}

async function joinWaitingList(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<void> {
    const entityManager = getManager();

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        throw new HTTPError(403, "Unauthorized pupil tried to join course waiting list");
    }

    await entityManager.transaction(async em => {

        const course = await em.findOneOrFail(Course, { id: courseId, courseState: CourseState.ALLOWED });
        const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course, published: true });

        // make sure course not already started
        const firstLecture = subcourse.firstLecture();

        if (firstLecture && moment(firstLecture.start).isBefore(moment()) && !course.subcourses[0].joinAfterStart) {
            //cannot queue on waiting list, because late join is not allowed
            throw new HTTPError(409, `Pupil ${pupil.id} cannot join waiting list of subcourse ${subcourseId}, because the course already started and late joins are not permitted.`);
        }

        // Check if course is full
        if (subcourse.maxParticipants > subcourse.participants.length) {
            throw new HTTPError(409, `Pupil  ${pupil.id} can't join waiting list of subcourse ${subcourseId}, because the course is not full.`);
        }

        //check if pupil is already on the waiting list
        if (subcourse.isPupilOnWaitingList(pupil)) {
            throw new HTTPError(409, `Pupil ${pupil.id} cannot join waiting list of subcourse ${subcourseId}, because he's already on the waiting list`);
        }

        //add pupil to the waiting list
        subcourse.addPupilToWaitingList(pupil);

        try {
            await em.save(Subcourse, subcourse);
            logger.info(`Pupil ${pupil.id} successfully joined waiting list of subcourse ${subcourseId}`);
        } catch (error) {
            throw new HTTPError(500, "Can't join waitinglist of subcourse", error);
        }

        // transactionlog (remove this, if there is a performance problem with joining the waiting list -> because this introduces some performance problems!)
        const transactionLog = getTransactionLog();
        await transactionLog.log(new ParticipantJoinedWaitingListEvent(pupil, course));

    });
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
export async function leaveSubcourseHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isPupil(res);
        Validation.hasParams(req, "id", "subid", "userid");

        await leaveSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);
        res.status(204).send("Successfully left subcourse");
    });
}

async function leaveSubcourse(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        throw new HTTPError(403, "Unauthorized pupil tried to leave course");
    }

    await entityManager.transaction(async em => {
        // Note: The transaction here is important, since concurrent accesses to subcourse.participants are not safe

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
            throw new HTTPError(400, "Pupil tried to leave subcourse he didn't join");
        }

        subcourse.participants.splice(index, 1);

        try {
            await em.save(Subcourse, subcourse);

            logger.info("Pupil successfully left subcourse");

            // transactionlog
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantLeftCourseEvent(pupil, subcourse));

        } catch (error) {
            throw new HTTPError(500, "Can't leave subcourse", error);
        }
    });
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
export async function leaveWaitingListHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isPupil(res);
        Validation.hasParams(req, "id", "subid", "userid");

        await leaveWaitingList(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);
        res.status(204).send("Successfully left mailinglist");
    });
}

async function leaveWaitingList(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<void | never> {
    const entityManager = getManager();

    // Check authorization
    if (!pupil.isParticipant || pupil.wix_id != userId) {
        throw new HTTPError(403, "Unauthorized pupil tried to leave course's waitinglist");
    }

    // Try to leave course
    await entityManager.transaction(async em => {
        // Note: The transaction here is important, since concurrent accesses to subcourse.participants are not safe

        const course = await em.findOneOrFail(Course, { id: courseId });
        const subcourse = await em.findOneOrFail(Subcourse, { id: subcourseId, course: course });

        // Check if pupil is on waiting list
        if (!subcourse.isPupilOnWaitingList(pupil)) {
            throw new HTTPError(400, `Pupil ${pupil.id} tried to leave waiting list of subcourse nr ${subcourseId} he didn't join`);
        }

        //leave waiting list
        try {
            subcourse.removePupilFromWaitingList(pupil);
            await em.save(Subcourse, subcourse);

            logger.info(`Pupil ${pupil.id} successfully left waiting list of subcourse nr ${subcourseId}`);

            // transactionlog
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantLeftWaitingListEvent(pupil, course));
        } catch (e) {
            throw new HTTPError(500, "Can't leave subcourse's waiting list");
        }
    });
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
export async function groupMailHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid");
        Validation.hasBody(req, { subject: "string", body: "string" });

        await groupMail(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body.subject, req.body.body);
        res.status(204).send("Emails successfully send");
    });
}

async function groupMail(student: Student, courseId: number, subcourseId: number, mailSubject: string, mailBody: string): Promise<void | never> {
    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        throw new HTTPError(403, "Group mail requested by student who is no instructor or not instructor-screened");
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId });

    if (course == undefined) {
        throw new HTTPError(404, "Tried to send group mail to invalid course");
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, "Tried to send group mail to invalid subcourse");
    }

    Validation.isInstructorOf(student, course);

    try {
        for (let participant of subcourse.participants) {
            await sendInstructorGroupMail(participant, student, course, mailSubject, mailBody);
        }
    } catch (error) {
        throw new HTTPError(500, "Unable to send group mail", error);
    }
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
export async function instructorMailHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isPupil(res);
        Validation.hasParams(req, "id", "subid");
        Validation.hasBody(req, { subject: "string", body: "string" });

        instructorMail(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body.subject, req.body.body);
        res.status(204).send("Mail sent successfully");
    });
}

async function instructorMail(pupil: Pupil, courseId: number, subcourseId: number, mailSubject: string, mailBody: string): Promise<void | never> {
    if (!pupil.isParticipant || !pupil.active) {
        throw new HTTPError(403, "Instructor mail requested by pupil who is no participant or no longer active");
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId });

    if (course == undefined) {
        throw new HTTPError(404, "Tried to send instructor mail to invalid course");
    }

    if (!course.allowContact) {
        throw new HTTPError(404, "Tried to send mail to correspondent of a course where contact isn't permitted.");
    }

    if (!course.correspondent) {
        throw new HTTPError(500, `Tried to send mail to instructors of course (id: ${course.id}) where no correspondent was defined.`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course });
    if (subcourse == undefined) {
        throw new HTTPError(404, "Tried to send instructor mail to invalid subcourse");
    }


    try {
        // send mail to correspondnet
        await sendParticipantToInstructorMail(pupil, course.correspondent, course, mailSubject, mailBody);
    } catch (e) {
        throw new HTTPError(400, "Unable to send instructor mail");
    }
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
export async function joinCourseMeetingHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.hasParams(req, "id", "subid");

        const courseId = req.params.id || null;
        const subcourseId = req.params.subid ? String(req.params.subid) : null;
        const ip = req.connection.remoteAddress || null;

        let course: ApiCourse;
        let meeting: BBBMeeting;

        let authenticatedStudent = res.locals.user instanceof Student;
        let authenticatedPupil = res.locals.user instanceof Pupil;

        if (!authenticatedPupil && !authenticatedStudent) {
            throw new HTTPError(403, "An unauthorized user wanted to join a BBB-Meeting");
        }

        const meetingInDB: boolean = await isBBBMeetingInDB(subcourseId);

        if (meetingInDB) {
            meeting = await getBBBMeetingFromDB(subcourseId);
        } else {
            course = await getCourse(
                authenticatedStudent ? res.locals.user : undefined,
                authenticatedPupil ? res.locals.user : undefined,
                Number.parseInt(courseId, 10)
            );

            meeting = await createBBBMeeting(course.name, subcourseId, res.locals.user);
        }

        if (!!meeting.alternativeUrl) {
            res.send({ url: meeting.alternativeUrl });
        } else if (authenticatedStudent) {
            let user: Student = res.locals.user;

            await startBBBMeeting(meeting);

            res.send({
                url: getMeetingUrl(subcourseId, `${user.firstname}+${user.lastname}`, meeting.moderatorPW)
            });
        } else if (authenticatedPupil) {
            const meetingIsRunning: boolean = await isBBBMeetingRunning(subcourseId);

            if (!meetingIsRunning) {
                throw new HTTPError(400, "BBB-Meeting has not startet yet");
            }

            let user: Pupil = res.locals.user;

            res.send({
                url: getMeetingUrl(subcourseId, `${user.firstname}+${user.lastname}`, meeting.attendeePW, user.wix_id)
            });

            // BBB logging
            await createOrUpdateCourseAttendanceLog(user, ip, subcourseId);
        }
    });
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
export async function testJoinCourseMeetingHandler(req: Request, res: Response) {
    handleError(res, async () => {
        const user: Student | Pupil | undefined = res.locals.user;
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
        logger.info(`Test BBB meeting created for a user (${user?.wix_id ?? "unauthenticated"}, with${!hasModeratorRights ? "out" : ""} moderator rights) called ${userName} with settings: ${JSON.stringify(meeting)}`);

        // get the meeting url
        const meetingURL = getMeetingUrl(meeting.meetingID, userName, meetingPW);

        // immediately redirect to the meeting
        res.redirect(meetingURL);
    });
}

/**
 * @api {GET} /courses/tags getCourseTags
 * @apiVersion 1.1.0
 * @apiDescription
 *
 * Retrieves all used course tags
 *
 * Only students or pupils can access this.
 *
 * @apiName getCourseTags
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" [host]/api/courses/tags
 */
export async function getCourseTagsHandler(req: Request, res: Response) {
    handleError(res, async () => {
        res.json(await getCourseTags());
    });
}

async function getCourseTags() {
    const entityManager = getManager();

    const tags = await prisma.course_tag.findMany({ select: { identifier: true, name: true, category: true } });

    return tags.map(({ name, category, identifier }) => ({ id: identifier, name, category }));
}

/**
 * @api {POST} /course/:id/instructor AddInstructor
 * @apiVersion 1.1.0
 * @apiDescription
 * Add a new instructor to a course (and all of its subcourses too)
 *
 * It will expect an email address of an existent, active and sucessfully screened instructor (a student who is an instructor)
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName AddInstructor
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl --location --request POST 'localhost:5000/api/course/2/instructor' --header 'Token: authtokenS1' --header 'Content-Type: application/json' --data-raw '{ "email": "mel-98@gmail.com"}'
 *
 * @apiUse InstructorInfo
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postAddCourseInstructorHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id");
        Validation.hasBody(req, { email: "string" });

        await postAddCourseInstructor(res.locals.user, +req.params.id, req.body);
        res.status(200).send("added instructor");
    });
}

async function postAddCourseInstructor(student: Student, courseID: number, apiInstructorToAdd: ApiInstructorID): Promise<number> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseID });
    if (course == undefined) {
        throw new HTTPError(404, `User tried to add an instructor to non-existent course (ID ${courseID})`);
    }

    Validation.isInstructorOf(student, course);

    // Check validity of instructor that should be added
    let instructorToAdd = await entityManager.findOne(Student, {
        email: apiInstructorToAdd.email
    });

    if (!instructorToAdd) {
        throw new HTTPError(404, `Cannot find a person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email}`);
    }

    if (!instructorToAdd.active) {
        throw new HTTPError(404, `Person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not active. It cannot be added to a course!`);
    }

    if (!instructorToAdd.isInstructor) {
        throw new HTTPError(403, `The person (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not a course instructor. It cannot be added to a course!`);
    }

    if (await instructorToAdd.instructorScreeningStatus() !== ScreeningStatus.Accepted) {
        throw new HTTPError(403, `The instructor (to add to course number ${courseID}) with email address ${apiInstructorToAdd.email} is not successfully screened as an instructor. S*he thus cannot be added to a course!`);
    }

    if (course.instructors.some(i => i.id === instructorToAdd.id)) {
        throw new HTTPError(409, `The instructor with email address ${apiInstructorToAdd.email} is already an instructor of course number ${courseID}!`);
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
    } catch (error) {
        throw new HTTPError(500, "Can't save the changes applied while adding an instructor to a course", error);
    }
}

/**
 * @api {POST} /course/:id/image ChangeImage
 * @apiVersion 1.1.0
 * @apiDescription
 * Changes the image of a course
 *
 * Expects multipart/form-data image (PNG, JPEG or GIF)
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName ChangeImage
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function putCourseImageHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id");

        if (!req.file) {
            throw new HTTPError(400, `PUT /course/:id/image expects either a PNG, JPEG or GIF file`);
        }

        const result = await setCourseImage(res.locals.user, +req.params.id, req.file);
        res.send(result);
    });
}

async function setCourseImage(student: Student, courseID: number, imageFile?: Express.Multer.File): Promise<{ imageURL?: string }> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    await Validation.isAcceptedInstructor(student);

    // Check access rights
    const course = await entityManager.findOne(Course, { id: courseID });

    if (course == undefined) {
        throw new HTTPError(404, `User tried to change course image of non existent course (ID ${courseID})`);
    }

    Validation.isInstructorOf(student, course);


    try {
        if (imageFile) {
            // TODO: Check validity of image (i.e. a valid JPEG, and not just mime type or something like that)

            const fileExtension = mime.extension(imageFile.mimetype);

            if (!fileExtension) {
                throw new HTTPError(400, `User tried to change course image for course with ID ${courseID}, but the provided file of wrong mime type`);
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
    }
    catch (e) {
        throw new HTTPError(503, `Error while uploading/modifying image for course ${courseID}`, e);
    }

    try {
        await entityManager.save(course); //save course...

        // todo add transactionlog
        logger.info(`Successfully changed image of course with ID ${courseID}`);

        return { imageURL: course.imageURL() };
    } catch (error) {
        throw new HTTPError(500, "Can't save changed image key to database", error);
    }
}

/**
 * @api {POST} /course/:id/image RemoveImage
 * @apiVersion 1.1.0
 * @apiDescription
 * Remove the image of a course
 *
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 *
 * @apiName RemoveImage
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function deleteCourseImageHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id");

        const result = await setCourseImage(res.locals.user, +req.params.id, null);
        res.send(result);
    });
}

/**
 * @api {POST} /course/:id/inviteexternal InviteExternalCourseGuest
 * @apiVersion 1.1.0
 * @apiDescription
 * Sends an invitation to an external course guest.
 *
 * @apiParam (URL Parameter) {int} id ID of the course
 *
 * @apiName InviteExternalCourseGuest
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse PostExternalInvite
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/inviteexternal
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function inviteExternalHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id");
        Validation.hasBody(req, { firstname: "string", lastname: "string", email: "string"});

        await inviteExternal(res.locals.user, Number.parseInt(req.params.id, 10), req.body);
        res.status(200).end();
    });
}

async function inviteExternal(student: Student, courseID: number, inviteeInfo: ApiPostExternalInvite): Promise<void | never> {
    const entityManager = getManager();
    //TODO: Implement transactionLog

    // Check authorization
    if (!student.active || !student.isInstructor || await student.instructorScreeningStatus() !== ScreeningStatus.Accepted) {
        new HTTPError(403, `Unauthorized student ${student.id} tried to invite external guest to course ${courseID}`);
    }

    // Check access rights of student to the course
    const course = await entityManager.findOne(Course, { id: courseID }, {
        relations: ["guests"]
    });

    if (course == undefined) {
        throw new HTTPError(404, `Student ${student.id} tried to invite external guest to non-existent course (ID ${courseID})`);
    }

    Validation.isInstructorOf(student, course);

    if (course.courseState !== CourseState.ALLOWED) {
        throw new HTTPError(403, `Student ${student.id} tried to invite an external guest to a course (ID ${courseID}) but that course is not yet allowed!`);
    }

    //check inviteeInfo
    const guestEmail = inviteeInfo.email.toLowerCase(); //always lower case...
    if (!isEmail(guestEmail)) {
        throw new HTTPError(400, `Student ${student.id} tried to invite an external guest for course (ID ${courseID}), but the given email address is invalid`);
    }

    const currentGuests = course.guests;
    //make sure that at most 5 persons are invited per course
    if (currentGuests.length >= 5) {
        throw new HTTPError(/*no more guests could be invited*/429, `Student ${student.id} tried to invite another external guest for course with ID ${courseID}, but that course already has 5 invited guests`);
    }

    //check if person is already invited
    if (currentGuests.some(g => g.email === guestEmail)) {
        throw new HTTPError(/* Conflict */409, `Student ${student.id} tried to invite another external guest with email ${guestEmail} for course with ID ${courseID}, but that guest was already invited!`);
    }

    //create new guest instance
    const uniqueToken = await generateNewCourseGuestToken(entityManager); //unique one...
    const newGuest = new CourseGuest(guestEmail, inviteeInfo.firstname, inviteeInfo.lastname, course, student, uniqueToken);

    //save that new guest
    try {
        await entityManager.save(newGuest);

        //send the corresponding mail to the guest
        await sendGuestInvitationMail(newGuest);
    } catch (e) {
        throw new Error(`An error occurred during invitation of guest ${guestEmail} for course ${courseID}: ${e}`);
    }
}


/**
 * @api {POST} /course/meeting/external/join/:token ExternalGuestJoinMeeting
 * @apiVersion 1.1.0
 * @apiDescription
 * Uses the given token to join the external meeting
 *
 * @apiParam (URL Parameter) {string} token The token that should be used to join the external meeting
 *
 * @apiName ExternalGuestJoinMeeting
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/meeting/external/join/:token
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function joinCourseMeetingExternalHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.hasParams(req, "token");

        const result = await joinCourseMeetingExternalGuest(req.params.token);
        res.send(result);
    });
}

async function joinCourseMeetingExternalGuest(token: string): Promise<ApiExternalGuestJoinMeetingResult | never> {
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
        throw new HTTPError(400, `Join course using token failed: Cannot find guest info corresponding to token '${token}'`);
    }

    const course = guest.course;

    //get the first subcourse of this course (because my code here has no special handling for the subcourses case -> not good, but quick and dirty since the entire courses code will entirely gets deleted in a few weeks...)
    const subcourse = course?.subcourses?.[0];

    if (!subcourse) {
        throw new HTTPError(500, `Cannot join meeting as guest ${guest.email} for course ${course?.id} since that course has no subcourses!`);
    }

    const subcourseIDString = "" + subcourse.id;
    //get the meeting for that subcourse
    const meeting = await getBBBMeetingFromDB(subcourseIDString);

    if (!meeting) {
        throw new HTTPError(
            428, //use this to indicate the meeting hasn't started yet
            `Cannot join meeting as guest ${guest.email} for course ${course.id} since there is no meeting started yet`
        );
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
        throw new HTTPError(
            428, //use this to indicate the meeting hasn't started yet
            `Cannot join meeting as guest ${guest.email} for course ${course.id} since the meeting exists, but wasn't yet started by the instructor`
        );
    }

    //create the join url
    const joinURL = getMeetingUrl(meeting.meetingID, guest.fullName(), meeting.attendeePW, undefined); // no last parameter `userID` since guests should be "anonymous"

    return {
        url: joinURL
    };
}

/**
 * @api {POST} /course/:id/subcourse/:subid/certificate IssueGroupCertificate
 * @apiVersion 1.1.0
 * @apiDescription
 * Send a mail to all selected participants and issue them a certificate that is attached to that mail.
 *
 * The course instructors may use this endpoint.
 *
 * @apiParam (URL Parameter) {int} id ID of the main course
 * @apiParam (URL Parameter) {int} subid ID of the subcourse
 *
 * @apiName IssueGroupCertificate
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiUse PostIssueGroupCertificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/subcourse/<SUBID>/certificate -d "<REQUEST"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function issueCourseCertificateHandler(req: Request, res: Response) {
    handleError(res, async () => {
        Validation.isStudent(res);
        Validation.hasParams(req, "id", "subid");
        Validation.hasBody(req, { receivers: "string[]" });

        await issueCourseCertificate(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body.receivers);

        return res.status(204).end("Issued all Course certificates");
    });
}

async function issueCourseCertificate(student: Student, courseId: number, subcourseId: number, receivers: string[]) {
    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        throw new HTTPError(403, `User ${student.wix_id} cannot issue a course certificate for subcourse with ID ${subcourseId} since that student is no (successfully screened) instructor`);
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, { id: courseId }, {
        loadEagerRelations: false,
        relations: ["instructors"]
    });

    if (course == undefined) {
        throw new HTTPError(404, `User ${student.wix_id} tried to issue course certificates for invalid course with ID ${courseId}`);
    }

    const subcourse = await entityManager.findOne(Subcourse, { id: subcourseId, course: course }, {
        loadEagerRelations: false,
        relations: ["lectures"]
    });

    if (subcourse == undefined) {
        throw new HTTPError(404, `User ${student.wix_id} tried to issue course certificate for invalid subcourse with ID ${subcourseId}.`);
    }

    Validation.isInstructorOf(student, course);

    //check participants list
    if (receivers.length === 0) {
        throw new HTTPError(400, `User ${student.wix_id} tried to issue course certificate for NO receivers at all. That is not possible.`);
    }

    // TODO: Can't we do that in one Database transaction?
    const participants = await Promise.all(receivers.map(r => getPupilByWixID(entityManager, r)));

    const unknownParticipants = participants.filter(p => p == null);

    if (unknownParticipants.length > 0) {
        throw new HTTPError(400, `User ${student.wix_id} tried to issue course certificate for at least one unknown receiver, which is not allowed (unknown receivers: ${JSON.stringify(unknownParticipants)})`);
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
    } catch (error) {
        throw new HTTPError(400, "Unable to issue course certificate", error);
    }
}

