import { NextFunction, Request, Response } from "express";
import { getManager, Like, ILike } from "typeorm";
import { ScreenerDTO } from "../../../common/dto/ScreenerDTO";
import { StudentInfoDTO } from "../../../common/dto/StudentInfoDTO";
import { getScreenerByEmail, Screener } from "../../../common/entity/Screener";
import { getAllStudents, getStudentByEmail, ScreeningStatus, Student } from "../../../common/entity/Student";
import { getTransactionLog } from "../../../common/transactionlog";
import AccessedByScreenerEvent from "../../../common/transactionlog/types/AccessedByScreenerEvent";
import UpdatedByScreenerEvent from "../../../common/transactionlog/types/UpdatedByScreenerEvent";
import { getLogger } from "log4js";
import {Course, CourseCategory} from "../../../common/entity/Course";
import { ApiCourseUpdate } from "../../../common/dto/ApiCourseUpdate";
import {Subcourse} from "../../../common/entity/Subcourse";
import {Lecture} from "../../../common/entity/Lecture";
import { StudentEditableInfoDTO } from "../../../common/dto/StudentEditableInfoDTO";
import { EnumReverseMappings } from "../../../common/util/enumReverseMapping";
import {CourseTag} from "../../../common/entity/CourseTag";
import {CourseTagDTO} from "../../../common/dto/CourseTagDTO";
import {createCourseTag} from "../../../common/util/createCourseTag";

const logger = getLogger();

/**
 * @api {GET} /student getStudents
 * @apiVersion 1.0.1
 * @apiDescription
 * Get a all students in the databse
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getStudents
 * @apiGroup Student
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/student/
 */
export async function getStudents(req: Request, res: Response, next: NextFunction) {
    const transactionLog = getTransactionLog();

    try {
        const students: Student[] = await getAllStudents(getManager());

        if (students?.length > 0) {
            res.json(students);
        } else {
            res.status(404).send("no student was found");
        }
    } catch (err) {
        next();
    }
}

/**
 * @api {GET} /student/:email getStudentByMail
 * @apiVersion 1.0.1
 * @apiDescription
 * Get a student by her/his email address
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getStudentByMail
 * @apiGroup Student
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/student/<EMAIL>
 *
 * @apiParam (URL Parameter) {string} email Student Email Address
 *
 *
 * @apiSuccessExample {json} Response Example
 * {
 *    "firstName": "Leon",
 *    "lastName": "Jackson",
 *    "email": "leon-jackson@t-online.de",
 *    "feedback": null,
 *    "phone": null,
 *    "newsletter": false,
 *    "msg": null,
 *    "university": null,
 *    "state": "other",
 *    "isUniversityStudent": true,
 *    "isTutor": true,
 *    "isInstructor": true,
 *    "isProjectCoach": false,
 *    "subjects": [
 *        {
 *            "name": "Englisch",
 *            "grade": {
 *                "min": 1,
 *                "max": 8
 *            }
 *        },
 *        {
 *            "name": "Spanisch",
 *            "grade": {
 *                "min": 6,
 *                "max": 10
 *            }
 *        }
 *    ],
 *    "projectFields": [],
 *    "screenings": {
 *        "tutor": {
 *            "verified": true,
 *            "comment": "🎉",
 *            "knowsCoronaSchoolFrom": "Internet"
 *        },
 *        "instructor": {
 *            "verified": true,
 *            "comment": "🎉",
 *            "knowsCoronaSchoolFrom": "Internet"
 *        },
 *        "projectCoach": {
 *            "verified": true,
 *            "comment": "🎉",
 *            "knowsCoronaSchoolFrom": "Instagram"
 *        }
 *    }
 * }
 *
 */
export async function getStudentByMailHandler(req: Request, res: Response, next: NextFunction) {
    const transactionLog = getTransactionLog();

    try {
        const student: Student | undefined = await getStudentByEmail(getManager(), req.params.email);

        if (student instanceof Student) {
            const studentToScreen: StudentInfoDTO = await StudentInfoDTO.buildFrom(student);
            res.json(studentToScreen);
            await transactionLog.log(new AccessedByScreenerEvent(student, "unknown")); // todo set screener to the name of the screener
        } else {
            res.status(404).send("no student with given email address found");
        }
    } catch (err) {
        next();
    }
}

/**
 * @api {PUT} /student/:email updateStudentByMailHandler
 * @apiVersion 1.0.1
 * @apiDescription
 * Update a student by her/his email address.
 *
 * Can be used to update most of the important settings (including the screenings) of a user.
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName updateStudentByMailHandler
 * @apiGroup Student
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/student/<EMAIL> -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} email Student Email Address
 * @apiParam (Body Parameter) {string} screenerEmail Screener's Email Address the change should be associated with
 *
 * @apiUse StudentEditableInfo
 *
 * @apiParamExample Example Body
 *
 * {
 *    "screenerEmail": "maxi-screening@example.org",
 *    "feedback": null,
 *    "phone": null,
 *    "newsletter": false,
 *    "msg": null,
 *    "university": null,
 *    "state": "nw",
 *    "isUniversityStudent": true,
 *    "isTutor": true,
 *    "isInstructor": true,
 *    "isProjectCoach": false,
 *    "subjects": [
 *        {
 *            "name": "Englisch",
 *            "grade": {
 *                "min": 1,
 *                "max": 8
 *            }
 *        },
 *        {
 *            "name": "Spanisch",
 *            "grade": {
 *                "min": 6,
 *                "max": 10
 *            }
 *        }
 *    ],
 *    "projectFields": [
 *        {
 *            "name": "Arbeitswelt",
 *            "min": 1,
 *            "max": 9
 *        }
 *    ],
 *    "screenings": {
 *        "tutor": {
 *            "verified": true,
 *            "comment": "🎉",
 *            "knowsCoronaSchoolFrom": "Internet"
 *        },
 *        "instructor": {
 *            "verified": true,
 *            "comment": "🎉",
 *            "knowsCoronaSchoolFrom": "Internet"
 *        }
 *    }
 * }
 *
 */
export async function updateStudentByMailHandler(req: Request, res: Response, next: NextFunction) {
    // SCREENER
    const screenerEmail = req.body.screenerEmail;
    if (typeof screenerEmail !== "string") {
        res.status(400).send("Missing/malformed screener who wants to perform the student update.");
    }

    const screener: Screener = await getScreenerByEmail(getManager(), screenerEmail);
    if (!screener) {
        res.status(404).send(`Screener with email ${screenerEmail} wasn't found for updating a student!`);
    }

    // STUDENT
    const student: Student = await getStudentByEmail(getManager(), req.params.email);
    if (!student) {
        res.status(404).send(`Student with email ${req.params.email} wasn't found...`);
        return;
    }

    const studentInfo: StudentEditableInfoDTO = Object.assign(new StudentEditableInfoDTO(), req.body);

    logger.info(`GOT REQUEST of screener ${screener.email} trying to update info of student ${student.email} with the following: ${JSON.stringify(studentInfo)}`);

    if (studentInfo.isValid()) {
        //save old state of student info
        const prevState = await StudentInfoDTO.buildFrom(student);

        //update student info
        await updateStudentInformation(student, studentInfo, screener);

        //get updated new student info
        const newState = await StudentInfoDTO.buildFrom(student);

        //save changes
        getManager().save(student);

        //update transaction log
        getTransactionLog().log(new UpdatedByScreenerEvent(student, screener.email, {prev: prevState, new: newState}));

        res.status(200).send("Student updated successfully!");
    }
    else {
        res.status(400).send("Given student info is invalid!");
    }
}


export async function updateStudentInformation(student: Student, info: StudentEditableInfoDTO, screener: Screener) {
    //update static fields on student
    student.email = info.email.toLowerCase();

    // -> roles
    student.isStudent = info.isTutor;
    student.isInstructor = info.isInstructor;
    student.isProjectCoach = info.isProjectCoach;

    // -> official
    student.moduleHours = info.official?.hours || null;
    student.module = info.official?.module || null;

    // -> remaining info
    student.isUniversityStudent = info.isUniversityStudent;
    student.jufoPastParticipationConfirmed = info.jufoPastParticipationConfirmed;
    student.hasJufoCertificate = info.hasJufoCertificate;
    student.wasJufoParticipant = info.wasJufoParticipant;
    student.jufoPastParticipationInfo = info.jufoPastParticipationInfo;
    student.state = EnumReverseMappings.State(info.state);
    student.university = info.university;
    student.msg = info.msg;
    student.newsletter = info.newsletter;
    student.phone = info.phone;
    student.feedback = info.feedback;

    // -> subjects
    student.setSubjectsFormatted(info.subjects);
    await student.setProjectFields(info.projectFields);

    // -> screenings (if corresponding screening is empty, this will remove the screening at all)
    // --> Tutor screening
    await student.setTutorScreeningResult(info.screenings.tutor, screener);
    // --> Instructor screening
    await student.setInstructorScreeningResult(info.screenings.instructor, screener);
    // --> Project Coach screening
    await student.setProjectCoachingScreeningResult(info.screenings.projectCoach, screener);
}

/**
 * @api {GET} /screener/:email/:includepassword getScreenerByMail
 * @apiVersion 1.0.1
 * @apiDescription
 * Get a screener by her/his email address, include or exclude password hash transmission with includepassword flag
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getScreenerByMail
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/screener/<EMAIL>/<true|false>
 *
 * @apiParam (URL Parameter) {string} email Screener's Email Address
 * @apiParam (URL Parameter) {string} includepassword Flag to include or exclude password hash from transmitted object
 */
export async function getScreenerByMailHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const screener: Screener | undefined = await getScreenerByEmail(getManager(), req.params.email);

        if (screener instanceof Screener) {
            const screenerDTO: ScreenerDTO = new ScreenerDTO(screener);
            if (!("true" === req.params.includepassword)) {
                screenerDTO.passwordHash = undefined;
            }
            res.json(screenerDTO);
        } else {
            res.status(404).send("no screener with given email address found");
        }
    } catch (err) {
        next();
    }
}

/**
 * @api {POST} /screener addScreener
 * @apiVersion 1.0.1
 * @apiDescription
 * Adds a screener
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName addScreener
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/screener/"
 *
 */
export async function addScreenerHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const screenerDTO: ScreenerDTO = new ScreenerDTO(req.body);
        if (screenerDTO.isValid()) {
            const screener: Screener = new Screener();
            await screener.addScreenerDTO(screenerDTO);
            await getManager().save(screener);
            res.status(200).end();
        } else {
            res.status(400).send("some necessary screener fields are missing");
        }
    } catch (err) {
        if (err.code == "23505") {
            res.status(400).send("a screener with this email address already exists");
        } else {
            logger.warn(err.message);
        }
        next();
    }
}

/**
 * @api {PUT} /screener/:email updateScreenerByMail
 * @apiVersion 1.0.1
 * @apiDescription
 * Update a screener by her/his email address
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName updateScreenerByMail
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/screener/<EMAIL>
 *
 * @apiParam (URL Parameter) {string} email Screener's Email Address
 */
export async function updateScreenerByMailHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const screener: Screener | undefined = await getScreenerByEmail(getManager(), req.params.email);

        if (screener instanceof Screener) {
            const screenerDTO: ScreenerDTO = new ScreenerDTO(req.body);
            if (screenerDTO.isValid()) {
                await screener.updateWithScreenerDTO(screenerDTO);
                await getManager().save(screener);
                res.status(200).end();
            } else {
                res.status(400).send("some necessary screener fields are missing");
            }
        } else {
            res.status(404).send("no screener with given email address found");
        }
    } catch (err) {
        if (err.code == "23505") {
            res.status(400).send("cannot change email address: a screener with this email address already exists");
        } else {
            logger.warn(err.message);
        }
        next();
    }
}

/**
 * @api {GET} /screening/courses getCourses
 * @apiVersion 1.0.1
 * @apiDescription
 *
 * Retrieves the first 20 courses that match the specified filters.
 *
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getCourses
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" [host]/api/screening/courses
 *
 * @apiParam (URL Query) {string|undefined} courseState the course state ("created", "submitted", "allowed", "denied", "cancelled")
 * @apiParam (URL Query) {string|undefined} search A query text to be searched in the title and description
 * @apiParam (URL Query) {string|undefined} page The page
 */
export async function getCourses(req: Request, res: Response) {
    try {
        const { courseState, search, page } = req.query;

        if ([undefined, "created", "submitted", "allowed", "denied", "cancelled"].indexOf(courseState) === -1)
            return res.status(400).send("invalid value for parameter 'state'");

        if (typeof search !== "undefined" && typeof search !== "string")
            return res.status(400).send("invalid value for parameter 'search', must be string.");

        if (page && (Number.isNaN(+page) || !Number.isInteger(+page)))
            return res.status(400).send("Invalid value for parameter 'page', must be integer.");

        const where = (courseState ? (search ? [
            { courseState, name: ILike(`%${search}%`) }, /* OR */
            { courseState, description: ILike(`%${search}%`) }
        ] : { courseState }) : (search ? [
            { name: ILike(`%${search}%`) }, /* OR */
            { description: ILike(`%${search}%`) }
        ] : {}));


        const courses = await getManager().find(Course, { where, take: 20, skip: (+page || 0) * 20 });

        if (!courses.length && search) {
            // In case the regular search does not match anything, we search for students with that name
            // Thus we avoid searching through all students in the regular case, but still support "find by student"
            const [firstname, lastname = ""] = search.split(" ");

            const student = await getManager().findOne(Student, {
                where: { firstname: ILike(`%${firstname}%`), lastname: ILike(`%${lastname}%`)},
                relations: ["courses"]
            });

            if (student) {
                courses.push(...student.courses);
            }
        }


        return res.json({ courses });
    } catch (error) {
        logger.warn("/screening/courses failed with", error.message);
        return res.status(500).send("internal server error");
    }
}

/**
 * @api {GET} /screening/courses/tags getCourseTags
 * @apiVersion 1.0.1
 * @apiDescription
 *
 * Retrieves all used course tags
 *
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getCourseTags
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" [host]/api/screening/courses/tags
 */
export async function getCourseTags(req: Request, res: Response) {
    try {
        const entityManager = getManager();

        const tags = await entityManager.find(CourseTag, {
            relations: ["courses"]
        });

        const apiResponse = tags.map(t => new CourseTagDTO(t));

        return res.json(apiResponse);
    } catch (error) {
        logger.warn("GET /screening/courses/tags failed with ", error.message);
        return res.status(500);
    }
}

/**
 * @api {POST} /screening/courses/tags/create createCourseTag
 * @apiVersion 1.0.1
 * @apiDescription
 * Adds a course tag
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName createCourseTag
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiParam (URL Query) {string} name The name of the new course tag
 * @apiParam (URL Query) {string} category The category of the new tag
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/courses/tags/create"
 *
 */
export async function postCreateCourseTag(req: Request, res: Response) {
    try {
        const { name, category } = req.query;

        if (typeof name !== "string") {
            return res.status(400).send("Invalid value for query parameter 'name'");
        }

        if (!Object.values(CourseCategory).includes(category)) {
            return res.status(400).send("Invalid value for query parameter 'category'");
        }

        const tag = await createCourseTag(name, category);

        await getManager().save(CourseTag, tag);

        return res.json(tag);
    } catch (error) {
        logger.warn("POST /screening/courses/tags/create failed with ", error.message);
        return res.status(500);
    }
}

/**
 * @api {POST} /screening/course/:courseID/update updateCourse
 * @apiVersion 1.0.1
 * @apiDescription
 *
 * Updates a course
 *
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName updateCourse
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" [host]/api/screening/course/id/update
 *
 * @apiParam (JSON Body) {string|undefined} courseState the course state ("allowed", "denied", "cancelled") to update
 * @apiParam (JSON Body) {string|undefined} name the new name
 * @apiParam (JSON Body) {string|undefined} description the new description
 * @apiParam (JSON Body) {string|undefined} outline the new outline
 * @apiParam (JSON Body) {string|undefined} category the new category ("revision", "club", "coaching")
 * @apiParam (JSON Body) {Object[]|undefined} tags the new course tags, items must have either identifier (string) or name (string) as property
 * @apiParam (JSON Body) {string|null|undefined} imageUrl the new image url, or null if no image should be set
 * @apiParam (JSON Body) {Object[]|undefined} instructors the instructor ids of this course
 * @apiParam (JSON Body) {number|undefined} instructors.id the instructor ids of this course
 * @apiParam (JSON Body) {Object[]|undefined} newLectures the new lectures of this course after the update
 * @apiParam (JSON Body) {Object[]|undefined} removeLectures the lectures that should be removed from the course
 */
export async function updateCourse(req: Request, res: Response) {
    try {
        const update = new ApiCourseUpdate(req.body);
        const { newLectures, removeLectures, tags } = req.body;
        const { id } = req.params;
        if (typeof id !== "string" || !Number.isInteger(+id))
            return res.status(400).send("Invalid course id!");
        if (!update.isValid())
            return res.status(400).send("Invalid course update!");

        if (removeLectures !== undefined) {
            if (Array.isArray(removeLectures) && removeLectures.every(l => Number.isInteger(l.id))) {
                const status = await handleDeleteLectures(removeLectures);
                if (status != 204) {
                    return res.status(status).send("Deleting lecture failed.");
                }
            } else {
                return res.status(400).send("Invalid delete lecture request!");
            }
        }

        if (newLectures !== undefined) {
            if (Array.isArray(newLectures) && newLectures.every(l => (Number.isInteger(l.subcourse.id) && !!Date.parse(l.start) && Number.isInteger(l.duration) && Number.isInteger(l.instructor.id)))) {
                const status = await handleNewLectures(newLectures, +id);
                if (status != 200) {
                    return res.status(status).send("Adding lectures failed.");
                }
            } else {
                return res.status(400).send("Invalid new lectures request.");
            }
        }

        if (tags !== undefined) {
            if (Array.isArray(tags) && (tags.every(t => (typeof t.identifier === "string" || typeof t.name === "string")))){
                const status = await handleUpdateCourseTags(tags, +id);
                if (status != 200) {
                    return res.status(status).send("Updating course tags failed");
                }
            } else {
                return res.send(400).send("Invalid update course tags request");
            }
        }

        const course = await getManager().findOne(Course, { where: { id: +id } });

        if (!course)
            return res.status(404).send("Course not found");

        await course.updateCourse(update);
        await getManager().save(course);

        return res.json({ course });
    } catch (error) {
        logger.warn("/screening/course/../update failed with", error);
        return res.status(500).send("internal server error");
    }
}

async function handleNewLectures(lectures: { subcourse: { id: number }, start: Date, duration: number, instructor: { id: number } }[], courseId: number) {
    const entityManager = getManager();

    for (let lecture of lectures){
        const course = await entityManager.findOne(Course, { id: courseId });
        if (course == undefined) {
            logger.warn(`No course found with ID ${courseId}`);
            return 404;
        }
        const subcourse = await entityManager.findOne(Subcourse, { id: lecture.subcourse.id, course: course });
        if (subcourse == undefined) {
            logger.warn(`No subcourse found with ID ${lecture.subcourse.id}`);
            return 404;
        }

        try {
            await subcourse.addLecture(lecture);
            await entityManager.save(subcourse);
        } catch (error) {
            logger.warn("Saving lecture failed with", error);
            return 500;
        }
    }
    return 200;
}

async function handleDeleteLectures(lectures: { id: number }[]) {
    const entityManager = getManager();

    for (const lecture of lectures) {
        const lectureObject = await entityManager.findOne(Lecture, { id: lecture.id });
        if (lectureObject == undefined) {
            logger.warn(`Lecture with ID ${lecture.id} was not found.`);
            return 404;
        }

        try {
            await entityManager.remove(Lecture, lectureObject);
            logger.info("Successfully deleted lecture.");
        } catch (error) {
            logger.warn("Deleting lecture failed with", error);
            return 500;
        }
    }
    return 204;
}

async function handleUpdateCourseTags(courseTags: { identifier?: string, name?: string }[], courseId: number){
    const course = await getManager().findOne(Course, { where: { id: courseId }});

    try {
        await course.updateTags(courseTags);
        await getManager().save(course);
        logger.info("Successfully updated course tags");
    } catch (error) {
        logger.warn("Updating course tags failed with ", error.message);
        return 500;
    }

    return 200;
}

/**
 * @api {GET} /screening/instructors getInstructors
 * @apiVersion 1.0.1
 * @apiDescription
 *
 * Retrieves the first 20 courses that match the specified filters.
 *
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName getInstructors
 * @apiGroup Screener
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" [host]/api/screening/instructors
 *
 * @apiParam (URL Query) {string} screeningStatus get instructors with a certain screeningStatus
 * @apiParam (URL Query) {string} search fuzzy search inside the instructors name and email, supporting Postgres ILIKE syntax
 */
export async function getInstructors(req: Request, res: Response) {
    try {
        let { screeningStatus, search } = req.query;

        if ([ScreeningStatus.Accepted, ScreeningStatus.Rejected, ScreeningStatus.Unscreened].indexOf(screeningStatus) === -1)
            return res.status(400).send("invalid value for parameter 'screeningStatus'");

        if (typeof search !== "string")
            return res.status(400).send("invalid value for parameter 'search'");

        search = `%${search}%`; // fuzzy search

        let instructors: {}[];

        if (screeningStatus === ScreeningStatus.Accepted) {
            instructors = await getManager()
                .createQueryBuilder(Student, "student")
                .leftJoinAndSelect("student.instructorScreening", "instructor_screening")
                .where("student.isInstructor = true AND instructor_screening.success = true AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        } else if (screeningStatus === ScreeningStatus.Rejected) {
            instructors = await getManager()
                .createQueryBuilder(Student, "student")
                .leftJoinAndSelect("student.instructorScreening", "instructor_screening")
                .where("student.isInstructor = true AND instructor_screening.success = false AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        } else if (screeningStatus === ScreeningStatus.Unscreened) {
            instructors = await getManager()
                .createQueryBuilder(Student, "student")
                .leftJoinAndSelect("student.instructorScreening", "instructor_screening")
                .where("student.isInstructor = true AND instructor_screening.success is NULL AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        }


        return res.json({ instructors });
    } catch (error) {
        logger.warn("/screening/instructors failed with", error.message);
        return res.status(500).send("internal server error");
    }
}
