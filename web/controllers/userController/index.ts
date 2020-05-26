import { getLogger } from "log4js";
import { getManager, ObjectType } from "typeorm";
import { Request, Response } from "express";
import {
    ApiGetUser,
    ApiMatch,
    ApiPutUser,
    ApiSubject,
    checkName,
    checkSubject,
} from "./format";
import { Student } from "../../../common/entity/Student";
import { Pupil } from "../../../common/entity/Pupil";
import { Person } from "../../../common/entity/Person";
import { Match } from "../../../common/entity/Match";
import { dissolveMatch } from "../matchController";
import { getTransactionLog } from "../../../common/transactionlog";
import UpdatePersonalEvent from "../../../common/transactionlog/types/UpdatePersonalEvent";
import UpdateSubjectsEvent from "../../../common/transactionlog/types/UpdateSubjectsEvent";
import DeActivateEvent from "../../../common/transactionlog/types/DeActivateEvent";

const logger = getLogger();

/**
 * @api {GET} /user getCurrentUser
 * @apiDescription
 * Get data about the currently authenticated user.
 *
 *
 * This endpoint returns all available information about the current user.
 * It can be used, when the id of the current user is not known.
 * It is equivalent to execute <code>GET /user/:id</code> using the id of the current user.
 *
 * @apiName getCurrentUser
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/user
 *
 * @apiUse User
 * @apiUse Subject
 * @apiUse Match
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 */
export async function getSelfHandler(req: Request, res: Response) {
    if (res.locals.user instanceof Person) {
        req.params.id = res.locals.user.wix_id;
    }

    await getHandler(req, res);
}

/**
 * @api {GET} /user/:id getUser
 * @apiDescription
 * Get data about an user.
 *
 *
 * This endpoint returns all available information about the specified user.
 * The user has to be authenticated using his id and can only view his own information.
 *
 * @apiName getUser
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/user/<ID>
 *
 * @apiUse User
 * @apiUse Subject
 * @apiUse Match
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 */
export async function getHandler(req: Request, res: Response) {
    let status;

    try {
        if (req.params.id != undefined && res.locals.user instanceof Person) {
            try {
                let obj = await get(req.params.id, res.locals.user);
                if (obj != null) {
                    res.json(obj);
                    status = 200;
                } else {
                    status = 403;
                }
            } catch (e) {
                logger.warn("Error during GET /user: " + e.message);
                logger.debug(e);
                status = 500;
            }
        } else {
            status = 500;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {PUT} /user/:id putUser
 * @apiDescription
 * Set personal data of the user.
 *
 * This endpoint allows editing some of the personal information of the specified user.
 * The user has to be authenticated and can only edit his own information.
 *
 * @apiName putUser
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/user/<ID>/personal -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserPersonal
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function putHandler(req: Request, res: Response) {
    let status;

    try {
        let b = req.body;
        if (
            typeof b.firstname == "string" &&
            typeof b.lastname == "string" &&
            (b.grade == undefined || typeof b.grade == "number") &&
            (b.matchesRequested == undefined ||
                typeof b.matchesRequested == "number")
        ) {
            if (
                req.params.id != undefined &&
                res.locals.user instanceof Person
            ) {
                try {
                    status = await putPersonal(
                        req.params.id,
                        b,
                        res.locals.user
                    );
                } catch (e) {
                    logger.warn("Error PUT /user: " + e.message);
                    logger.debug(e);
                    status = 500;
                }
            } else {
                status = 500;
            }
        } else {
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {PUT} /user/:id/subjects putUserSubjects
 * @apiDescription
 * Set the subjects of the user.
 *
 * This endpoint allows editing of the user subjects. Please be aware, that
 * students and pupils have different subject formats
 * The user has to be authenticated and can only edit his own subjects.
 *
 * @apiName putUserSubjects
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://dashboard.corona-school.de/api/user/<ID>/subjects -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserSubjects
 * @apiUse Subject
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function putSubjectsHandler(req: Request, res: Response) {
    let status = 204;
    try {
        let b = req.body;
        // Check if array is valid
        let subjects = [];
        if (!(b instanceof Array)) {
            logger.error("Invalid format for subjects: Expected array");
            logger.debug(b);
            status = 400;
        } else {
            let subjectType = 0; // Short type
            if (
                b.length > 0 &&
                b[0].minGrade != undefined &&
                b[0].maxGrade != undefined
            )
                subjectType = 1; // Long Type

            for (let i = 0; i < b.length; i++) {
                let elem = b[i];
                if (subjectType == 0) {
                    if (
                        typeof elem.name == "string" &&
                        checkSubject(elem.name)
                    ) {
                        let subject = new ApiSubject();
                        subject.name = elem.name;
                        subjects.push(subject);
                    } else {
                        logger.error(
                            "Invalid format for shortType subjects: Missing or wrongly typed properties in ",
                            elem
                        );
                        logger.debug("Index " + i, b);
                        status = 400;
                        break;
                    }
                } else {
                    if (
                        typeof elem.name == "string" &&
                        typeof elem.minGrade == "number" &&
                        typeof elem.maxGrade == "number" &&
                        elem.minGrade >= 1 &&
                        elem.minGrade <= 13 &&
                        elem.minGrade <= elem.maxGrade &&
                        elem.maxGrade >= 1 &&
                        elem.maxGrade <= 13 &&
                        checkSubject(elem.name)
                    ) {
                        let subject = new ApiSubject();
                        subject.name = elem.name;
                        subject.minGrade = elem.minGrade;
                        subject.maxGrade = elem.maxGrade;
                        subjects.push(subject);
                    } else {
                        logger.error(
                            "Invalid format for longType subjects: Missing or wrongly typed properties in ",
                            elem
                        );
                        logger.debug("Index " + i, b);
                        status = 400;
                        break;
                    }
                }
            }
        }

        if (
            status < 300 &&
            req.params.id != undefined &&
            res.locals.user instanceof Person
        ) {
            try {
                status = await putSubjects(req.params.id, b, res.locals.user);
            } catch (e) {
                logger.warn("Error PUT /user/subjects: " + e.message);
                logger.debug(e);
                status = 500;
            }
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {PUT} /user/:id/active/:active putUserActive
 * @apiDescription
 * Set the active status of the user.
 *
 * <b>Active</b>: This means the user will get new matches regularly<br/>
 * <b>Inactive:</b> This means all existing matches will be dissolved and the user won't get any new matches.
 *
 * The user has to be authenticated and can only edit his own subjects.
 *
 * @apiName putUserActive
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://dashboard.corona-school.de/api/user/<ID>/active/<ACTIVE>
 *
 * @apiParam (URL Parameter) {string} id User Id
 * @apiParam (URL Parameter) {string} active Either <code>"true"</code> or <code>"false"</code>
 *
 * @apiUse UserSubjects
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function putActiveHandler(req: Request, res: Response) {
    let status = 204;

    try {
        if (
            req.params.id != undefined &&
            req.params.active != undefined &&
            res.locals.user instanceof Person
        ) {
            try {
                let active: boolean;
                if (req.params.active == "true") {
                    active = true;
                } else if (req.params.active == "false") {
                    active = false;
                } else {
                    logger.warn(
                        "Invalid parameter :active for PUT /user/active: " +
                            req.params.active
                    );
                    status = 400;
                }

                if (status < 300) {
                    status = await putActive(
                        req.params.id,
                        active,
                        res.locals.user
                    );
                }
            } catch (e) {
                logger.warn("Error during GET /user: " + e.message);
                logger.debug(e);
                status = 500;
            }
        } else {
            status = 500;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function get(
    wix_id: string,
    person: Pupil | Student
): Promise<ApiGetUser> {
    const entityManager = getManager();

    if (person == null) {
        logger.error("getUser() returned null");
        return null;
    }
    if (person.wix_id != wix_id) {
        logger.warn(
            "Person with id " +
                person.wix_id +
                " tried to access data from id " +
                wix_id
        );
        return null;
    }

    let apiResponse = new ApiGetUser();
    apiResponse.id = person.wix_id;
    apiResponse.firstname = person.firstname;
    apiResponse.lastname = person.lastname;
    apiResponse.email = person.email;
    apiResponse.active = person.active;

    if (person instanceof Student) {
        apiResponse.type = "student";
        apiResponse.screeningStatus = await person.screeningStatus();
        apiResponse.matchesRequested =
            person.openMatchRequestCount <= 2
                ? person.openMatchRequestCount
                : 2; // todo support for legacy values
        apiResponse.matches = [];
        apiResponse.subjects = convertSubjects(JSON.parse(person.subjects));

        let matches = await entityManager.find(Match, {
            student: person,
            dissolved: false,
        });
        for (let i = 0; i < matches.length; i++) {
            let apiMatch = new ApiMatch();
            apiMatch.firstname = matches[i].pupil.firstname;
            apiMatch.lastname = matches[i].pupil.lastname;
            apiMatch.email = matches[i].pupil.email;
            apiMatch.grade = Number.parseInt(matches[i].pupil.grade);
            apiMatch.subjects = subjectsToStringArray(
                JSON.parse(matches[i].pupil.subjects)
            );
            apiMatch.uuid = matches[i].uuid;
            apiMatch.jitsilink =
                "https://meet.jit.si/CoronaSchool-" + matches[i].uuid;

            apiResponse.matches.push(apiMatch);
        }
    } else if (person instanceof Pupil) {
        apiResponse.type = "pupil";
        apiResponse.grade = parseInt(person.grade);
        apiResponse.matchesRequested =
            person.openMatchRequestCount <= 1
                ? person.openMatchRequestCount
                : 1;
        apiResponse.matches = [];
        apiResponse.subjects = convertSubjects(
            JSON.parse(person.subjects),
            false
        );

        let matches = await entityManager.find(Match, {
            pupil: person,
            dissolved: false,
        });
        for (let i = 0; i < matches.length; i++) {
            let apiMatch = new ApiMatch();
            apiMatch.firstname = matches[i].student.firstname;
            apiMatch.lastname = matches[i].student.lastname;
            apiMatch.email = matches[i].student.email;
            apiMatch.subjects = subjectsToStringArray(
                JSON.parse(matches[i].student.subjects)
            );
            apiMatch.uuid = matches[i].uuid;
            apiMatch.jitsilink =
                "https://meet.jit.si/CoronaSchool-" + matches[i].uuid;

            apiResponse.matches.push(apiMatch);
        }
    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return null;
    }

    logger.debug("Sending apiResponse ", apiResponse);
    return apiResponse;
}

async function putPersonal(
    wix_id: string,
    req: ApiPutUser,
    person: Pupil | Student
): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn(
            "Person with id " +
                person.wix_id +
                "tried to access data from id " +
                wix_id
        );
        return 403;
    }

    const oldPerson = Object.assign({}, person);

    person.firstname = req.firstname.trim();
    person.lastname = req.lastname.trim();

    if (!checkName(person.firstname) || !checkName(person.lastname)) {
        logger.warn(
            "Invalid names: " + person.firstname + " / " + person.lastname
        );
    }

    let type: ObjectType<Person>;
    if (person instanceof Student) {
        // Check if number of requested matches is valid
        let matchCount = await entityManager.count(Match, {student: person, dissolved: false});
        if (req.matchesRequested > 3 || req.matchesRequested < 0 || !Number.isInteger(req.matchesRequested) || req.matchesRequested + matchCount > 6) {
            logger.warn("User (with " + matchCount + " matches) wants to set invalid number of matches requested: " + req.matchesRequested);
            return 400;
        }

        person.openMatchRequestCount = req.matchesRequested;
        type = Student;
    } else if (person instanceof Pupil) {
        // Check if number of requested matches is valid
        let matchCount = await entityManager.count(Match, {
            pupil: person,
            dissolved: false,
        });
        if (
            req.matchesRequested > 1 ||
            req.matchesRequested < 0 ||
            !Number.isInteger(req.matchesRequested) ||
            req.matchesRequested + matchCount > 1
        ) {
            logger.warn(
                "User (with " +
                    matchCount +
                    " matches) wants to set invalid number of matches requested: " +
                    req.matchesRequested
            );
            return 400;
        }

        person.openMatchRequestCount = req.matchesRequested;

        if (req.grade) {
            //todo: advanced checks...
            person.grade = req.grade + ". Klasse";
        } else {
            logger.warn(
                "User who is a pupil wants to set a grade of null or undefined! It is ignored."
            );
        }

        type = Pupil;
    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    try {
        await entityManager.save(type, person);
        await transactionLog.log(new UpdatePersonalEvent(person, oldPerson));
        logger.info(
            `Updated user ${person.firstname} ${person.lastname} (ID ${
                person.wix_id
            }, Type ${type.toString()}`
        );
        logger.debug(person);
    } catch (e) {
        logger.error("Can't update user: " + e.message);
        logger.debug(person, e);
        return 400;
    }

    return 204;
}

async function putSubjects(
    wix_id: string,
    req: ApiSubject[],
    person: Pupil | Student
): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn(
            "Person with id " +
                person.wix_id +
                "tried to access data from id " +
                wix_id
        );
        return 403;
    }

    const oldPerson = Object.assign({}, person);

    let type: ObjectType<Person>;
    if (person instanceof Student) {
        type = Student;
    } else if (person instanceof Pupil) {
        type = Pupil;
    } else {
        logger.error("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    person.subjects = JSON.stringify(req);

    try {
        await entityManager.save(type, person);
        await transactionLog.log(
            new UpdateSubjectsEvent(person, JSON.parse(oldPerson.subjects))
        );
    } catch (e) {
        logger.error("Can't update " + type.toString() + ": " + e.message);
        logger.debug(person, e);
    }

    return 204;
}

async function putActive(
    wix_id: string,
    active: boolean,
    person: Pupil | Student
): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn(
            "Person with id " +
                person.wix_id +
                " tried to access data from id " +
                wix_id
        );
        return 403;
    }

    let type: ObjectType<Person>;
    if (person instanceof Student) {
        type = Student;
    } else if (person instanceof Pupil) {
        type = Pupil;
    } else {
        logger.error("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    try {
        if (active && !person.active) {
            // Activate if deactivated
            logger.info(
                "Activating person " + person.firstname + " " + person.lastname
            );
            person.active = true;

            await entityManager.save(type, person);
            await transactionLog.log(new DeActivateEvent(person, true));
        } else if (!active && person.active) {
            // Deactivate if active
            logger.info(
                "Deactivating person " +
                    person.firstname +
                    " " +
                    person.lastname
            );

            // Step 1: Dissolve all matches
            let options;
            if (type == Student) {
                options = {
                    student: person,
                    dissolved: false,
                };
            } else {
                options = {
                    pupil: person,
                    dissolved: false,
                };
            }
            let matches = await entityManager.find(Match, options);
            for (let i = 0; i < matches.length; i++) {
                await dissolveMatch(matches[i], 0, person);
            }

            // Step 2: Deactivate
            person.active = false;

            await entityManager.save(type, person);
            await transactionLog.log(new DeActivateEvent(person, false));
        }
    } catch (e) {
        logger.error(
            "Can't " + (active ? "" : "de") + "activate user: " + e.message
        );
        logger.debug(person, e);
        return 500;
    }

    return 204;
}

// Support for legacy formats
function convertSubjects(
    oldSubjects: Array<any>,
    longtype: boolean = true
): ApiSubject[] {
    let subjects = [];
    for (let i = 0; i < oldSubjects.length; i++) {
        if (typeof oldSubjects[i] == "string") {
            let s = new ApiSubject();
            s.name = oldSubjects[i].replace(/[1234567890:]+$/g, "");
            if (longtype) {
                let matches = oldSubjects[i].match(
                    /([0-9]{1,2}):([0-9]{1,2})$/
                );
                if (matches instanceof Array && matches.length >= 3) {
                    s.minGrade = +matches[1];
                    s.maxGrade = +matches[2];
                } else {
                    s.minGrade = 1;
                    s.maxGrade = 13;
                }
            }
            subjects.push(s);
        } else {
            subjects.push(oldSubjects[i]);
        }
    }
    return subjects;
}

function subjectsToStringArray(subjects: Array<any>): string[] {
    const stringSubjects = [];
    for (let i = 0; i < subjects.length; i++) {
        if (typeof subjects[i] == "string") {
            stringSubjects.push(subjects[i].replace(/[1234567890:]+$/g, ""));
        } else if (
            typeof subjects[i] == "object" &&
            subjects[i].name != undefined
        ) {
            stringSubjects.push(subjects[i].name);
        }
    }
    return stringSubjects;
}
