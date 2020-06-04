import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { getManager } from 'typeorm';
import { Student } from '../../../common/entity/Student';
import { ApiAddCourse, ApiCourse } from './format';
import { Course, CourseState } from '../../../common/entity/Course';
import { getTransactionLog } from '../../../common/transactionlog';
import CreateCourseEvent from '../../../common/transactionlog/types/CreateCourseEvent';

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
 * @apiParam (Query Parameter) {string} fields <em>(optional)</em> Comma seperated list of additionally requested fields (<code>id</code> will be always included). Example: <code>fields=name,outline,category,startDate</code>
 * @apiParam (Query Parameter) {string} states <em>(optional, Default: <code>allowed</code>) Comma seperated list of possible states of the course. Requires the <code>instructor</code> parameter to be set.
 * @apiParam (Query Parameter) {string} instructor <em>(optional)</em> Id of an instructor. Return only courses by this instructor. This parameter requires authentication as the specified instructor.
 *
 * @apiUse Courses
 * @apiUse Course
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET "https://dashboard.corona-school.de/api/courses?fields=name,outline,category,startDate"
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getHandler(req: Request, res: Response) {
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
            let obj = await get(authenticated ? res.locals.user : undefined, fields, states, instructorId);
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

async function get(student: Student | undefined, fields: Array<string>, states: Array<string>, wix_id: string | undefined): Promise<Array<ApiCourse> | number> {
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
    let filters = [];
    for (let i = 0; i < states.length; i++) {
        let filter: {
            state?: CourseState;
            instructor?: Student;
        } = {};
        switch (states[i]) {
            case 'created':
                filter.state = CourseState.CREATED;
                break;
            case 'submitted':
                filter.state = CourseState.SUBMITTED;
                break;
            case 'allowed':
                filter.state = CourseState.ALLOWED;
                break;
            case 'denied':
                filter.state = CourseState.DENIED;
                break;
            case 'cancelled':
                filter.state = CourseState.CANCELLED;
                break;
            default:
                logger.warn("Unknown state: " + states[i]);
                logger.debug(student, fields, states, wix_id);
                return 400;
        }
        if (wix_id != undefined) {
            filter.instructor = student;
        }
        filters.push(filter);
    }

    let apiCourses: Array<ApiCourse> = [];
    try {
        const courses = await entityManager.find(Course, { where: filters, relations: ['instructor'] });

        for (let i = 0; i < courses.length; i++) {
            let apiCourse: ApiCourse = {
                id: courses[i].id
            };
            for (let j = 0; j < fields.length; j++) {
                switch (fields[j].toLowerCase()) {
                    case 'id':
                        break;
                    case 'instructor':
                        apiCourse.instructor = courses[i].instructor.firstname + " " + courses[i].instructor.lastname;
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
                    case 'motivation':
                        apiCourse.motivation = courses[i].motivation;
                        break;
                    case 'image':
                        apiCourse.image = courses[i].imageUrl;
                        break;
                    case 'mingrade':
                        apiCourse.minGrade = courses[i].minGrade;
                        break;
                    case 'maxgrade':
                        apiCourse.maxGrade = courses[i].maxGrade;
                        break;
                    case 'maxparticipants':
                        apiCourse.maxParticipants = courses[i].maxParticipants;
                        break;
                    case 'category':
                        apiCourse.category = courses[i].categoryId.toString();
                        break;
                    case 'joinafterstart':
                        apiCourse.joinAfterStart = courses[i].joinAfterStart;
                        break;
                    case 'startdate':
                        apiCourse.startDate = courses[i].startDate.getTime();
                        break;
                    case 'duration':
                        apiCourse.duration = courses[i].duration;
                        break;
                    case 'frequency':
                        apiCourse.frequency = courses[i].frequency;
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
        logger.debug(e, filters);
        return 500;
    }

    return apiCourses;
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
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/course -d "<REQUEST>"
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
            if (typeof req.body.name == 'string' &&
                typeof req.body.outline == 'string' &&
                typeof req.body.description == 'string' &&
                typeof req.body.motivation == 'string' &&
                typeof req.body.minGrade == 'number' &&
                typeof req.body.maxGrade == 'number' &&
                typeof req.body.maxParticipants == 'number' &&
                typeof req.body.category == 'string' &&
                typeof req.body.joinAfterStart == 'boolean' &&
                typeof req.body.startDate == 'number' &&
                typeof req.body.duration == 'number' &&
                typeof req.body.frequency == 'number' &&
                typeof req.body.submit == 'boolean') {

                const ret = await post(res.locals.user, req.body);
                if (typeof ret == 'number') {
                    status = ret;
                } else {
                    res.json(ret);
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

async function post(student: Student, apiCourse: ApiAddCourse): Promise<ApiCourse | number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (!student.isInstructor) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but is no instructor.`);
        logger.debug(student);
        return 403;
    }

    let coursesByInstructor = await entityManager.count(Course, { instructor: student });
    if (coursesByInstructor >= 3) {
        logger.warn(`Student (ID ${student.id}) tried to add an course, but already owns 3 other courses`);
        logger.debug(student);
        return 403;
    }

    // Some generous checks
    if (apiCourse.name.length == 0 || apiCourse.name.length > 200) {
        logger.warn(`Invalid length of field 'name': ${apiCourse.name.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.outline.length == 0 || apiCourse.outline.length > 300) {
        logger.warn(`Invalid length of field 'outline': ${apiCourse.outline.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.description.length == 0 || apiCourse.description.length > 2000) {
        logger.warn(`Invalid length of field 'description': ${apiCourse.description.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.motivation.length == 0 || apiCourse.motivation.length > 2000) {
        logger.warn(`Invalid length of field 'motivation': ${apiCourse.motivation.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.maxGrade < 1 || apiCourse.maxGrade > 13 || !Number.isInteger(apiCourse.maxGrade)) {
        logger.warn(`Invalid value of field 'minGrade': ${apiCourse.maxGrade}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.maxGrade < 1 || apiCourse.maxGrade > 13 || !Number.isInteger(apiCourse.maxGrade)) {
        logger.warn(`Invalid value of field 'maxGrade': ${apiCourse.maxGrade}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.maxGrade < apiCourse.minGrade) {
        logger.warn(`Invalid values: Field 'maxGrade' may not be smaller than field 'minGrade'`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.maxParticipants < 2 || apiCourse.maxParticipants > 50 || !Number.isInteger(apiCourse.maxParticipants)) {
        logger.warn(`Invalid value of field 'maxParticipants': ${apiCourse.maxParticipants}`);
        logger.debug(apiCourse);
        return 400;
    }

    let categoryId = 0;
    if (apiCourse.category) {
        // todo waiting for category list
        logger.warn(`Invalid length of field 'name': ${apiCourse.category.length}`);
        logger.debug(apiCourse);
        return 400;
    }

    // You can't create courses starting in the past or starting in less than a day
    if (!Number.isInteger(apiCourse.startDate) || apiCourse.startDate < (new Date()).getTime() + 86400) {
        logger.warn(`Invalid value of field 'startDate': ${apiCourse.startDate}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.duration < 1 || apiCourse.duration > 50 || !Number.isInteger(apiCourse.duration)) {
        logger.warn(`Invalid value of field 'duration': ${apiCourse.duration}`);
        logger.debug(apiCourse);
        return 400;
    }

    if (apiCourse.frequency < 0 || apiCourse.frequency > 30 || !Number.isInteger(apiCourse.frequency)) {
        logger.warn(`Invalid value of field 'frequency': ${apiCourse.frequency}`);
        logger.debug(apiCourse);
        return 400;
    }

    const course = new Course();
    course.instructor = student;
    course.name = apiCourse.name;
    course.outline = apiCourse.outline;
    course.description = apiCourse.description;
    course.motivation = apiCourse.motivation;
    course.requirements = "";
    course.imageUrl = null;
    course.minGrade = apiCourse.minGrade;
    course.maxGrade = apiCourse.maxGrade;
    course.maxParticipants = apiCourse.maxParticipants;
    course.categoryId = categoryId;
    course.joinAfterStart = apiCourse.joinAfterStart;
    course.startDate = new Date(apiCourse.startDate);
    course.duration = apiCourse.duration;
    course.frequency = apiCourse.frequency;
    course.courseState = apiCourse.submit ? CourseState.SUBMITTED : CourseState.CREATED;

    try {
        await entityManager.save(Course, course);
        await transactionLog.log(new CreateCourseEvent(student, course));
        logger.info("Successfully saved new course");

        // todo check if typeorm sets the id
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
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/course/<ID>
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

/**
 * @api {PUT} /course/:id EditCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Edit a course.
 *
 * This endpoint allows editing an existing course.
 * Only an instructor is allowed to edit his own courses.
 * There are some constraints on the editability of fields.
 *
 * @apiName EditCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/course/<ID> -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */

/**
 * @api {DELETE} /course/:id CancelCourse
 * @apiVersion 1.1.0
 * @apiDescription
 * Cancel a course.
 *
 * This endpoint allows cancelling a course, which means that all planned subcourses will be cancelled.
 * Furthermore the registered participants will be notified and the course won't appear in the public register anymore.
 *
 * @apiName CancelCourse
 * @apiGroup Courses
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X DELETE -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/course/<ID>
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
