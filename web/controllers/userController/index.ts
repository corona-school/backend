import { getLogger } from "log4js";
import { getManager, ObjectType } from "typeorm";
import { Request, Response } from "express";
import {
    ApiGetUser,
    ApiMatch,
    ApiProjectFieldInfo,
    ApiPutUser,
    ApiSubject,
    ApiSubjectStudent,
    ApiUserRoleInstructor,
    checkName,
    checkSubject
} from "./format";
import { ScreeningStatus, Student, TeacherModule } from "../../../common/entity/Student";
import { Pupil } from "../../../common/entity/Pupil";
import { Person } from "../../../common/entity/Person";
import { Match } from "../../../common/entity/Match";
import { dissolveMatch } from "../matchController";
import { getTransactionLog } from "../../../common/transactionlog";
import UpdatePersonalEvent from "../../../common/transactionlog/types/UpdatePersonalEvent";
import UpdateSubjectsEvent from "../../../common/transactionlog/types/UpdateSubjectsEvent";
import DeActivateEvent from "../../../common/transactionlog/types/DeActivateEvent";
import { sendFirstScreeningInvitationToInstructor } from "../../../common/administration/screening/initial-invitations";
import { State } from "../../../common/entity/State";
import { EnumReverseMappings } from "../../../common/util/enumReverseMapping";
import * as moment from "moment-timezone";

const logger = getLogger();

/**
 * @api {GET} /user getCurrentUser
 * @apiVersion 1.1.0
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
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user
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
 * @apiVersion 1.1.0
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
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>
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
 * @apiVersion 1.1.0
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
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/user/<ID>/personal -d "<REQUEST>"
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
        if (typeof b.firstname == "string" &&
            typeof b.lastname == "string" &&
            (b.grade == undefined || typeof b.grade == "number") &&
            (b.matchesRequested == undefined || typeof b.matchesRequested == "number")) {
            if (req.params.id != undefined && res.locals.user instanceof Person) {
                try {
                    status = await putPersonal(req.params.id, b, res.locals.user);
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
 * @apiVersion 1.1.0
 * @apiDescription
 * Set the subjects of the user.
 *
 * This endpoint allows editing of the user subjects. Please be aware, that
 * students and pupils have different subject formats.
 * The user has to be authenticated and can only edit his own subjects.
 *
 * Adding subjects to a participant or instructor automatically makes them tutee or tutor.
 *
 * @apiName putUserSubjects
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/user/<ID>/subjects -d "<REQUEST>"
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
            if (b.length > 0 && b[0].minGrade != undefined && b[0].maxGrade != undefined)
                subjectType = 1; // Long Type

            for (let i = 0; i < b.length; i++) {
                let elem = b[i];
                if (subjectType == 0) {
                    if (typeof elem.name == "string" && checkSubject(elem.name)
                    ) {
                        let subject = new ApiSubject();
                        subject.name = elem.name;
                        subjects.push(subject);
                    } else {
                        logger.error("Invalid format for shortType subjects: Missing or wrongly typed properties in ", elem);
                        logger.debug("Index " + i, b);
                        status = 400;
                        break;
                    }
                } else if (typeof elem.name == "string" &&
                    typeof elem.minGrade == "number" &&
                    typeof elem.maxGrade == "number" &&
                    elem.minGrade >= 1 &&
                    elem.minGrade <= 13 &&
                    elem.minGrade <= elem.maxGrade &&
                    elem.maxGrade >= 1 &&
                    elem.maxGrade <= 13 &&
                    checkSubject(elem.name)) {

                    let subject = new ApiSubject();
                    subject.name = elem.name;
                    subject.minGrade = elem.minGrade;
                    subject.maxGrade = elem.maxGrade;
                    subjects.push(subject);

                } else {
                    logger.error("Invalid format for longType subjects: Missing or wrongly typed properties in ", elem);
                    logger.debug("Index " + i, b);
                    status = 400;
                    break;
                }
            }
        }

        if (status < 300 && req.params.id != undefined && res.locals.user instanceof Person) {
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
 * @apiVersion 1.1.0
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
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>/active/<ACTIVE>
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
        if (req.params.id != undefined &&
            req.params.active != undefined &&
            res.locals.user instanceof Person) {
            try {

                let active: boolean;
                if (req.params.active == "true") {
                    active = true;
                } else if (req.params.active == "false") {
                    active = false;
                } else {
                    logger.warn("Invalid parameter :active for PUT /user/active: " + req.params.active);
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


async function get(wix_id: string, person: Pupil | Student): Promise<ApiGetUser> {
    const entityManager = getManager();

    if (person == null) {
        logger.error("getUser() returned null");
        return null;
    }
    if (person.wix_id != wix_id) {
        logger.warn("Person with id " + person.wix_id + " tried to access data from id " + wix_id);
        return null;
    }

    let apiResponse = new ApiGetUser();
    apiResponse.id = person.wix_id;
    apiResponse.firstname = person.firstname;
    apiResponse.lastname = person.lastname;
    apiResponse.email = person.email;
    apiResponse.active = person.active;
    apiResponse.registrationDate = moment(person.wix_creation_date).unix();

    if (person instanceof Student) {
        apiResponse.type = "student";
        apiResponse.isTutor = person.isStudent;
        apiResponse.isInstructor = person.isInstructor;
        apiResponse.isProjectCoach = person.isProjectCoach;
        apiResponse.screeningStatus = await person.screeningStatus();
        apiResponse.instructorScreeningStatus = await person.instructorScreeningStatus();
        apiResponse.projectCoachingScreeningStatus = await person.projectCoachingScreeningStatus();
        apiResponse.matchesRequested = person.openMatchRequestCount <= 3 ? person.openMatchRequestCount : 3;
        apiResponse.matches = [];
        apiResponse.dissolvedMatches = [];
        apiResponse.subjects = convertSubjects(JSON.parse(person.subjects));
        apiResponse.projectFields = (await person.projectFields).map(pf => Object.assign(new ApiProjectFieldInfo(), {name: pf.projectField, min: pf.min, max: pf.max}));
        apiResponse.university = person.university;
        apiResponse.state = person.state;
        apiResponse.lastUpdatedSettingsViaBlocker = moment(person.lastUpdatedSettingsViaBlocker).unix();

        let matches = await entityManager.find(Match, {
            student: person,
            dissolved: false
        });
        let dissolvedMatches = await entityManager.find(Match, {
            student: person,
            dissolved: true
        });
        for (let i = 0; i < matches.length; i++) {
            let apiMatch = new ApiMatch();
            apiMatch.firstname = matches[i].pupil.firstname;
            apiMatch.lastname = matches[i].pupil.lastname;
            apiMatch.email = matches[i].pupil.email;
            apiMatch.grade = Number.parseInt(matches[i].pupil.grade);
            apiMatch.subjects = subjectsToStringArray(JSON.parse(matches[i].pupil.subjects));
            apiMatch.uuid = matches[i].uuid;
            apiMatch.jitsilink = "https://meet.jit.si/CoronaSchool-" + matches[i].uuid;
            apiMatch.date = matches[i].createdAt.getTime();

            apiResponse.matches.push(apiMatch);
        }
        for (let i = 0; i < dissolvedMatches.length; i++) {
            let apiMatch = new ApiMatch();
            apiMatch.firstname = dissolvedMatches[i].pupil.firstname;
            apiMatch.lastname = dissolvedMatches[i].pupil.lastname;
            apiMatch.email = dissolvedMatches[i].pupil.email;
            apiMatch.grade = Number.parseInt(dissolvedMatches[i].pupil.grade);
            apiMatch.subjects = subjectsToStringArray(
                JSON.parse(dissolvedMatches[i].pupil.subjects)
            );
            apiMatch.uuid = dissolvedMatches[i].uuid;
            apiMatch.jitsilink = "https://meet.jit.si/CoronaSchool-" + dissolvedMatches[i].uuid;
            apiMatch.date = dissolvedMatches[i].createdAt.getTime();

            apiResponse.dissolvedMatches.push(apiMatch);
        }
    } else if (person instanceof Pupil) {
        apiResponse.type = "pupil";
        apiResponse.isPupil = person.isPupil;
        apiResponse.isParticipant = person.isParticipant;
        apiResponse.isProjectCoachee = person.isProjectMentee;
        apiResponse.grade = parseInt(person.grade);
        apiResponse.matchesRequested = person.openMatchRequestCount <= 1 ? person.openMatchRequestCount : 1;
        apiResponse.matches = [];
        apiResponse.dissolvedMatches = [];
        apiResponse.subjects = toPupilSubjectFormat(convertSubjects(JSON.parse(person.subjects), false)); //if the subjects contain grade information, it should be stripped off
        apiResponse.projectFields = person.projectFields.map(pf => Object.assign(new ApiProjectFieldInfo(), {name: pf}));
        apiResponse.state = person.state;
        apiResponse.schoolType = person.schooltype;
        apiResponse.lastUpdatedSettingsViaBlocker = moment(person.lastUpdatedSettingsViaBlocker).unix();

        let matches = await entityManager.find(Match, {
            pupil: person,
            dissolved: false
        });
        let dissolvedMatches = await entityManager.find(Match, {
            pupil: person,
            dissolved: true
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
            apiMatch.jitsilink = "https://meet.jit.si/CoronaSchool-" + matches[i].uuid;
            apiMatch.date = matches[i].createdAt.getTime();

            apiResponse.matches.push(apiMatch);
        }
        for (let i = 0; i < dissolvedMatches.length; i++) {
            let apiMatch = new ApiMatch();
            apiMatch.firstname = dissolvedMatches[i].student.firstname;
            apiMatch.lastname = dissolvedMatches[i].student.lastname;
            apiMatch.email = dissolvedMatches[i].student.email;
            apiMatch.subjects = subjectsToStringArray(
                JSON.parse(dissolvedMatches[i].student.subjects)
            );
            apiMatch.uuid = dissolvedMatches[i].uuid;
            apiMatch.jitsilink = "https://meet.jit.si/CoronaSchool-" + dissolvedMatches[i].uuid;
            apiMatch.date = dissolvedMatches[i].createdAt.getTime();

            apiResponse.dissolvedMatches.push(apiMatch);
        }
    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return null;
    }

    logger.debug("Sending apiResponse ", apiResponse);
    return apiResponse;
}

async function putPersonal(wix_id: string, req: ApiPutUser, person: Pupil | Student): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn("Person with id " + person.wix_id + "tried to access data from id " + wix_id);
        return 403;
    }

    const oldPerson = Object.assign({}, person);

    person.firstname = req.firstname.trim();
    person.lastname = req.lastname.trim();

    if (!checkName(person.firstname) || !checkName(person.lastname)) {
        logger.warn("Invalid names: " + person.firstname + " / " + person.lastname);
    }

    let type: ObjectType<Person>;
    if (person instanceof Student) {
        type = Student;
        // ++++ OPEN MATCH REQUEST COUNT ++++
        // Check if number of requested matches is valid
        let matchCount = await entityManager.count(Match, { student: person, dissolved: false });
        if (req.matchesRequested > 3 || req.matchesRequested < 0 || !Number.isInteger(req.matchesRequested) || req.matchesRequested + matchCount > 6
            || (req.matchesRequested > 1 && await person.screeningStatus() != ScreeningStatus.Accepted && await person.instructorScreeningStatus() != ScreeningStatus.Accepted)) {
            logger.warn("User (with " + matchCount + " matches) wants to set invalid number of matches requested: " + req.matchesRequested);
            return 400;
        }

        person.openMatchRequestCount = req.matchesRequested;

        // ++++ UNIVERSITY ++++
        person.university = req.university;

        // ++++ STATE ++++
        if (req.state) {
            const state = EnumReverseMappings.State(req.state);
            if (!state) {
                logger.warn(`User wants to set an invalid value "${req.state}" for state`);
                return 400;
            }
            person.state = state;
        }

        // ++++ LAST UPDATED SETTINGS VIA BLOCKER ++++
        if (req.lastUpdatedSettingsViaBlocker) {
            person.lastUpdatedSettingsViaBlocker = moment.unix(req.lastUpdatedSettingsViaBlocker).toDate();
        }
        else {
            person.lastUpdatedSettingsViaBlocker = null;
        }
    } else if (person instanceof Pupil) {
        type = Pupil;

        // ++++ OPEN MATCH REQUEST COUNT ++++
        // Check if number of requested matches is valid
        let matchCount = await entityManager.count(Match, {
            pupil: person,
            dissolved: false
        });
        if (req.matchesRequested > 1 ||
            req.matchesRequested < 0 ||
            !Number.isInteger(req.matchesRequested) ||
            req.matchesRequested + matchCount > 1) {

            logger.warn("User (with " + matchCount + " matches) wants to set invalid number of matches requested: " + req.matchesRequested);
            return 400;
        }

        person.openMatchRequestCount = req.matchesRequested;

        // ++++ GRADE ++++
        if (Number.isInteger(req.grade) && req.grade >= 1 && req.grade <= 13) {
            person.grade = req.grade + ". Klasse";
        } else {
            logger.warn("User who is a pupil wants to set an invalid grade! It is ignored.");
        }

        // ++++ SCHOOL TYPE ++++
        if (req.schoolType) {
            const schoolType = EnumReverseMappings.SchoolType(req.schoolType);
            if (!schoolType) {
                logger.warn(`User wants to set an invalid value "${req.schoolType}" for schoolType`);
                return 400;
            }
            person.schooltype = schoolType;
        }

        // ++++ STATE ++++
        if (req.state) {
            const state = EnumReverseMappings.State(req.state);
            if (!state) {
                logger.warn(`User wants to set an invalid value "${req.state}" for state`);
                return 400;
            }
            person.state = state;
        }

        // ++++ LAST UPDATED SETTINGS VIA BLOCKER ++++
        if (req.lastUpdatedSettingsViaBlocker) {
            person.lastUpdatedSettingsViaBlocker = moment.unix(req.lastUpdatedSettingsViaBlocker).toDate();
        }
        else {
            person.lastUpdatedSettingsViaBlocker = null;
        }
    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    try {
        await entityManager.save(type, person);
        await transactionLog.log(new UpdatePersonalEvent(person, oldPerson));
        logger.info(`Updated user ${person.firstname} ${person.lastname} (ID ${person.wix_id}, Type ${type.toString()}`);
        logger.debug(person);
    } catch (e) {
        logger.error("Can't update user: " + e.message);
        logger.debug(person, e);
        return 400;
    }

    return 204;
}

async function putSubjects(wix_id: string, req: ApiSubject[], person: Pupil | Student): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn("Person with id " + person.wix_id + "tried to access data from id " + wix_id);
        return 403;
    }

    const oldPerson = Object.assign({}, person);

    let type: ObjectType<Person>;
    if (person instanceof Student) {

        type = Student;
        if (!person.isStudent)
            person.isStudent = true;

    } else if (person instanceof Pupil) {

        type = Pupil;
        if (!person.isPupil)
            person.isPupil = true;

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

async function putActive(wix_id: string, active: boolean, person: Pupil | Student): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (person == null) {
        logger.error("getUser() returned null");
        return 500;
    }
    if (person.wix_id != wix_id) {
        logger.warn("Person with id " + person.wix_id + " tried to access data from id " + wix_id);
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
            logger.info("Activating person " + person.firstname + " " + person.lastname);
            person.active = true;

            await entityManager.save(type, person);
            await transactionLog.log(new DeActivateEvent(person, true));
        } else if (!active && person.active) {
            // Deactivate if active
            logger.info("Deactivating person " + person.firstname + " " + person.lastname);

            // Step 1: Dissolve all matches
            let options;
            if (type == Student) {
                options = {
                    student: person,
                    dissolved: false
                };
            } else {
                options = {
                    pupil: person,
                    dissolved: false
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
        logger.error("Can't " + (active ? "" : "de") + "activate user: " + e.message);
        logger.debug(person, e);
        return 500;
    }

    return 204;
}

// Support for legacy formats
function convertSubjects(oldSubjects: Array<any>, longtype: boolean = true): ApiSubject[] {
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

function toPupilSubjectFormat(subjects: {name: string, minGrade?: number, maxGrade?: number}[]): {name: string}[] {
    return subjects.map(v => {
        return {
            name: v.name
        };
    });
}

/**
 * @api {POST} /user/:id/role/instructor postUserRoleInstructor
 * @apiVersion 1.1.0
 * @apiDescription
 * Add the instructor role to the current user.
 *
 * The user has to be authenticated.
 *
 * @apiName postUserRoleInstructor
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>/role/instructor
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserRoleInstructor
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function postUserRoleInstructorHandler(req: Request, res: Response) {
    let status = 204;
    if (res.locals.user instanceof Student &&
        req.params.id != undefined &&
        typeof req.body.isOfficial == 'boolean' &&
        typeof req.body.msg == 'string') {

        if (req.body.isOfficial) {
            if (typeof req.body.university !== 'string' ||
                typeof req.body.module !== 'string' ||
                typeof req.body.hours !== 'number') {
                status = 400;
                logger.error("Tutor registration with isOfficial has incomplete/invalid parameters");
            }
        }

        if (status < 300) {
            status = await postUserRoleInstructor(req.params.id, res.locals.user, req.body);
        } else {
            logger.error("Malformed parameters in optional fields for Instructor role change");
            status = 400;
        }
    } else {
        logger.error("Malfored required parameters for Instructor role change");
        status = 400;
    }

    res.status(status).end();
}

async function postUserRoleInstructor(wixId: string, student: Student, apiInstructor: ApiUserRoleInstructor): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn("Person with id " + student.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (student.isInstructor) {
        logger.warn("Current user is already an instructor");
        return 400;
    }

    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    student.isInstructor = true;

    if (apiInstructor.isOfficial) {
        if (apiInstructor.university.length == 0 || apiInstructor.university.length > 100) {
            logger.warn("apiInstructor.university outside of length restrictions");
            return 400;
        }

        if (apiInstructor.hours == 0 || apiInstructor.hours > 1000) {
            logger.warn("apiInstructor.hours outside of size restrictions");
            return 400;
        }

        if (apiInstructor.msg.length > 3000) {
            logger.warn("apiInstructor.msg outside of length restrictions");
            return 400;
        }

        switch (apiInstructor.state) {
            case "bw":
                student.state = State.BW;
                break;
            case "by":
                student.state = State.BY;
                break;
            case "be":
                student.state = State.BE;
                break;
            case "bb":
                student.state = State.BB;
                break;
            case "hb":
                student.state = State.HB;
                break;
            case "hh":
                student.state = State.HH;
                break;
            case "he":
                student.state = State.HE;
                break;
            case "mv":
                student.state = State.MV;
                break;
            case "ni":
                student.state = State.NI;
                break;
            case "nw":
                student.state = State.NW;
                break;
            case "rp":
                student.state = State.RP;
                break;
            case "sl":
                student.state = State.SL;
                break;
            case "sn":
                student.state = State.SN;
                break;
            case "st":
                student.state = State.ST;
                break;
            case "sh":
                student.state = State.SH;
                break;
            case "th":
                student.state = State.TH;
                break;
            case "other":
                student.state = State.OTHER;
                break;
            default:
                logger.error("Invalid value for Instructor role change state: " + apiInstructor.state);
                return 400;
        }

        switch (apiInstructor.module) {
            case "internship":
                student.module = TeacherModule.INTERNSHIP;
                break;
            case "seminar":
                student.module = TeacherModule.SEMINAR;
                break;
            case "other":
                student.module = TeacherModule.OTHER;
                break;
            default:
                logger.warn("Tutor registration has invalid string for teacher module " + apiInstructor.module);
                return 400;
        }

        student.msg = apiInstructor.msg;
        student.university = apiInstructor.university;
        student.moduleHours = apiInstructor.hours;
    }

    try {

        // TODO: transaction log
        await entityManager.save(Student, student);
        // Invite to instructor screening
        await sendFirstScreeningInvitationToInstructor(entityManager, student);
    } catch (e) {
        logger.error("Unable to update student status: " + e.message);
        return 500;
    }
    return 204;
}

/**
 * @api {POST} /user/:id/role/tutor postUserRoleTutor
 * @apiVersion 1.1.0
 * @apiDescription
 * Add the tutor role to the current user by supplying subjects for matching.
 *
 * The user has to be authenticated.
 *
 * @apiName postUserRoleInstructor
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>/role/tutor
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserRoleTutorSubjects
 * @apiUse SubjectStudent
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function postUserRoleTutorHandler(req: Request, res: Response) {
    let status = 204;

    if (res.locals.user instanceof Student
        && req.params.id != undefined
        && req.body instanceof Array) {
        let subjects: ApiSubjectStudent[] = [];
        for (let testSubject of req.body) {
            if (typeof testSubject.name == "string" &&
                checkSubject(testSubject.name) &&
                typeof testSubject.minGrade == "number" &&
                Number.isInteger(testSubject.minGrade) &&
                typeof testSubject.maxGrade == "number" &&
                Number.isInteger(testSubject.maxGrade) &&
                testSubject.minGrade >= 1 && testSubject.minGrade <= 13 &&
                testSubject.maxGrade >= 1 && testSubject.maxGrade <= 13 &&
                testSubject.minGrade <= testSubject.maxGrade) {

                let newSubject = new ApiSubjectStudent;
                newSubject.name = testSubject.name;
                newSubject.minGrade = testSubject.minGrade;
                newSubject.maxGrade = testSubject.maxGrade;
                subjects.push(newSubject);
            } else {
                logger.warn("Invalid format for subject data element.");
                logger.debug(testSubject);
                status = 400;
            }
        }

        if (status < 300 && subjects.length >= 1) {
            status = await postUserRoleTutor(req.params.id, res.locals.user, subjects);
        }
    } else {
        logger.warn("Missing request parameters for roleTutorHandler.");
        status = 400;
    }

    res.status(status).end();
}

async function postUserRoleTutor(wixId: string, student: Student, subjects: ApiSubjectStudent[]): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn("Person with id " + student.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (student.isStudent) {
        logger.warn("Current user is already a tutor");
        return 400;
    }

    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    try {
        student.isStudent = true;
        student.openMatchRequestCount = 1;
        student.subjects = JSON.stringify(subjects);
        // TODO: transaction log
        await entityManager.save(Student, student);
    } catch (e) {
        logger.error("Unable to update student status: " + e.message);
        return 500;
    }
    return 204;
}
