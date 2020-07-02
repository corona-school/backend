import { NextFunction, Request, Response } from "express";
import { getManager, Like, createQueryBuilder, getConnection } from "typeorm";
import { ApiScreeningResult } from "../../../common/dto/ApiScreeningResult";
import { ScreenerDTO } from "../../../common/dto/ScreenerDTO";
import { StudentToScreen } from "../../../common/dto/StudentToScreen";
import { getScreenerByEmail, Screener } from "../../../common/entity/Screener";
import {
    Student,
    getStudentByEmail,
    getAllStudents,
    ScreeningStatus
} from "../../../common/entity/Student";
import { getTransactionLog } from "../../../common/transactionlog";
import AccessedByScreenerEvent from "../../../common/transactionlog/types/AccessedByScreenerEvent";
import UpdatedByScreenerEvent from "../../../common/transactionlog/types/UpdatedByScreenerEvent";
import { getLogger } from "log4js";
import { Screening } from "../../../common/entity/Screening";
import { Course } from "../../../common/entity/Course";
import { ApiCourseUpdate } from "../../../common/dto/ApiCourseUpdate";

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
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/student/
 */
export async function getStudents(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/student/<EMAIL>
 *
 * @apiParam (URL Parameter) {string} email Student Email Address
 */
export async function getStudentByMailHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const transactionLog = getTransactionLog();

    try {
        const student: Student | undefined = await getStudentByEmail(
            getManager(),
            req.params.email
        );

        if (student instanceof Student) {
            const screening: Screening = await student.screening;
            const studentToScreen: StudentToScreen = new StudentToScreen(
                student,
                screening
            );
            res.json(studentToScreen);
            await transactionLog.log(
                new AccessedByScreenerEvent(student, "unknown")
            ); // todo set screener to the name of the screener
        } else {
            res.status(404).send("no student with given email address found");
        }
    } catch (err) {
        next();
    }
}

/**
 * @api {PUT} /student/:email updateStudentWithScreeningResult
 * @apiVersion 1.0.1
 * @apiDescription
 * Update a student by her/his email address
 *
 * Only screeners with a valid token in the request header can use the API.
 *
 * @apiName updateStudentWithScreeningResult
 * @apiGroup Student
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/student/<EMAIL> -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} email Student Email Address
 *
 * @apiUse ScreeningResult
 */
export async function updateStudentWithScreeningResultHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const transactionLog = getTransactionLog();

    try {
        const screenedStudent: Student = await getStudentByEmail(
            getManager(),
            req.params.email
        );
        if (screenedStudent instanceof Student) {
            const screeningResult: ApiScreeningResult = new ApiScreeningResult(
                req.body
            );
            if (screeningResult.isValid()) {
                await screenedStudent.addScreeningResult(screeningResult);
                await getManager().save(screenedStudent);
                await transactionLog.log(
                    new UpdatedByScreenerEvent(screenedStudent, "unknown")
                ); // todo set screener to the name of the screener

                res.status(200).end();
            } else {
                res.status(400).send(
                    "the necessary screening results are missing"
                );
            }
        } else {
            res.status(404).send("no student with given email address found");
        }
    } catch (err) {
        next();
    }
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
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/screener/<EMAIL>/<true|false>
 *
 * @apiParam (URL Parameter) {string} email Screener's Email Address
 * @apiParam (URL Parameter) {string} includepassword Flag to include or exclude password hash from transmitted object
 */
export async function getScreenerByMailHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const screener: Screener | undefined = await getScreenerByEmail(
            getManager(),
            req.params.email
        );

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
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/screener/"
 *
 */
export async function addScreenerHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const screenerDTO: ScreenerDTO = new ScreenerDTO(req.body);
        if (screenerDTO.isValid()) {
            const screener: Screener = new Screener();
            screener.addScreenerDTO(screenerDTO);
            await getManager().save(screener);
            res.status(200).end();
        } else {
            res.status(400).send("some necessary screener fields are missing");
        }
    } catch (err) {
        if (err.code == "23505") {
            res.status(400).send(
                "a screener with this email address already exists"
            );
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
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/screener/<EMAIL>
 *
 * @apiParam (URL Parameter) {string} email Screener's Email Address
 */
export async function updateScreenerByMailHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const screener: Screener | undefined = await getScreenerByEmail(
            getManager(),
            req.params.email
        );

        if (screener instanceof Screener) {
            const screenerDTO: ScreenerDTO = new ScreenerDTO(req.body);
            if (screenerDTO.isValid()) {
                screener.updateWithScreenerDTO(screenerDTO);
                await getManager().save(screener);
                res.status(200).end();
            } else {
                res.status(400).send(
                    "some necessary screener fields are missing"
                );
            }
        } else {
            res.status(404).send("no screener with given email address found");
        }
    } catch (err) {
        if (err.code == "23505") {
            res.status(400).send(
                "cannot change email address: a screener with this email address already exists"
            );
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
 */
export async function getCourses(req: Request, res: Response) {
    try {
        const { courseState, search } = req.query;

        if ([undefined, "created", "submitted", "allowed", "denied", "cancelled"].indexOf(courseState) === -1)
            return res.status(400).send("invalid value for parameter 'state'");

        if (typeof search !== "undefined" && typeof search !== "string")
            return res.status(400).send("invalid value for parameter 'search', must be string.");

        const where = (courseState
            ? (search
                ? [{ courseState, name: Like(`%${search}%`) }, /* OR */ { courseState, description: Like(`%${search}%`) }]
                : { courseState })
            : (search
                ? [{ name: Like(`%${search}%`) }, /* OR */ { description: Like(`%${search}%`) }]
                : {})
        );

        const courses = await getManager().find(Course, {
            where,
            take: 20,
        });

        return res.json({ courses });
    } catch (error) {
        logger.warn("/screening/courses failed with", error.message);
        return res.status(500).send("internal server error");
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
 * @apiParam (JSON Body) {string|null|undefined} imageUrl the new image url, or null if no image should be set 
 */
export async function updateCourse(req: Request, res: Response) {
    try {
        const update = new ApiCourseUpdate(req.body);
        const { id } = req.params;

        if (typeof id !== "string" || !Number.isInteger(+id))
            return res.status(400).send("Invalid course id!");
        if (!update.isValid())
            return res.status(400).send("Invalid course update!");

        const course = await getManager().findOne(Course, { where: { id: +id } });

        if (!course)
            return res.status(404).send("Course not found");

        course.updateCourse(update);
        await getManager().save(course);

        return res.json({ course });
    } catch (error) {
        logger.warn("/screening/course/../update failed with", error);
        return res.status(500).send("internal server error");
    }
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
 * @apiParam (URL Query) {string} search fuzzy search inside the instructors name and email
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
                .createQueryBuilder(Student,"student")
                .leftJoinAndSelect("student.screening", "screening")
                .where("student.isInstructor = true AND screening.success = true AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        } else if (screeningStatus === ScreeningStatus.Rejected) {
            instructors = await getManager()
                .createQueryBuilder(Student, "student")
                .leftJoinAndSelect("student.screening", "screening")
                .where("student.isInstructor = true AND screening.success = false AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        } else if (screeningStatus === ScreeningStatus.Unscreened) {
            instructors = await getManager()
                .createQueryBuilder(Student,"student")
                .leftJoinAndSelect("student.screening", "screening")
                .where("student.isInstructor = true AND screening.success is NULL AND (student.email ILIKE :search OR student.lastname ILIKE :search)", { search })
                .take(20)
                .getMany();
        }


        return res.json({ instructors });
    } catch (error) {
        logger.warn("/screening/instructors failed with", error.message);
        return res.status(500).send("internal server error");
    }
}
/**
 * @api {POST} /screening/instructor/:instructorID/update updateInstructor
 * @apiVersion 1.0.1
 * @apiDescription
 *
 * Updates an instructor
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
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" [host]/api/screening/instructor/id/update
 *
 * @apiParam (JSON Body) {boolean} isStudent the instructors can also be students at the same time
 * @apiParam (JSON Body) {boolean} verified wether the instructor gets verified
 * @apiParam (JSON Body) {string|undefined} phone sets the instructors phone number
 * @apiParam (JSON Body) {Date|undefined} birthday sets the instructors birthday
 * @apiParam (JSON Body) {string|undefined} commentScreener adds a comment to the screening
 * @apiParam (JSON Body) {string|undefined} knowscsfrom
 * @apiParam (JSON Body) {string|undefined} screenerEmail
 * @apiParam (JSON Body) {string|undefined} subjects
 * @apiParam (JSON Body) {string|undefined} feedback
 */
export async function updateInstructor(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { isStudent } = req.body;
        const screeningResult = new ApiScreeningResult(req.body);

        if (typeof id !== "string" || !Number.isInteger(+id))
            return res.status(400).send("Invalid instructor id!");

        if (!screeningResult.isValid() || !(isStudent === true || isStudent === false))
            return res.status(400).send("Invalid instructor update!");

        const instructor = await getManager().findOne(Student, { where: { id: +id, isInstructor: true } });

        if (!instructor)
            return res.status(404).send("Instructor not found");

        await instructor.addScreeningResult(screeningResult);

        instructor.isStudent = isStudent;

        await getManager().save(Student, instructor);

        return res.json({ instructor });
    } catch (error) {
        logger.warn("/screening/course/../update failed with", error);
        return res.status(500).send("internal server error");
    }
}