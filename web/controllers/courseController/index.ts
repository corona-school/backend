import {Request, Response} from 'express';
import {getLogger} from 'log4js';
import {getManager} from 'typeorm';
import {ScreeningStatus, Student} from '../../../common/entity/Student';
import {
    ApiAddCourse,
    ApiAddLecture,
    ApiAddSubcourse,
    ApiCourse,
    ApiCourseTag,
    ApiEditCourse,
    ApiEditLecture,
    ApiEditSubcourse,
    ApiInstructor,
    ApiLecture,
    ApiSubcourse
} from './format';
import {Course, CourseCategory, CourseState} from '../../../common/entity/Course';
import {getTransactionLog} from '../../../common/transactionlog';
import CreateCourseEvent from '../../../common/transactionlog/types/CreateCourseEvent';
import CancelSubcourseEvent from '../../../common/transactionlog/types/CancelSubcourseEvent';
import CancelCourseEvent from '../../../common/transactionlog/types/CancelCourseEvent';
import {CourseTag} from '../../../common/entity/CourseTag';
import {Subcourse} from '../../../common/entity/Subcourse';
import {Lecture} from '../../../common/entity/Lecture';
import {Pupil} from '../../../common/entity/Pupil';
import {sendSubcourseCancelNotifications, sendInstructorGroupMail} from '../../../common/mails/courses';
import {
    bbbMeetingCache,
    createBBBMeeting,
    isBBBMeetingRunning,
    BBBMeeting,
    createBBBlog
} from '../../../common/util/bbb';
import {isJoinableCourse} from './utils';


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
    let status = 200;
    try {
        let authenticatedStudent = false;
        let authenticatedPupil = false;
        if (res.locals.user instanceof Student) {
            authenticatedStudent = true;
        }
        if (res.locals.user instanceof Pupil) {
            authenticatedPupil = true;
        }
        let fields = [];
        if (typeof req.query.fields == 'string') {
            fields = req.query.fields.split(',');
        }
        let states = ['allowed'];
        if (typeof req.query.states == 'string') {
            states = req.query.states.split(',');
        }
        let instructorId = undefined;
        if (typeof req.query.instructor == 'string') {
            instructorId = req.query.instructor;
        }
        let participantId = undefined;
        if (typeof req.query.participant == 'string') {
            participantId = req.query.participant;
        }
        let onlyJoinableCourses = true;
        if (typeof req.query.onlyJoinableCourses == 'string') {
            onlyJoinableCourses = req.query.onlyJoinableCourses === 'true';
        }

        try {
            let obj = await getCourses(
                authenticatedStudent ? res.locals.user : undefined,
                authenticatedPupil ? res.locals.user : undefined,
                fields,
                states,
                instructorId,
                participantId,
                onlyJoinableCourses
            );
            if (typeof obj == 'number') {
                status = obj;
            } else {
                res.json(obj);
            }
        } catch (e) {
            logger.error("An error occurred during GET /courses: " + e.message);
            logger.debug(req, e);
            status = 500;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function getCourses(student: Student | undefined,
                          pupil: Pupil | undefined, fields: Array<string>,
                          states: Array<string>,
                          instructorId: string | undefined,
                          participantId: string | undefined,
                          onlyJoinableCourses: boolean): Promise<Array<ApiCourse> | number> {
    const entityManager = getManager();

    let authenticatedStudent = false;
    let authenticatedPupil = false;
    if (student instanceof Student) {
        authenticatedStudent = true;
    }
    if (pupil instanceof Pupil) {
        authenticatedPupil = true;
    }

    if (instructorId != undefined && !authenticatedStudent) {
        logger.warn(`Unauthenticated user tried to access courses created by instructor (ID: ${instructorId})`);
        return 401;
    }

    if (participantId != undefined && !authenticatedPupil) {
        logger.warn(`Unauthenticated user tried to access courses joined by pupil (ID: ${participantId})`);
        return 401;
    }

    if (instructorId != undefined && authenticatedStudent && student.wix_id != instructorId) {
        logger.warn(`User (ID: ${student.wix_id}) tried to filter by instructor id ${instructorId}`);
        logger.debug(student, fields, states, instructorId);
        return 403;
    }

    if (participantId != undefined && authenticatedPupil && pupil.wix_id != participantId) {
        logger.warn(`User (ID: ${pupil.wix_id}) tried to filter by participant id ${participantId}`);
        logger.debug(pupil, fields, participantId);
        return 403;
    }

    if (states.length != 1 || states[0] != 'allowed') {
        if (!authenticatedStudent) {
            logger.warn(`Unauthenticated user tried to filter by states ${states.join(',')}`);
            return 401;
        } else if (instructorId == undefined) {
            logger.warn(`User (ID: ${student.wix_id}) tried to filter by states ${states.join(',')} without specifying an instructor id`);
            logger.debug(student, fields, states, instructorId);
            return 403;
        }
    }

    if (states.length == 0) {
        logger.warn("Request for /courses while filtering with states=(empty). This would never return any results");
        logger.debug(student, fields, states, instructorId);
        return 400;
    }
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
                logger.warn("Unknown state: " + states[i]);
                logger.debug(student, fields, states, instructorId);
                return 400;
        }
        stateFilters.push(state);
    }

    let apiCourses: Array<ApiCourse> = [];
    try {
        const qb = entityManager.getRepository(Course).createQueryBuilder("course")
            .leftJoinAndSelect("course.subcourses", "subcourse")
            .leftJoinAndSelect("course.tags", "tags")
            .leftJoinAndSelect("course.instructors", "instructor")
            .leftJoinAndSelect("subcourse.instructors", "subinstructor")
            .leftJoinAndSelect("subcourse.participants", "participant")
            .leftJoinAndSelect("subcourse.lectures", "lecture")
            .leftJoinAndSelect("lecture.instructor", "lecinstructor");

        if (instructorId) {
            qb.where("instructor.wix_id = :id", {id: student.wix_id});
        } else if (participantId) {
            qb.where("participant.wix_id = :id", {id: pupil.wix_id});
        }

        if (stateFilters.length > 0) {
            if (instructorId || participantId) {
                qb.andWhere("course.courseState IN (:...states)", {states: stateFilters});
            } else {
                qb.where("course.courseState IN (:...states)", {states: stateFilters});
            }
        }

        const courses = await qb.getMany();

        for (let i = 0; i < courses.length; i++) {
            let apiCourse: ApiCourse = {
                id: courses[i].id,
                publicRanking: courses[i].publicRanking
            };
            for (let j = 0; j < fields.length; j++) {
                switch (fields[j].toLowerCase()) {
                    case 'id':
                        break;
                    case 'instructors':
                        apiCourse.instructors = [];
                        for (let k = 0; k < courses[i].instructors.length; k++) {
                            let instructor: ApiInstructor = {
                                firstname: courses[i].instructors[k].firstname,
                                lastname: courses[i].instructors[k].lastname
                            };
                            if (authenticatedStudent && student.wix_id != instructorId) {
                                instructor.id = courses[i].instructors[k].wix_id;
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
                        apiCourse.image = courses[i].imageUrl;
                        break;
                    case 'category':
                        apiCourse.category = courses[i].category;
                        break;
                    case 'tags':
                        apiCourse.tags = [];
                        for (let k = 0; k < courses[i].tags.length; k++) {
                            let tag: ApiCourseTag = {
                                id: courses[i].tags[k].identifier,
                                name: courses[i].tags[k].name,
                                category: courses[i].tags[k].category
                            };
                            apiCourse.tags.push(tag);
                        }
                        break;
                    case 'subcourses':
                        apiCourse.subcourses = [];
                        if (courses[i].subcourses) {
                            for (let k = 0; k < courses[i].subcourses.length; k++) {
                                let subcourse: ApiSubcourse = {
                                    id: courses[i].subcourses[k].id,
                                    minGrade: courses[i].subcourses[k].minGrade,
                                    maxGrade: courses[i].subcourses[k].maxGrade,
                                    maxParticipants: courses[i].subcourses[k].maxParticipants,
                                    participants: courses[i].subcourses[k].participants.length,
                                    instructors: [],
                                    lectures: [],
                                    joinAfterStart: courses[i].subcourses[k].joinAfterStart
                                };
                                for (let l = 0; l < courses[i].subcourses[k].instructors.length; l++) {
                                    let instructor: ApiInstructor = {
                                        firstname: courses[i].subcourses[k].instructors[l].firstname,
                                        lastname: courses[i].subcourses[k].instructors[l].lastname
                                    };
                                    if (authenticatedStudent && student.wix_id == instructorId) {
                                        instructor.id = courses[i].subcourses[k].instructors[l].wix_id;
                                    }
                                    subcourse.instructors.push(instructor);
                                }
                                for (let l = 0; l < courses[i].subcourses[k].lectures.length; l++) {
                                    let lecture: ApiLecture = {
                                        id: courses[i].subcourses[k].lectures[l].id,
                                        instructor: {
                                            firstname: courses[i].subcourses[k].lectures[l].instructor.firstname,
                                            lastname: courses[i].subcourses[k].lectures[l].instructor.lastname
                                        },
                                        start: courses[i].subcourses[k].lectures[l].start.getTime() / 1000,
                                        duration: courses[i].subcourses[k].lectures[l].duration
                                    };
                                    if (authenticatedStudent && student.wix_id == instructorId) {
                                        lecture.instructor.id = courses[i].subcourses[k].lectures[l].instructor.wix_id;
                                    }
                                    subcourse.lectures.push(lecture);
                                }
                                if (authenticatedStudent && student.wix_id == instructorId) {
                                    subcourse.participantList = [];
                                    for (let l = 0; l < courses[i].subcourses[k].participants.length; l++) {
                                        subcourse.participantList.push({
                                            firstname: courses[i].subcourses[k].participants[l].firstname,
                                            lastname: courses[i].subcourses[k].participants[l].lastname,
                                            email: courses[i].subcourses[k].participants[l].email,
                                            grade: parseInt(courses[i].subcourses[k].participants[l].grade),
                                            schooltype: courses[i].subcourses[k].participants[l].schooltype
                                        });
                                    }
                                }
                                if (authenticatedPupil && pupil.wix_id == participantId) {
                                    subcourse.joined = false;
                                    for (let l = 0; l < courses[i].subcourses[k].participants.length; l++) {
                                        if (courses[i].subcourses[k].participants[l].wix_id == pupil.wix_id) {
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

    //filter out onlyJoinableCourses, if requested
    if (onlyJoinableCourses) {
        apiCourses = apiCourses.filter(isJoinableCourse);
    }

    return apiCourses;
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
    let status = 200;
    try {
        if (req.params.id != undefined) {
            let authenticatedStudent = false;
            let authenticatedPupil = false;
            if (res.locals.user instanceof Student) {
                authenticatedStudent = true;
            }
            if (res.locals.user instanceof Pupil) {
                authenticatedPupil = true;
            }
            try {
                let obj = await getCourse(
                    authenticatedStudent ? res.locals.user : undefined,
                    authenticatedPupil ? res.locals.user : undefined,
                    Number.parseInt(req.params.id, 10)
                );
                if (typeof obj == 'number') {
                    status = obj;
                } else {
                    res.json(obj);
                }
            } catch (e) {
                logger.error("An error occurred during GET /course: " + e.message);
                logger.debug(req, e);
                status = 500;
            }
        } else {
            status = 400;
            logger.error("Expected id parameter on route");
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function getCourse(student: Student | undefined, pupil: Pupil | undefined, course_id: number): Promise<ApiCourse | number> {
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
        const course = await entityManager.findOne(Course, {id: course_id});

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

        apiCourse = {
            id: course.id,
            publicRanking: course.publicRanking,
            instructors: [],
            name: course.name,
            outline: course.outline,
            description: course.description,
            image: course.imageUrl,
            category: course.category,
            tags: [],
            subcourses: []
        };

        if (authorizedStudent) {
            apiCourse.state = course.courseState;
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
            if (!authorizedStudent && !course.subcourses[i].published) continue;

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
                        firstname: course.subcourses[i].instructors[j].firstname,
                        lastname: course.subcourses[i].instructors[j].lastname
                    });
                } else {
                    subcourse.instructors.push({
                        firstname: course.subcourses[i].instructors[j].firstname,
                        lastname: course.subcourses[i].instructors[j].lastname
                    });
                }
            }
            for (let j = 0; j < course.subcourses[i].lectures.length; j++) {
                let lecture: ApiLecture = {
                    id: course.subcourses[i].lectures[j].id,
                    instructor: {
                        firstname: course.subcourses[i].lectures[j].instructor.firstname,
                        lastname: course.subcourses[i].lectures[j].instructor.lastname
                    },
                    start: course.subcourses[i].lectures[j].start.getTime() / 1000,
                    duration: course.subcourses[i].lectures[j].duration
                };
                if (authorizedStudent) {
                    lecture.instructor.id = course.subcourses[i].lectures[j].instructor.wix_id;
                }
                subcourse.lectures.push(lecture);
            }
            if (authorizedStudent) {
                subcourse.participantList = [];
                for (let j = 0; j < course.subcourses[i].participants.length; j++) {
                    subcourse.participantList.push({
                        firstname: course.subcourses[i].participants[j].firstname,
                        lastname: course.subcourses[i].participants[j].lastname,
                        email: course.subcourses[i].participants[j].email,
                        grade: parseInt(course.subcourses[i].participants[j].grade),
                        schooltype: course.subcourses[i].participants[j].schooltype
                    });
                }
            }
            if (authenticatedPupil) {
                subcourse.joined = false;
                for (let j = 0; j < course.subcourses[i].participants.length; j++) {
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
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.body.instructors instanceof Array &&
                typeof req.body.name == 'string' &&
                typeof req.body.outline == 'string' &&
                typeof req.body.description == 'string' &&
                typeof req.body.category == 'string' &&
                req.body.tags instanceof Array &&
                typeof req.body.submit == 'boolean') {

                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(`Instructor ID ${req.body.instructors[i]} is no string`);
                    }
                }
                for (let i = 0; i < req.body.tags.length; i++) {
                    if (typeof req.body.tags[i] != 'string') {
                        status = 400;
                        logger.warn(`Tag ID ${req.body.tags[i]} is no string`);
                    }
                }

                if (status < 300) {
                    const ret = await postCourse(res.locals.user, req.body);
                    if (typeof ret == 'number') {
                        status = ret;
                    } else {
                        res.json(ret);
                    }
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add a course");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function postCourse(student: Student, apiCourse: ApiAddCourse): Promise<ApiCourse | number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    if (student.courses.length >= 25) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but has reached his limit.`);
        logger.debug(student);
        return 403;
    }

    // Some checks
    if (apiCourse.instructors.indexOf(student.wix_id) < 0) {
        logger.warn(`Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(', ')}`);
        logger.debug(apiCourse);
        return 400;
    }

    let filters = [];
    for (let i = 0; i < apiCourse.instructors.length; i++) {
        filters.push({
            wix_id: apiCourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, {where: filters});
    if (instructors.length != apiCourse.instructors.length) {
        logger.warn(`Field 'instructors' contains invalid values: ${apiCourse.instructors.join(', ')}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.name.length == 0 || apiCourse.name.length > 200) {
        logger.warn(`Invalid length of field 'name': ${apiCourse.name.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.outline.length == 0 || apiCourse.outline.length > 200) {
        logger.warn(`Invalid length of field 'outline': ${apiCourse.outline.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.description.length == 0 || apiCourse.description.length > 3000) {
        logger.warn(`Invalid length of field 'description': ${apiCourse.description.length}`);
        logger.debug(apiCourse);
        return 400;
    }

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
        tags = await entityManager.find(CourseTag, {where: filters});
        if (tags.length != apiCourse.tags.length) {
            logger.warn(`Field 'tags' contains invalid values: ${apiCourse.tags.join(', ')}`);
            logger.debug(apiCourse, tags);
            return 400;
        }
    }

    const course = new Course();
    course.instructors = instructors;
    course.name = apiCourse.name;
    course.outline = apiCourse.outline;
    course.description = apiCourse.description;
    course.imageUrl = undefined;
    course.category = category;
    course.tags = tags;
    course.subcourses = [];
    course.courseState = apiCourse.submit ? CourseState.SUBMITTED : CourseState.CREATED;

    try {
        await entityManager.save(Course, course);
        await transactionLog.log(new CreateCourseEvent(student, course));
        logger.info("Successfully saved new course");

        return {
            id: course.id,
            publicRanking: course.publicRanking
        };
    } catch (e) {
        logger.error("Can't save new course: " + e.message);
        logger.debug(course, e);
        return 500;
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
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.body.instructors instanceof Array &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                (req.body.maxParticipants == undefined || typeof req.body.maxParticipants == 'number') &&
                typeof req.body.joinAfterStart == 'boolean' &&
                typeof req.body.published == 'boolean') {

                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(`Instructor ID ${req.body.instructors[i]} is no string`);
                    }
                }

                if (status < 300) {
                    const ret = await postSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), req.body);
                    if (typeof ret == 'number') {
                        status = ret;
                    } else {
                        res.json(ret);
                    }
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function postSubcourse(student: Student, courseId: number, apiSubcourse: ApiAddSubcourse): Promise<ApiSubcourse | number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add an subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to add subcourse to non existent course (ID ${courseId})`);
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
        logger.warn(`User tried to add subcourse, but has no access rights (ID ${courseId})`);
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
    const instructors = await entityManager.find(Student, {where: filters});
    if (instructors.length == 0 || instructors.length != apiSubcourse.instructors.length) {
        logger.warn(`Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(', ')}`);
        logger.debug(apiSubcourse);
        return 400;
    }

    if (!Number.isInteger(apiSubcourse.minGrade) || apiSubcourse.minGrade < 1 || apiSubcourse.minGrade > 13) {
        logger.warn(`Field 'minGrade' contains an illegal value: ${apiSubcourse.minGrade}`);
        logger.debug(apiSubcourse);
        return 400;
    }

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

    if (apiSubcourse.maxParticipants == undefined) apiSubcourse.maxParticipants = 30;
    if (!Number.isInteger(apiSubcourse.maxParticipants) || apiSubcourse.maxParticipants < 3 || apiSubcourse.maxParticipants > 100) {
        logger.warn(`Field 'maxParticipants' contains an illegal value: ${apiSubcourse.maxParticipants}`);
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
        logger.info("Successfully saved new subcourse");

        return {
            id: subcourse.id
        };
    } catch (e) {
        logger.error("Can't save new subcourse: " + e.message);
        logger.debug(subcourse, e);
        return 500;
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
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                typeof req.body.instructor == 'string' &&
                typeof req.body.start == 'number' &&
                typeof req.body.duration == 'number') {

                if (status < 300) {
                    const ret = await postLecture(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body);
                    if (typeof ret == 'number') {
                        status = ret;
                    } else {
                        res.json(ret);
                    }
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse/:subid/lecture");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add a lecture");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function postLecture(student: Student, courseId: number, subcourseId: number, apiLecture: ApiAddLecture): Promise<{ id: number } | number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add a lecture, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to add lecture to non-existent course (ID ${courseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
    if (subcourse == undefined) {
        logger.warn(`User tried to add lecture to non-existent subcourse (ID ${subcourseId})`);
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
        logger.warn(`User tried to add lecture, but has no access rights (ID ${courseId})`);
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

    // You can only create lectures that start at least in 2 days
    if (!Number.isInteger(apiLecture.start) || apiLecture.start * 1000 - (new Date()).getTime() < 2 * 86400000) {
        logger.warn(`Field 'start' contains an illegal value: ${apiLecture.start}`);
        logger.debug(apiLecture);
        return 400;
    }

    if (!Number.isInteger(apiLecture.duration) || apiLecture.duration < 15 || apiLecture.duration > 480) {
        logger.warn(`Field 'duration' contains an illegal value: ${apiLecture.duration}`);
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
        logger.info("Successfully saved new lecture");

        return {
            id: lecture.id
        };
    } catch (e) {
        logger.error("Can't save new lecture: " + e.message);
        logger.debug(lecture, e);
        return 500;
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
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.body.instructors instanceof Array &&
                (req.body.name == undefined || typeof req.body.name == 'string') &&
                (req.body.outline == undefined || typeof req.body.outline == 'string') &&
                typeof req.body.description == 'string' &&
                (req.body.outline == undefined || typeof req.body.category == 'string') &&
                req.body.tags instanceof Array &&
                (req.body.outline == undefined || typeof req.body.submit == 'boolean')) {

                // Check if string arrays
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(`Instructor ID ${req.body.instructors[i]} is no string`);
                    }
                }
                for (let i = 0; i < req.body.tags.length; i++) {
                    if (typeof req.body.tags[i] != 'string') {
                        status = 400;
                        logger.warn(`Tag ID ${req.body.tags[i]} is no string`);
                    }
                }

                if (status < 300) {
                    status = await putCourse(res.locals.user, Number.parseInt(req.params.id, 10), req.body);
                }
            } else {
                status = 400;
                logger.warn("Invalid request for PUT /course");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to edit a course");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function putCourse(student: Student, courseId: number, apiCourse: ApiEditCourse): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access right
    const course = await entityManager.findOne(Course, {id: courseId});
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
        logger.warn(`User tried to edit course, but has no access rights (ID ${courseId})`);
        logger.debug(student, apiCourse);
        return 403;
    }

    // Validate input
    if (apiCourse.instructors.indexOf(student.wix_id) < 0) {
        logger.warn(`Instructor is not mentioned in field 'instructors': ${apiCourse.instructors.join(', ')}`);
        logger.debug(apiCourse);
        return 400;
    }

    let filters = [];
    for (let i = 0; i < apiCourse.instructors.length; i++) {
        filters.push({
            wix_id: apiCourse.instructors[i]
        });
    }
    const instructors = await entityManager.find(Student, {where: filters});
    if (instructors.length != apiCourse.instructors.length) {
        logger.warn(`Field 'instructors' contains invalid values: ${apiCourse.instructors.join(', ')}`);
        logger.debug(apiCourse);
        return 400;
    }
    course.instructors = instructors;

    if (apiCourse.name != undefined) {
        if (course.courseState != CourseState.CREATED) {
            logger.warn(`Field 'name' is not editable on submitted courses`);
            logger.debug(apiCourse);
            return 403;
        }
        if (apiCourse.name.length == 0 || apiCourse.name.length > 200) {
            logger.warn(`Invalid length of field 'name': ${apiCourse.name.length}`);
            logger.debug(apiCourse);
            return 400;
        }
        course.name = apiCourse.name;
    }

    if (apiCourse.outline != undefined) {
        if (course.courseState != CourseState.CREATED) {
            logger.warn(`Field 'outline' is not editable on submitted courses`);
            logger.debug(apiCourse);
            return 403;
        }
        if (apiCourse.outline.length == 0 || apiCourse.outline.length > 200) {
            logger.warn(`Invalid length of field 'outline': ${apiCourse.outline.length}`);
            logger.debug(apiCourse);
            return 400;
        }
        course.outline = apiCourse.outline;
    }

    if (apiCourse.description.length == 0 || apiCourse.description.length > 3000) {
        logger.warn(`Invalid length of field 'description': ${apiCourse.description.length}`);
        logger.debug(apiCourse);
        return 400;
    }
    course.description = apiCourse.description;

    if (apiCourse.category != undefined) {
        if (course.courseState != CourseState.CREATED) {
            logger.warn(`Field 'category' is not editable on submitted courses`);
            logger.debug(apiCourse);
            return 403;
        }
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
        tags = await entityManager.find(CourseTag, {where: filters});
        if (tags.length != apiCourse.tags.length) {
            logger.warn(`Field 'tags' contains invalid values: ${apiCourse.tags.join(', ')}`);
            logger.debug(apiCourse, tags);
            return 400;
        }
    }
    course.tags = tags;

    if (course.courseState != CourseState.CREATED && (apiCourse.submit != undefined || apiCourse.submit == false)) {
        logger.warn(`Field 'submit' is not editable on submitted courses`);
        logger.debug(apiCourse);
        return 403;
    }
    course.courseState = apiCourse.submit ? CourseState.SUBMITTED : CourseState.CREATED;

    try {
        await entityManager.save(Course, course);
        // todo add transaction log
        logger.info("Successfully edited course");

        return 204;
    } catch (e) {
        logger.error("Can't edit course: " + e.message);
        logger.debug(course, e);
        return 500;
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
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.body.instructors instanceof Array &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                typeof req.body.maxParticipants == 'number' &&
                typeof req.body.published == 'boolean' &&
                typeof req.body.joinAfterStart == 'boolean') {

                // Check if string array
                for (let i = 0; i < req.body.instructors.length; i++) {
                    if (typeof req.body.instructors[i] != 'string') {
                        status = 400;
                        logger.warn(`Instructor ID ${req.body.instructors[i]} is no string`);
                    }
                }

                if (status < 300) {
                    status = await putSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body);
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to add a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function putSubcourse(student: Student, courseId: number, subcourseId: number, apiSubcourse: ApiEditSubcourse): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to edit a subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to edit subcourse of non existent course (ID ${courseId})`);
        logger.debug(student, apiSubcourse);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
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
    const instructors = await entityManager.find(Student, {where: filters});
    if (instructors.length == 0 || instructors.length != apiSubcourse.instructors.length) {
        logger.warn(`Field 'instructors' contains invalid values: ${apiSubcourse.instructors.join(', ')}`);
        logger.debug(apiSubcourse);
        return 400;
    }
    subcourse.instructors = instructors;

    // Can't raise minGrade, when course is already published
    if (!Number.isInteger(apiSubcourse.minGrade) || apiSubcourse.minGrade < 1 || apiSubcourse.minGrade > 13
        || (subcourse.published && apiSubcourse.minGrade > subcourse.minGrade)) {
        logger.warn(`Field 'minGrade' contains an illegal value: ${apiSubcourse.minGrade}`);
        logger.debug(apiSubcourse);
        return 400;
    }

    // Can't lower maxGrade, when course is published
    if (!Number.isInteger(apiSubcourse.maxGrade) || apiSubcourse.maxGrade < 1 || apiSubcourse.maxGrade > 13
        || (subcourse.published && apiSubcourse.maxGrade < subcourse.maxGrade)) {
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

    // Can't lower maxParticipants when there are already more pupils participating
    if (!Number.isInteger(apiSubcourse.maxParticipants) || apiSubcourse.maxParticipants < 3 || apiSubcourse.maxParticipants > 100
        || apiSubcourse.maxParticipants < subcourse.participants.length) {
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
export async function putLectureHandler(req: Request, res: Response) {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.lecid != undefined &&
                typeof req.body.instructor == 'string' &&
                typeof req.body.start == 'number' &&
                typeof req.body.duration == 'number') {

                status = await putLecture(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), Number.parseInt(req.params.lecid, 10), req.body);

            } else {
                status = 400;
                logger.warn("Invalid request for PUT /course/:id/subcourse/:subid/lecture/:lecid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to edit a lecture");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function putLecture(student: Student, courseId: number, subcourseId: number, lectureId: number, apiLecture: ApiEditLecture): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to add a lecture, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to edit lecture of non-existent course (ID ${courseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
    if (subcourse == undefined) {
        logger.warn(`User tried to edit lecture of non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student, apiLecture);
        return 404;
    }

    const lecture = await entityManager.findOne(Lecture, {id: lectureId, subcourse: subcourse});
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

    // You can only create lectures that start at least in 2 days
    if (!Number.isInteger(apiLecture.start) || apiLecture.start * 1000 - (new Date()).getTime() < 2 * 86400000) {
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
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined) {
                status = await deleteCourse(res.locals.user, Number.parseInt(req.params.id, 10));
            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to cancel a course");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function deleteCourse(student: Student, courseId: number): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to cancel a course, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access right
    const course = await entityManager.findOne(Course, {id: courseId});
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
export async function deleteSubcourseHandler(req: Request, res: Response) {
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined && req.params.subid != undefined) {

                status = await deleteSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10));

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to cancel a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function deleteSubcourse(student: Student, courseId: number, subcourseId: number): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to cancel a subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to cancel subcourse of non existent course (ID ${courseId})`);
        logger.debug(student);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
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
export async function deleteLectureHandler(req: Request, res: Response) {
    let status: number;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.lecid != undefined) {

                status = await deleteLecture(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), Number.parseInt(req.params.lecid, 10));

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid/lecture/:lecid");
                logger.debug(req.params);
            }
        } else {
            status = 403;
            logger.warn("A non-student wants to delete a lecture");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function deleteLecture(student: Student, courseId: number, subcourseId: number, lectureId: number): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn(`Student (ID ${student.id}) tried to delete a lecture, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to delete a lecture of non-existent course (ID ${courseId})`);
        logger.debug(student);
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
    if (subcourse == undefined) {
        logger.warn(`User tried to delete a lecture of non-existent subcourse (ID ${subcourseId})`);
        logger.debug(student);
        return 404;
    }

    const lecture = await entityManager.findOne(Lecture, {id: lectureId, subcourse: subcourse});
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
export async function joinSubcourseHandler(req: Request, res: Response) {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {

                status = await joinSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);

            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse/:subid/participants");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to join a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function joinSubcourse(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

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
            const course = await em.findOneOrFail(Course, {id: courseId, courseState: CourseState.ALLOWED});
            const subcourse = await em.findOneOrFail(Subcourse, {id: subcourseId, course: course, published: true});

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
                if (startDate > subcourse.lectures[i].start.getTime())
                    startDate = subcourse.lectures[i].start.getTime();
            }
            if (startDate < (new Date()).getTime() && !subcourse.joinAfterStart) {
                logger.warn("Pupil can't join subcourse, because it has already started");
                logger.debug(subcourse);
                status = 409;
                return;
            }

            subcourse.participants.push(pupil);
            await em.save(Subcourse, subcourse);

            logger.info("Pupil successfully joined subcourse");
            // todo add transactionlog

        } catch (e) {
            logger.warn("Can't join subcourse");
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
export async function leaveSubcourseHandler(req: Request, res: Response) {
    let status: number;
    try {
        if (res.locals.user instanceof Pupil) {
            if (req.params.id != undefined &&
                req.params.subid != undefined &&
                req.params.userid != undefined) {

                status = await leaveSubcourse(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.params.userid);

            } else {
                status = 400;
                logger.warn("Invalid request for DELETE /course/:id/subcourse/:subid/participants/:userid");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-pupil wanted to leave a subcourse");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function leaveSubcourse(pupil: Pupil, courseId: number, subcourseId: number, userId: string): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

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
            const course = await em.findOneOrFail(Course, {id: courseId});
            const subcourse = await em.findOneOrFail(Subcourse, {id: subcourseId, course: course});

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
            // todo add transactionlog

        } catch (e) {
            logger.warn("Can't leave subcourse");
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
export async function groupMailHandler(req: Request, res: Response) {

    let status = 204;

    if (res.locals.user instanceof Student) {
        if (req.params.id != undefined
            && req.params.subid != undefined
            && typeof req.body.subject == "string"
            && typeof req.body.body == "string") {
            status = await groupMail(res.locals.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.subid, 10), req.body.subject, req.body.body);
        } else {
            logger.warn("Missing or invalid parameters for groupMailHandler");
            status = 400;
        }
    } else {
        logger.warn("Groupmail requested by Non-Student");
        status = 403;
    }

    res.status(status).end();
}

async function groupMail(student: Student, courseId: number, subcourseId: number, mailSubject: string, mailBody: string) {
    if (!student.isInstructor || await student.instructorScreeningStatus() != ScreeningStatus.Accepted) {
        logger.warn("Group mail requested by student who is no instructor or not instructor-screened");
        return 403;
    }

    const entityManager = getManager();
    const course = await entityManager.findOne(Course, {id: courseId});

    if (course == undefined) {
        logger.warn("Tried to send group mail to invalid course");
        return 404;
    }

    const subcourse = await entityManager.findOne(Subcourse, {id: subcourseId, course: course});
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
 * @api {POST} /course/:id/meeting/join JoinCourseMeeting
 * @apiVersion 1.1.0
 * @apiDescription
 * Joins the BBB-Meeting for a given course
 *
 * This endpoint allows joining the BBB-Meeting of a course.
 * If the user is the instructor of the course the Meeting gets created with this call.
 * The other participants can only join after the instructor created the meeting with this endpoint
 *
 * @apiName JoinCourseMeeting
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse Course
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/meeting/join
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function joinCourseMeetingHandler(req: Request, res: Response) {
    let courseId = req.body.courseId ? req.body.courseId : null;
    let ip = req.connection.remoteAddress ? req.connection.remoteAddress : null;
    let status = 200;
    let course: ApiCourse;
    let meeting: BBBMeeting;
    try {
        if (req.params.id != undefined) {
            let authenticatedStudent = false;
            let authenticatedPupil = false;
            if (res.locals.user instanceof Student) {
                authenticatedStudent = true;
            }
            if (res.locals.user instanceof Pupil) {
                authenticatedPupil = true;
            }
            try {

                if (authenticatedPupil || authenticatedStudent) {

                    if (authenticatedStudent) {
                        let user: Student = res.locals.user;

                        if (bbbMeetingCache.has(req.params.id)) {
                            meeting = bbbMeetingCache.get(req.params.id);
                            res.send({
                                url: meeting.moderatorUrl(`${user.firstname}+${user.lastname}`)
                            });
                        } else {

                            // todo this should get its own method and not use a method from some other route
                            let obj = await getCourse(
                                authenticatedStudent ? res.locals.user : undefined,
                                authenticatedPupil ? res.locals.user : undefined,
                                Number.parseInt(req.params.id, 10)
                            );
                            if (typeof obj == 'number') {
                                status = obj;
                            } else {
                                course = obj;
                                meeting = await createBBBMeeting(course.name, req.params.id);
                                res.send({
                                    url: meeting.moderatorUrl(`${user.firstname}+${user.lastname}`)
                                });
                            }
                        }

                    } else if (authenticatedPupil) {
                        let meetingIsRunning: boolean = await isBBBMeetingRunning(req.params.id);
                        if (bbbMeetingCache.has(req.params.id) && meetingIsRunning) {
                            let user: Pupil = res.locals.user;
                            meeting = bbbMeetingCache.get(req.params.id);
                            console.log(meeting.attendeeUrl(`${user.firstname}+${user.lastname}`));
                            res.send({
                                url: meeting.attendeeUrl(`${user.firstname}+${user.lastname}`)
                            });

                            // BBB logging
                            await createBBBlog(user, ip, courseId);

                        } else {
                            status = 400;
                            logger.error("BBB-Meeting has not startet yet");
                        }
                    }

                } else {
                    status = 403;
                    logger.warn("An unauthorized user wanted to join a BBB-Meeting");
                    logger.debug(res.locals.user);
                }

            } catch (e) {
                logger.error("An error occurred during GET /course/:id/meeting/join: " + e.message);
                logger.debug(req, e);
                status = 500;
            }
        } else {
            status = 400;
            logger.error("Expected id parameter on route");
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {GET} /course/:id/meeting getCourseMeeting
 * @apiVersion 1.1.0
 * @apiDescription
 * Get the BBB-Meeting for a given course
 *
 * This endpoint provides the BBB-Meeting of a course.
 *
 * @apiName GetCourseMeeting
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/<ID>/meeting
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCourseMeetingHandler(req: Request, res: Response) {
    let status = 200;
    let meeting: BBBMeeting;
    try {
        if (req.params.id != undefined) {
            if (res.locals.user instanceof Pupil || res.locals.user instanceof Student) {

                meeting = bbbMeetingCache.get(req.params.id);

                if (meeting) {
                    res.json(meeting);
                } else {
                    status = 400;
                    logger.error("No meeting was found for given id");
                }

            } else {
                status = 403;
                logger.warn("An unauthorized user requestes BBB-Meeting information");
                logger.debug(res.locals.user);
            }
        } else {
            status = 400;
            logger.error("Expected id parameter on route");
        }

    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {POST} /course/webhook getBBBWebhookCallback
 * @apiVersion 1.1.0
 * @apiDescription
 * Get callback of a webhook from bbb
 *
 * This endpoint provides the callback of a webhook from bbb.
 *
 * @apiName getBBBWebhookCallback
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/course/webhook
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getBBBWebhookCallback(req: Request, res: Response) {
    let status = 200;
    console.log('bbb webhook request body: ', req.body);
    res.status(status).end();
}
