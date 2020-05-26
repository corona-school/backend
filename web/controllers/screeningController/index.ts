import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import { ApiScreeningResult } from "../../../common/dto/ApiScreeningResult";
import { ScreenerDTO } from "../../../common/dto/ScreenerDTO";
import { StudentToScreen } from "../../../common/dto/StudentToScreen";
import { getScreenerByEmail, Screener } from "../../../common/entity/Screener";
import {
    Student,
    getStudentByEmail,
    getAllStudents,
} from "../../../common/entity/Student";
import { getTransactionLog } from "../../../common/transactionlog";
import AccessedByScreenerEvent from "../../../common/transactionlog/types/AccessedByScreenerEvent";
import UpdatedByScreenerEvent from "../../../common/transactionlog/types/UpdatedByScreenerEvent";
import { getLogger } from "log4js";
import { Screening } from "../../../common/entity/Screening";

const logger = getLogger();

/**
 * @api {GET} /student/
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
 * @api {GET} /student/:email
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
 * @api {PUT} /student/:email
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
 * @api {GET} /screener/:email/:includepassword
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
 * @api {POST} /screener/
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
 * @api {PUT} /screener/:email
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
