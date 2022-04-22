import { getLogger } from "log4js";
import { EntityManager, getConnection, getManager, ObjectType } from "typeorm";
import { Request, Response } from "express";
import {
    ApiGetUser,
    ApiMatch,
    ApiProjectFieldInfo,
    ApiPutUser,
    ApiUserRoleInstructor,
    ApiUserRoleProjectCoach,
    ApiUserRoleProjectCoachee, ApiUserRoleTutor,
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
import {
    sendFirstScreeningInvitationToInstructor,
    sendFirstScreeningInvitationToProjectCoachingJufoAlumni,
    sendFirstScreeningInvitationToTutor
} from "../../../common/administration/screening/initial-invitations";
import { State } from "../../../common/entity/State";
import { EnumReverseMappings } from "../../../common/util/enumReverseMapping";
import moment from "moment-timezone";
import { Mentor } from "../../../common/entity/Mentor";
import { checkDivisions, checkExpertises, checkSubjects } from "../utils";
import { ApiSubject } from "../format";
import { ProjectFieldWithGradeInfoType } from "../../../common/jufo/projectFieldWithGradeInfoType";
import { TutorJufoParticipationIndication } from "../../../common/jufo/participationIndication";
import { ProjectMatch } from "../../../common/entity/ProjectMatch";
import UpdateProjectFieldsEvent from "../../../common/transactionlog/types/UpdateProjectFieldsEvent";
import { ExpertData } from "../../../common/entity/ExpertData";
import { getDefaultScreener } from "../../../common/entity/Screener";
import { Course, CourseState } from "../../../common/entity/Course";
import CancelCourseEvent from "../../../common/transactionlog/types/CancelCourseEvent";
import { Subcourse } from "../../../common/entity/Subcourse";
// import { checkCoDuSubjectRequirements } from "../../../common/util/subjectsutils";
import * as Notification from "../../../common/notification";

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
    if (res.locals.user instanceof Pupil || res.locals.user instanceof Student) {
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
 * @apiUse ExpertData
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 */
export async function getHandler(req: Request, res: Response) {
    let status;

    try {
        if (req.params.id != undefined && (res.locals.user instanceof Pupil || res.locals.user instanceof Student)) {
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
            (b.matchesRequested == undefined || typeof b.matchesRequested == "number") &&
            (b.projectMatchesRequested == undefined || typeof b.projectMatchesRequested == "number") &&
            (b.isCodu == undefined || typeof b.isCodu == "boolean")) {
            if (req.params.id != undefined &&
                (res.locals.user instanceof Student || res.locals.user instanceof Pupil)
            ) {
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
            console.log("Verification failed");
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
            if (b.length > 0 && b[0].minGrade != undefined && b[0].maxGrade != undefined) {
                subjectType = 1;
            } // Long Type

            for (let i = 0; i < b.length; i++) {
                let elem = b[i];
                if (subjectType == 0) {
                    if (typeof elem.name == "string" && checkSubject(elem.name)
                    ) {
                        let subject: ApiSubject = {
                            name: elem.name
                        };
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

                    let subject: ApiSubject = {
                        name: elem.name,
                        minGrade: elem.minGrade,
                        maxGrade: elem.maxGrade
                    };
                    subjects.push(subject);

                } else {
                    logger.error("Invalid format for longType subjects: Missing or wrongly typed properties in ", elem);
                    logger.debug("Index " + i, b);
                    status = 400;
                    break;
                }
            }
        }

        if (status < 300 && req.params.id != undefined &&
            (res.locals.user instanceof Pupil || res.locals.user instanceof Student)) {
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
 * @api {PUT} /user/:id/projectFields putUserProjectFields
 * @apiVersion 1.1.0
 * @apiDescription
 * Set the project fields of the user.
 *
 * This endpoint allows editing of the user's project fields. Please be aware, that
 * students and pupils have different project field formats (students have additional grade restrictions).
 * The user has to be authenticated and can only edit his own project fields.
 *
 * The project fields are given as an array of ProjectField objects in the request's body.
 *
 *
 * @apiName putUserProjectFields
 * @apiGroup User
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiExample {curl} Curl
 * curl -k -i -X PUT -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/user/<ID>/projectFields -d "<REQUEST>"
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function putProjectFieldsHandler(req: Request, res: Response) {
    let status = 204;
    try {
        //check project fields for validity
        const projectFields = req.body as ApiProjectFieldInfo[];
        const unknownProjectField = projectFields.find(s => !EnumReverseMappings.ProjectField(s.name));
        if (unknownProjectField) {
            status = 400;
            logger.error(`Put user project fields has invalid project field '${JSON.stringify(unknownProjectField)}'`);
        }

        //if a student, check that every project field has min and max (or neither of them)
        if (res.locals.user instanceof Student
            && !projectFields.every(pf => (pf.min && pf.max && pf.min <= pf.max) || (pf.min == null && pf.max == null))) { //NOTE: 0 is also an invalid value, so using negation operator (!) is ok here.
            status = 400;
            logger.error(`Put user project fields has invalid project field grade restriction!`);
        }

        if (status < 300 && req.params.id != undefined &&
            (res.locals.user instanceof Student || res.locals.user instanceof Pupil)) {
            try {
                status = await putProjectFields(req.params.id, projectFields, res.locals.user);
            } catch (e) {
                logger.warn("Error PUT /user/projectFields: " + e.message);
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
            (res.locals.user instanceof Student || res.locals.user instanceof Pupil)) {
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
                        res.locals.user,
                        req.body.deactivationReason,
                        req.body.deactivationFeedback
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
        apiResponse.isUniversityStudent = person.isUniversityStudent;
        apiResponse.screeningStatus = await person.screeningStatus();
        apiResponse.instructorScreeningStatus = await person.instructorScreeningStatus();
        apiResponse.projectCoachingScreeningStatus = await person.projectCoachingScreeningStatus();
        apiResponse.matchesRequested = person.openMatchRequestCount <= 3 ? person.openMatchRequestCount : 3;
        apiResponse.projectMatchesRequested = person.openProjectMatchRequestCount <= 3 ? person.openProjectMatchRequestCount : 3;
        apiResponse.matches = [];
        apiResponse.projectMatches = [];
        apiResponse.dissolvedMatches = [];
        apiResponse.subjects = convertSubjects(JSON.parse(person.subjects));
        apiResponse.projectFields = (await person.projectFields).map(pf => Object.assign(new ApiProjectFieldInfo(), {name: pf.projectField, min: pf.min, max: pf.max}));
        apiResponse.university = person.university;
        apiResponse.state = person.state;
        apiResponse.lastUpdatedSettingsViaBlocker = moment(person.lastUpdatedSettingsViaBlocker).unix();
        apiResponse.isOfficial = person.module != null || person.moduleHours != null;
        apiResponse.isCodu = person.isCodu;
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

        // Project Coaching Matches
        const projectCoachingMatches = await entityManager.find(ProjectMatch, {
            student: person
        });
        apiResponse.projectMatches = projectCoachingMatches.map(m => {
            return {
                dissolved: m.dissolved,
                firstname: m.pupil.firstname,
                lastname: m.pupil.lastname,
                email: m.pupil.email,
                uuid: m.uuid,
                grade: m.pupil.assumedProjectCoachingMatchingGrade(),
                projectFields: m.pupil.projectFields,
                jitsilink: m.jitsiLink(),
                date: m.createdAt.getTime(),
                jufoParticipation: m.pupil.isJufoParticipant,
                projectMemberCount: m.pupil.projectMemberCount
            };
        });

        const expertData = await entityManager.findOne(ExpertData, {
            relations: ["expertiseTags"],
            where: { student: person }
        });
        if (expertData) {
            apiResponse.expertData = {
                id: expertData.id,
                contactEmail: expertData.contactEmail,
                description: expertData.description,
                expertiseTags: expertData.expertiseTags.map(t => t.name),
                active: expertData.active,
                allowed: expertData.allowed
            };
        }

    } else if (person instanceof Pupil) {
        apiResponse.type = "pupil";
        apiResponse.isPupil = person.isPupil;
        apiResponse.isParticipant = person.isParticipant;
        apiResponse.isProjectCoachee = person.isProjectCoachee;
        apiResponse.grade = parseInt(person.grade);
        apiResponse.matchesRequested = person.openMatchRequestCount <= 1 ? person.openMatchRequestCount : 1;
        apiResponse.projectMatchesRequested = person.openProjectMatchRequestCount <= 1 ? person.openProjectMatchRequestCount : 1;
        apiResponse.matches = [];
        apiResponse.projectMatches = [];
        apiResponse.dissolvedMatches = [];
        apiResponse.subjects = toPupilSubjectFormat(convertSubjects(JSON.parse(person.subjects), false)); //if the subjects contain grade information, it should be stripped off
        apiResponse.projectFields = person.projectFields.map(pf => Object.assign(new ApiProjectFieldInfo(), {name: pf}));
        apiResponse.state = person.state;
        apiResponse.schoolType = person.schooltype;
        apiResponse.lastUpdatedSettingsViaBlocker = moment(person.lastUpdatedSettingsViaBlocker).unix();
        apiResponse.pupilTutoringInterestConfirmationStatus = person.tutoringInterestConfirmationRequest?.status;

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

        // Project Coaching Matches
        const projectCoachingMatches = await entityManager.find(ProjectMatch, {
            pupil: person
        });
        apiResponse.projectMatches = await Promise.all(projectCoachingMatches.map(async m => {
            return {
                dissolved: m.dissolved,
                firstname: m.student.firstname,
                lastname: m.student.lastname,
                email: m.student.email,
                uuid: m.uuid,
                projectFields: (await m.student.getProjectFields()).map(p => p.name),
                jitsilink: m.jitsiLink(),
                date: m.createdAt.getTime(),
                jufoParticipation: m.student.wasJufoParticipant
            };
        }));
    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return null;
    }

    logger.debug("Sending apiResponse ", apiResponse);
    return apiResponse;
}

async function putPersonal(wix_id: string, req: ApiPutUser, person: Pupil | Student | Mentor): Promise<number> {
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
        } else {
            person.lastUpdatedSettingsViaBlocker = null;
        }

        // ++++ OPEN _PROJECT_ MATCH REQUEST COUNT ++++
        // Check if number of requested project matches is valid
        if (req.projectMatchesRequested != null) {
            let projectMatchCount = await entityManager.count(ProjectMatch, { student: person, dissolved: false });
            if (req.projectMatchesRequested > 3 || req.projectMatchesRequested < 0 || !Number.isInteger(req.projectMatchesRequested) || req.projectMatchesRequested + projectMatchCount > 6) {
                logger.warn("User (with " + projectMatchCount + " matches) wants to set invalid number of project matches requested: " + req.projectMatchesRequested);
                return 400;
            }
            person.openProjectMatchRequestCount = req.projectMatchesRequested;
        }

        // ++++ DAZ INFORMATION ++++
        if (req.languages) {
            const languages = req.languages.map(l => EnumReverseMappings.Language(l));
            if (!languages.every(l => l)) {
                logger.warn(`User wants to set invalid values "${req.languages}" for languages`);
                return 400;
            }
            person.languages = languages;
        }

        person.supportsInDaZ = req.supportsInDaz;

        // ++++ CODU INFORMATION ++++
        // if (req.isCodu !== undefined) {
        //     if (req.isCodu && !checkCoDuSubjectRequirements(person.getSubjectsFormatted())) {
        //         logger.warn("Student does not fulfill subject requirements for CoDu");
        //         return 400;
        //     }
        //     person.isCodu = req.isCodu;
        // }

    } else if (person instanceof Pupil) {
        type = Pupil;

        // ++++ OPEN MATCH REQUEST COUNT ++++
        // Check if number of requested matches is valid
        if (req.matchesRequested !== undefined && person.openMatchRequestCount !== req.matchesRequested) {
            if (!Number.isInteger(req.matchesRequested) || req.matchesRequested < 0) {
                logger.warn(`While updating Pupil(${person.id}): matchRequested ${req.matchesRequested} is not an integer or below zero`);
                return 400;
            }

            if (req.matchesRequested > 1) {
                // NOTE: Admins can enter a larger number into the database
                logger.warn(`While updating Pupil(${person.id}): Pupils may only have one open match request (requested: ${req.matchesRequested}, current: ${person.openMatchRequestCount})`);
                return 400;
            }

            let matchCount = await entityManager.count(Match, {
                pupil: person,
                dissolved: false
            });

            if (req.matchesRequested > person.openMatchRequestCount && (req.matchesRequested + matchCount) > 1) {
                // NOTE: The opposite scenario can happen when an admin manually increased the match request count. The user can then decrease that number
                logger.warn(`While updating Pupil(${person.id}): Pupils may only request more matches when they do not have a Match already (requested: ${req.matchesRequested}, current: ${person.openMatchRequestCount}, actual: ${matchCount})`);
                return 400;
            }

            person.openMatchRequestCount = req.matchesRequested;
        }

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
        } else {
            person.lastUpdatedSettingsViaBlocker = null;
        }

        // ++++ OPEN _PROJECT_ MATCH REQUEST COUNT ++++
        // Check if number of requested project matches is valid
        if (req.projectMatchesRequested != null) {
            let projectMatchCount = await entityManager.count(ProjectMatch, { pupil: person, dissolved: false });
            if (req.projectMatchesRequested > 1 || req.projectMatchesRequested < 0 || !Number.isInteger(req.projectMatchesRequested) || req.projectMatchesRequested + projectMatchCount > 1) {
                logger.warn("User (with " + projectMatchCount + " matches) wants to set invalid number of project matches requested: " + req.projectMatchesRequested);
                return 400;
            }
            person.openProjectMatchRequestCount = req.projectMatchesRequested;
        }

        // ++++ DAZ INFORMATION +++++
        if (req.languages) {
            const languages = req.languages.map(l => EnumReverseMappings.Language(l));
            if (!languages.every(l => l)) {
                logger.warn(`User wants to set invalid values "${req.languages}" for languages`);
                return 400;
            }
            person.languages = languages;
        }

        if (req.learningGermanSince) {
            const learningGermanSince = EnumReverseMappings.LearningGermanSince(req.learningGermanSince);
            if (!learningGermanSince) {
                logger.warn(`User wants to set invalid value "${learningGermanSince}" for learningGermanSince`);
                return 400;
            }
            person.learningGermanSince = learningGermanSince;
        }
    } else if (person instanceof Mentor) {
        type = Mentor;

        if (req.division) {
            let division = checkDivisions(req.division);
            if (division === null) {
                return 400;
            }
            person.division = division;
        }

        if (req.expertise) {
            let expertise = checkExpertises(req.expertise);
            if (expertise === null) {
                return 400;
            }
            person.expertise = expertise;
        }

        if (req.subjects) {
            let subjects = checkSubjects(req.subjects);
            if (subjects === null) {
                return 400;
            }
            person.subjects = subjects;
        }

        if (typeof req.teachingExperience === 'boolean') {
            person.teachingExperience = req.teachingExperience;
        } else if (req.teachingExperience !== undefined) {
            return 400;
        }

        if (req.description) {
            person.description = req.description.trim();
        }

    } else {
        logger.warn("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    try {
        await entityManager.save(type, person);
        await transactionLog.log(new UpdatePersonalEvent(person, oldPerson));
        if (person instanceof Student && req.isCodu) {
            await Notification.actionTaken(person, "codu_student_registration", {});
        }
        logger.info(`Updated user ${person.firstname} ${person.lastname} (ID ${person.wix_id}, Type ${person?.constructor?.name}`);
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
        if (!person.isStudent) {
            person.isStudent = true;
        }

    } else if (person instanceof Pupil) {

        type = Pupil;
        if (!person.isPupil) {
            person.isPupil = true;
        }

    } else {
        logger.error("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    person.subjects = JSON.stringify(req);

    // if (person instanceof Student &&
    //     person.isCodu &&
    //     !checkCoDuSubjectRequirements(person.getSubjectsFormatted())) {
    //     logger.warn("Student does not fulfill subject requirements for CoDu");
    //     return 400;
    // }

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

async function putProjectFields(wix_id: string, req: ApiProjectFieldInfo[], person: Pupil | Student): Promise<number> {
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

    //check if the person is a project coach(ee), otherwise do not allow setting project fields
    if (!(person as Pupil).isProjectCoachee && !(person as Student).isProjectCoach) {
        logger.error(`Person with id ${person.wix_id} is no project coach(ee) and thus setting project fields is invalid!`);
        return 400;
    }

    let oldProjectFields: ProjectFieldWithGradeInfoType[];

    const projectFields = req as ProjectFieldWithGradeInfoType[];
    let type: ObjectType<Person>;
    if (person instanceof Student) {
        oldProjectFields = await person.getProjectFields();
        await person.setProjectFields(projectFields);
    } else if (person instanceof Pupil) {
        oldProjectFields = person.projectFields.map(p => ({name: p}));
        person.projectFields = projectFields.map(pf => pf.name);
    } else {
        logger.error("Unknown type of person: " + typeof person);
        logger.debug(person);
        return 500;
    }

    try {
        await entityManager.save(person);
        await transactionLog.log(
            new UpdateProjectFieldsEvent(person, oldProjectFields)
        );
    } catch (e) {
        logger.error("Can't update " + type.toString() + ": " + e.message);
        logger.debug(person, e);
    }

    return 204;
}

async function putActive(wix_id: string, active: boolean, person: Pupil | Student, deactivationReason?: string, deactivationFeedback?: string): Promise<number> {
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

    let debugCancelledCourses = [];
    let debugRemovedFrom = [];

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
            person.active = false;
            await entityManager.save(type, person);

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

            // Step 2: Cancel all courses if user is student
            if (type == Student) {
                let courses = await getConnection()
                    .getRepository(Course)
                    .createQueryBuilder("course")
                    .leftJoinAndSelect("course.instructors", "instructors")
                    .innerJoin("course.instructors", "instructorsSelect")
                    .where("instructorsSelect.id = :id", { id: person.id})
                    .leftJoinAndSelect("course.subcourses", "subcourses")
                    .getMany();

                logger.debug("Trying to cancel following courses: ", courses);

                await entityManager.transaction(async em => {
                    for (const course of courses) {
                        logger.debug("Iterating through courses:", "Current course name:", course.name, "Instructors:", course.instructors, "Length of array:", course.instructors.length);
                        if (!course.instructors.some(i => i.id === person.id)) { // Only proceed if we're part of this course as an instructor
                            continue;
                        }

                        if (course.instructors.length > 1) {
                        // Course still has other instructors, only remove our person from those. We don't want to cancel those courses.
                            course.instructors = course.instructors.filter(s => s.id !== person.id);
                            await em.save(Course, course);
                            debugRemovedFrom.push(course);
                        } else {
                        // Our person is the only instructor in the course. Cancel it.
                            for (const subcourse of course.subcourses) {
                                if (!subcourse.cancelled) {
                                    subcourse.cancelled = true;
                                    await em.save(Subcourse, subcourse);
                                    //await sendSubcourseCancelNotifications(course, subcourse);
                                }
                            }

                            course.courseState = CourseState.CANCELLED;
                            await em.save(Course, course);
                            transactionLog.log(new CancelCourseEvent(person as Student, course));
                            debugCancelledCourses.push(course);
                        }

                    }
                });
                logger.info("Courses user was removed from (as an instructor): ", debugRemovedFrom);
                logger.info("Courses that were cancelled (user was the sole instructor): ", debugCancelledCourses);
            }

            await Notification.cancelRemindersFor(person);

            await transactionLog.log(new DeActivateEvent(person, false, deactivationReason, deactivationFeedback));
        }
    } catch (e) {
        logger.error("Can't " + (active ? "" : "de") + "activate user: " + e.message);
        logger.debug(person);
        logger.debug(e);
        return 500;
    }
    return 204;
}

// Support for legacy formats
function convertSubjects(oldSubjects: Array<any>, longtype: boolean = true): ApiSubject[] {
    let subjects = [];
    for (let i = 0; i < oldSubjects.length; i++) {
        if (typeof oldSubjects[i] == "string") {
            let s: ApiSubject = {
                name: oldSubjects[i].replace(/[1234567890:]+$/g, "")
            };
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
    //TODO: Implement transactionLog

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
 * @apiUse UserRoleTutor
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
        && req.body.subjects instanceof Array
        && typeof req.body.supportsInDaz === "boolean"
        && (!req.body.languages || (req.body.languages instanceof Array && req.body.languages.every(l => typeof l === "string")))) {

        for (let i = 0; i < req.body.subjects.length; i++) {
            let elem = req.body.subjects[i];
            if (typeof elem.name !== 'string' ||
                typeof elem.minGrade !== 'number' ||
                typeof elem.maxGrade !== 'number') {
                logger.error("Post user role tutor has malformed subjects.");
                status = 400;
            }
        }

        if (status < 300) {
            status = await postUserRoleTutor(req.params.id, res.locals.user, req.body);
        }

    } else {
        logger.warn("Missing request parameters for roleTutorHandler.");
        status = 400;
    }

    res.status(status).end();
}

async function postUserRoleTutor(wixId: string, student: Student, apiTutor: ApiUserRoleTutor): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn("Person with id " + student.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (student.isStudent) {
        logger.warn("Current user is already a tutor");
        return 400;
    }

    const languages = apiTutor.languages?.map(l => EnumReverseMappings.Language(l)) ?? [];
    if (!languages.every(l => l)) {
        logger.warn(`User wants to set invalid values "${apiTutor.languages}" for languages`);
        return 400;
    }

    const entityManager = getManager();
    //TODO: Implement transactionLog

    try {
        student.isStudent = true;
        student.openMatchRequestCount = 1;
        student.subjects = JSON.stringify(apiTutor.subjects);
        student.supportsInDaZ = apiTutor.supportsInDaz;
        student.languages = languages;
        await becomeTutorScreeningHandler(student, entityManager);
        // TODO: transaction log
        await entityManager.save(Student, student);
    } catch (e) {
        logger.error("Unable to update student status: " + e.message);
        return 500;
    }

    logger.info(`Student ${student.wix_id} became tutor with ${JSON.stringify(apiTutor)}`);
    return 204;
}

async function becomeTutorScreeningHandler(student: Student, entityManager: EntityManager): Promise<void> {
    // If project coach is university student and verified project coach he/ she is eligible for tutoring

    if (student.isUniversityStudent) {
        const projectCoachingScreening = await student.projectCoachingScreening;

        if (projectCoachingScreening && projectCoachingScreening.success) {
            const defualtScreener = await getDefaultScreener(entityManager);

            await student.setTutorScreeningResult({
                verified: true,
                comment: `[AUTOMATICALLY GENERATED SECONDARY SCREENING DUE TO VALID PROJECT COACHING SCREENING]`,
                knowsCoronaSchoolFrom: ""
            }, defualtScreener);
        }
    }
}


/**
 * @api {POST} /user/:id/role/projectcoach postUserRoleProjectCoach
 * @apiVersion 1.1.0
 * @apiDescription
 * Add the project coach role to the current user by supplying project fields for matching.
 *
 * The user has to be authenticated.
 *
 * @apiName postUserRoleProjectCoach
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>/role/projectcoach
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserRoleProjectCoach
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function postUserRoleProjectCoachHandler(req: Request, res: Response) {
    let status = 204;

    if (res.locals.user instanceof Student
        && req.params.id != undefined
        && req.body.projectFields instanceof Array
        && req.body.projectFields.length > 0
        && (req.body.wasJufoParticipant == null || (typeof req.body.wasJufoParticipant === "string" && EnumReverseMappings.TutorJufoParticipationIndication(req.body.wasJufoParticipant)))
        && (req.body.isUniversityStudent == null || typeof req.body.isUniversityStudent === "boolean")
        && (req.body.hasJufoCertificate == null || typeof req.body.hasJufoCertificate === "boolean")
        && (req.body.jufoPastParticipationInfo == null || typeof req.body.jufoPastParticipationInfo === "string")) {

        //check project fields for validity
        const projectFields = req.body.projectFields as ApiProjectFieldInfo[];
        const unknownProjectField = projectFields.find(s => !EnumReverseMappings.ProjectField(s.name));
        if (unknownProjectField) {
            status = 400;
            logger.error(`Post User Role Project Coach has invalid project field '${JSON.stringify(unknownProjectField)}'`);
        }

        if (status < 300) {
            status = await postUserRoleProjectCoach(req.params.id, res.locals.user, req.body);
        }
    } else {
        logger.warn("Missing request parameters for roleProjectCoach.");
        status = 400;
    }

    res.status(status).end();
}

async function postUserRoleProjectCoach(wixId: string, student: Student, info: ApiUserRoleProjectCoach): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn("Person with id " + student.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (student.isProjectCoach) {
        logger.warn("Current user already is a project coach");
        return 400;
    }

    //other validity checks, only required if current user is no student
    if (student.isStudent === false && !info.isUniversityStudent) {
        if (info.isUniversityStudent == undefined) {
            logger.warn(`User ${student.email} requires indication of whether or not s*he is a university student`);
            return 400;
        }
        //if here, the info's isUniversityStudent is false
        if (!info.wasJufoParticipant) {
            //then expect info on university student
            logger.warn(`User ${student.email} requires indication on jufo participation!`);
            return 400;
        }
        if (info.wasJufoParticipant === TutorJufoParticipationIndication.NO) {
            logger.warn(`User ${student.email} cannot be no jufo participant and no university student at the same time!`);
            return 400;
        }
        //if here, the user was a jufo participant
        if (info.hasJufoCertificate == undefined) {
            logger.warn(`User ${student.email} which was a jufo participant requires info on whether a jufo certificate exists!`);
            return 400;
        }
        if (info.hasJufoCertificate === false && !info.jufoPastParticipationInfo) {
            logger.warn(`User ${student.email} which was a jufo participant and which has no jufo certificate requires other information about her past jufo participation!`);
            return 400;
        }
        //if here, the user is no student, no university student, was a past jufo participant and has a jufo certificate or provided some info on his past jufo participation -> that is valid
    }

    const entityManager = getManager();
    //TODO: Implement transactionLog

    try {
        student.isProjectCoach = true;
        await student.setProjectFields(info.projectFields as ProjectFieldWithGradeInfoType[]);
        student.wasJufoParticipant = info.wasJufoParticipant;
        student.isUniversityStudent = info.isUniversityStudent;
        student.hasJufoCertificate = info.hasJufoCertificate;
        student.jufoPastParticipationInfo = info.jufoPastParticipationInfo;

        // TODO: transaction log
        await entityManager.save(Student, student);
    } catch (e) {
        logger.error("Unable to update student status: " + e.message);
        return 500;
    }

    //send screening invitations, if necessary (it's necessary only if the person is not a student and not a person registered in a university while being a jufo participant without still having a certificate)
    try {
        if (!student.isStudent && !(student.isUniversityStudent === false && student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === false)) {
            if (student.isUniversityStudent) {
                //send usual tutor screening invitation
                await sendFirstScreeningInvitationToTutor(entityManager, student);
            } else if (student.wasJufoParticipant === TutorJufoParticipationIndication.YES && student.hasJufoCertificate === true) {
                //invite to jufo specific screening
                await sendFirstScreeningInvitationToProjectCoachingJufoAlumni(entityManager, student);
            }
        }
    } catch (e) {
        logger.error(`Cannot send screening invitation (after adding role) to ${student.email}... ${e}`);
    }

    return 204;
}

/**
 * @api {POST} /user/:id/role/projectcoachee postUserRoleProjectCoachee
 * @apiVersion 1.1.0
 * @apiDescription
 * Add the project coachee role to the current user by supplying project fields for matching.
 *
 * The user has to be authenticated.
 *
 * @apiName postUserRoleProjectCoachee
 * @apiGroup User
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/user/<ID>/role/projectcoachee
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse UserRoleProjectCoachee
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function postUserRoleProjectCoacheeHandler(req: Request, res: Response) {
    let status = 204;

    if (res.locals.user instanceof Pupil
        && req.params.id != undefined
        && req.body.projectFields instanceof Array
        && typeof req.body.isJufoParticipant === "string"
        && typeof req.body.projectMemberCount === "number") {

        //check projectFields for validity
        if (req.body.projectFields.length <= 0) {
            status = 400;
            logger.error("Post User Role Project Coachee expects projectFields");
        }
        const projectFields = req.body.projectFields as string[];
        const unknownProjectField = projectFields.find(s => !EnumReverseMappings.ProjectField(s));
        if (unknownProjectField) {
            status = 400;
            logger.error(`Post User Role Project Coachee has invalid project field ${JSON.stringify(unknownProjectField)}`);
        }

        // check isJufoParticipant for validity
        if (!EnumReverseMappings.TuteeJufoParticipationIndication(req.body.isJufoParticipant)) {
            status = 400;
            logger.error(`Post User Role Project Coachee has invalid value for jufo participation: '${req.body.isJufoParticipant}'`);
        }

        //check projectMemberCount for validity
        const projectMemberCount: number = req.body.projectMemberCount;
        if (projectMemberCount < 1 || projectMemberCount > 3) {
            status = 400;
            logger.error(`Post User Role Project Coachee has invalid value for projectMemberCount: ${projectMemberCount}`);
        }

        if (status < 300) {
            status = await postUserRoleProjectCoachee(req.params.id, res.locals.user, req.body);
        }
    } else {
        logger.warn("Missing request parameters for roleProjectCoachee.");
        status = 400;
    }

    res.status(status).end();
}

async function postUserRoleProjectCoachee(wixId: string, pupil: Pupil, info: ApiUserRoleProjectCoachee): Promise<number> {
    if (wixId != pupil.wix_id) {
        logger.warn("Person with id " + pupil.wix_id + " tried to access data from id " + wixId);
        return 403;
    }

    if (pupil.isProjectCoachee) {
        logger.warn("Current user already is a project coachee");
        return 400;
    }

    const entityManager = getManager();

    try {
        pupil.isProjectCoachee = true;
        pupil.projectFields = info.projectFields;
        pupil.isJufoParticipant = info.isJufoParticipant;
        pupil.projectMemberCount = info.projectMemberCount;

        // TODO: transaction log
        await entityManager.save(Pupil, pupil);
    } catch (e) {
        logger.error("Unable to update pupil status: " + e.message);
        return 500;
    }

    return 204;
}
