import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { Brackets, getManager } from 'typeorm';
import { Student } from '../../../common/entity/Student';
import {
    ApiAddCourse,
    ApiAddSubcourse,
    ApiCourse,
    ApiCourseTag,
    ApiInstructor,
    ApiLecture,
    ApiSubcourse
} from './format';
import { Course, CourseCategory, CourseState } from '../../../common/entity/Course';
import { getTransactionLog } from '../../../common/transactionlog';
import CreateCourseEvent from '../../../common/transactionlog/types/CreateCourseEvent';
import { CourseTag } from '../../../common/entity/CourseTag';
import { Subcourse } from '../../../common/entity/Subcourse';

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
        let authenticated = false;
        if (res.locals.user instanceof Student) {
            authenticated = true;
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

        try {
            let obj = await getCourses(authenticated ? res.locals.user : undefined, fields, states, instructorId);
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

async function getCourses(student: Student | undefined, fields: Array<string>, states: Array<string>, wix_id: string | undefined): Promise<Array<ApiCourse> | number> {
    const entityManager = getManager();

    let authenticated = false;
    if (student instanceof Student) {
        authenticated = true;
    }

    if (wix_id != undefined && !authenticated) {
        logger.warn(`Unauthenticated user tried to access courses created by instructor (ID: ${wix_id})`);
        return 401;
    }

    if (wix_id != undefined && authenticated && student.wix_id != wix_id) {
        logger.warn(`User (ID: ${student.wix_id}) tried to filter by instructor id ${wix_id}`);
        logger.debug(student, fields, states, wix_id);
        return 403;
    }

    if (states.length != 1 || states[0] != 'allowed') {
        if (!authenticated) {
            logger.warn(`Unauthenticated user tried to filter by states ${states.join(',')}`);
            return 401;
        } else if (wix_id == undefined) {
            logger.warn(`User (ID: ${student.wix_id}) tried to filter by states ${states.join(',')} without specifying an instructor id`);
            logger.debug(student, fields, states, wix_id);
            return 403;
        }
    }

    if (states.length == 0) {
        logger.warn("Request for /courses while filtering with states=(empty). This would never return any results");
        logger.debug(student, fields, states, wix_id);
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
                logger.debug(student, fields, states, wix_id);
                return 400;
        }
        stateFilters.push(state);
    }

    let apiCourses: Array<ApiCourse> = [];
    try {
        const qb = entityManager.getRepository(Course)
            .createQueryBuilder("course")
            .leftJoin("course.instructors", "instructor")
            .where("instructor.wix_id = :id", { id: student.wix_id });

        if (stateFilters.length > 0) {
            qb.andWhere(new Brackets(sub => {
                sub = sub.where("course.state = :state", { state: stateFilters.pop() });
                while (stateFilters.length > 0) {
                    sub = sub.orWhere("course.state = :state", { state: stateFilters.pop() });
                }
            }));
        }

        const courses = await qb.getMany();

        for (let i = 0; i < courses.length; i++) {
            let apiCourse: ApiCourse = {
                id: courses[i].id
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
                            if (authenticated && student.wix_id != wix_id) {
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
                        for (let k = 0; k < courses[i].subcourses.length; k++) {
                            let subcourse: ApiSubcourse = {
                                id: courses[i].subcourses[k].id,
                                minGrade: courses[i].subcourses[k].minGrade,
                                maxGrade: courses[i].subcourses[k].maxGrade,
                                maxParticipants: courses[i].subcourses[k].maxParticipants,
                                participants: courses[i].subcourses[k].participants.length,
                                instructors: [],
                                lectures: []
                            };
                            for (let l = 0; l < courses[i].subcourses[k].instructors.length; l++) {
                                let instructor: ApiInstructor = {
                                    firstname: courses[i].subcourses[k].instructors[l].firstname,
                                    lastname: courses[i].subcourses[k].instructors[l].lastname
                                };
                                if (authenticated && student.wix_id != wix_id) {
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
                                    start: courses[i].subcourses[k].lectures[l].start.getTime(),
                                    duration: courses[i].subcourses[k].lectures[l].duration
                                };
                                if (authenticated && student.wix_id != wix_id) {
                                    lecture.instructor.id = courses[i].subcourses[k].lectures[l].instructor.wix_id;
                                }
                                subcourse.lectures.push(lecture);
                            }
                            apiCourse.subcourses.push(subcourse);
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
            let authenticated = false;
            if (res.locals.user instanceof Student) {
                authenticated = true;
            }
            try {
                let obj = await getCourse(authenticated ? res.locals.user : undefined, Number.parseInt(req.params.id, 10));
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

async function getCourse(student: Student | undefined, course_id: number): Promise<ApiCourse | number> {
    const entityManager = getManager();

    let authenticated = false;
    let authorized = false;
    if (student instanceof Student) {
        authenticated = true;
    }

    let apiCourse: ApiCourse;
    try {
        const course = await entityManager.findOne(Course, { id: course_id });

        for (let i = 0; i < course.instructors.length; i++) {
            // We don't need to compare wix_id here
            if (student.id == course.instructors[i].id) {
                authorized = true;
            }
        }

        if (!authorized && course.courseState != CourseState.ALLOWED) {
            logger.error("Unauthorized user tried to access course of state " + course.courseState);
            logger.debug(student);
            return 403;
        }

        apiCourse = {
            id: course.id,
            instructors: [],
            name: course.name,
            outline: course.outline,
            description: course.description,
            image: course.imageUrl,
            category: course.category,
            tags: [],
            subcourses: []
        };

        if (authorized) {
            apiCourse.state = course.courseState;
        }

        for (let i = 0; i < course.instructors.length; i++) {
            if (authorized) {
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
            if (!authorized && !course.subcourses[i].published) continue;

            let subcourse: ApiSubcourse = {
                id: course.subcourses[i].id,
                instructors: [],
                minGrade: course.subcourses[i].minGrade,
                maxGrade: course.subcourses[i].maxGrade,
                maxParticipants: course.subcourses[i].maxParticipants,
                participants: course.subcourses[i].participants.length,
                lectures: [],
                cancelled: course.subcourses[i].cancelled
            };
            if (authorized) {
                subcourse.published = course.subcourses[i].published;
            }
            for (let j = 0; j < course.subcourses[i].instructors.length; j++) {
                if (authorized) {
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
                    start: course.subcourses[i].lectures[j].start.getTime(),
                    duration: course.subcourses[i].lectures[j].duration
                };
                if (authorized) {
                    lecture.instructor.id = course.subcourses[i].lectures[j].instructor.wix_id;
                }
                apiCourse.subcourses[i].lectures.push(lecture);
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
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postCourseHandler(req: Request, res: Response) {
    let status = 204;
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

    if (!student.isInstructor) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but is no instructor.`);
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
    const instructors = await entityManager.find(Student, { where: filters });
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
    const tags = await entityManager.find(CourseTag, { where: filters });
    if (tags.length != apiCourse.tags.length) {
        logger.warn(`Field 'tags' contains invalid values: ${apiCourse.instructors.join(', ')}`);
        logger.debug(apiCourse);
        return 400;
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
            id: course.id
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
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postSubcourseHandler(req: Request, res: Response) {
    let status = 204;
    try {
        if (res.locals.user instanceof Student) {
            if (req.params.id != undefined &&
                req.body.instructors instanceof Array &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                (req.body.maxParticipants == undefined || typeof req.body.maxParticipants == 'number') &&
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

    if (!student.isInstructor) {
        logger.warn(`Student (ID ${student.id}) tried to add an subcourse, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    // Check access rights
    const course = await entityManager.findOne(Course, {id: courseId});
    if (course == undefined) {
        logger.warn(`User tried to add subcourse to non existent course (ID ${courseId})`)
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
        logger.warn(`User tried to add subcourse, but has no access rights (ID ${courseId})`)
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
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
// todo implement

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
// todo implement

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
// todo implement

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
// todo implement


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
// todo implement

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
// todo implement

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
// todo implement
