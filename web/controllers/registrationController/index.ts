import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { ApiAddTutor, ApiAddTutee, ApiAddMentor, ApiAddStateTutee, ApiSchoolInfo } from './format';
import { getManager } from 'typeorm';
import { getTransactionLog } from '../../../common/transactionlog';
import { Student, TeacherModule } from '../../../common/entity/Student';
import VerificationRequestEvent from '../../../common/transactionlog/types/VerificationRequestEvent';
import { checkSubject } from '../userController/format';
import { Pupil } from '../../../common/entity/Pupil';
import { v4 as uuidv4 } from "uuid";
import { State } from '../../../common/entity/State';
import { generateToken, sendVerificationMail } from '../../../jobs/periodic/fetch/utils/verification';
import { Mentor } from "../../../common/entity/Mentor";
import { EnumReverseMappings } from '../../../common/util/enumReverseMapping';
import { Address } from "address-rfc2821";
import { School } from '../../../common/entity/School';
import { SchoolType } from '../../../common/entity/SchoolType';
import { RegistrationSource } from '../../../common/entity/Person';
import { TutorJufoParticipationIndication } from '../../../common/jufo/participationIndication';
import {checkDivisions, checkExpertises, checkSubjects} from "../utils";

const logger = getLogger();

/**
 * @api {POST} /register/tutor RegisterTutor
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a tutor.
 *
 * @apiName RegisterTutor
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddTutor
 * @apiUse Subject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutor -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function postTutorHandler(req: Request, res: Response) {
    let status = 204;

    logger.info(`GOT TUTOR REGISTRATION \n\twith params: ${JSON.stringify(req.params)} \n\tand body: ${JSON.stringify(req.body)}`);
    try {

        if (typeof req.body.firstname == 'string' &&
            typeof req.body.lastname == 'string' &&
            typeof req.body.email == 'string' &&
            (typeof req.body.phone == 'string' || typeof req.body.phone == 'undefined') &&
            typeof req.body.isTutor == 'boolean' &&
            typeof req.body.isOfficial == 'boolean' &&
            typeof req.body.isInstructor == 'boolean' &&
            typeof req.body.newsletter == 'boolean' &&
            typeof req.body.msg == 'string' &&
            typeof req.body.state == 'string' &&
            typeof req.body.isProjectCoach == 'boolean') {

            if (req.body.isTutor) {
                if (req.body.subjects instanceof Array) {
                    for (let i = 0; i < req.body.subjects.length; i++) {
                        let elem = req.body.subjects[i];
                        if (typeof elem.name !== 'string' ||
                            typeof elem.minGrade !== 'number' ||
                            typeof elem.maxGrade !== 'number') {
                            status = 400;
                            logger.error("Tutor registration with isTutor has malformed subjects.");
                        }
                    }
                } else {
                    status = 400;
                    logger.error("Tutor registration with isTutor missing subjects.");
                }
            }

            if (req.body.isOfficial) {
                if (typeof req.body.module !== 'string' ||
                    typeof req.body.hours !== 'number') {
                    status = 400;
                    logger.error("Tutor registration with isOfficial has incomplete/invalid parameters");
                }
            }

            if (req.body.isProjectCoach) {
                if (req.body.projectFields instanceof Array
                    && typeof req.body.wasJufoParticipant === "string"
                    && (req.body.isUniversityStudent == undefined || typeof req.body.isUniversityStudent === "boolean")) {
                    // CHECK project fields for validity
                    if (req.body.projectFields.length <= 0) {
                        status = 400;
                        logger.error("Tutor registration with isProjectCoach expects projectFields");
                    }
                    const unknownProjectField = (req.body.projectFields as string[]).find(s => !EnumReverseMappings.ProjectField(s));
                    if (unknownProjectField) {
                        status = 400;
                        logger.error(`Tutor registration with isProjectCoach has invalid project field '${unknownProjectField}'`);
                    }
                    // CHECK wasJufoParticipant for validity
                    if (!EnumReverseMappings.TutorJufoParticipationIndication(req.body.wasJufoParticipant)) {
                        status = 400;
                        logger.error(`Tutor registration with isProjectCoach has invalid value for jufo participation: '${req.body.wasJufoParticipant}'`);
                    }
                    // CHECK hasJufoCertificate for validity
                    if (!req.body.isTutor && req.body.wasJufoParticipant === "yes" && req.body.isUniversityStudent === false && typeof req.body.hasJufoCertificate !== "boolean") {
                        status = 400;
                        logger.error(`Tutor registration with isProjectCoach (for a non university-student, but ex-jufo-participant) requires indication of whether the person has a Jufo certificate or not.`);
                    }
                    if (req.body.jufoPastParticipationInfo && typeof req.body.jufoPastParticipationInfo !== "string") {
                        status = 400;
                        logger.error(`Tutor registration with jufoPastParticipationInfo requires the info on a past jufo participation to be a string`);
                    }
                }
                else {
                    status = 400;
                    logger.error("Tutor registration with isProjectCoach has invalid parameters");
                }
            }


            if (req.body.redirectTo != undefined && typeof req.body.redirectTo !== "string")
                status = 400;

            if (status < 300) {
                // try registering
                status = await registerTutor(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for Tutor registration");
                status = 400;
            }

        } else {
            logger.error("Missing required parameters for Tutor registration", req.body);
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(e, req.body);
        status = 500;
    }

    res.status(status).end();
}

async function registerTutor(apiTutor: ApiAddTutor): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (apiTutor.firstname.length == 0 || apiTutor.firstname.length > 100) {
        logger.warn("apiTutor.firstname outside of length restrictions");
        return 400;
    }

    if (apiTutor.lastname.length == 0 || apiTutor.lastname.length > 100) {
        logger.warn("apiTutor.lastname outside of length restrictions");
        return 400;
    }

    if (apiTutor.email.length == 0 || apiTutor.email.length > 100) {
        logger.warn("apiTutor.email outside of length restrictions");
        return 400;
    }

    if (apiTutor.phone && (apiTutor.phone.length == 0 || apiTutor.phone.length > 100)) {
        logger.warn("apiTutor.phone outside of length restrictions");
        return 400;
    }

    if (apiTutor.msg.length > 3000) {
        logger.warn("apiTutor.msg outside of length restrictions");
        return 400;
    }

    if (apiTutor.university && (apiTutor.university.length == 0 || apiTutor.university.length > 100)) {
        logger.warn("apiTutor.university outside of length restrictions");
        return 400;
    }
    if (!EnumReverseMappings.State(apiTutor.state)) {
        logger.error("Invalid value for Tutor registration state: " + apiTutor.state);
        return 400;
    }

    const tutor = new Student();
    tutor.firstname = apiTutor.firstname;
    tutor.lastname = apiTutor.lastname;
    tutor.email = apiTutor.email.toLowerCase();
    tutor.phone = apiTutor.phone;
    tutor.newsletter = apiTutor.newsletter;
    tutor.msg = apiTutor.msg;
    tutor.university = apiTutor.university;
    tutor.state = EnumReverseMappings.State(apiTutor.state);

    tutor.isStudent = false;
    tutor.isInstructor = false;

    tutor.wix_id = "Z-" + uuidv4();
    tutor.wix_creation_date = new Date();
    tutor.verification = generateToken();
    tutor.subjects = JSON.stringify([]);

    tutor.isUniversityStudent = apiTutor.isTutor || apiTutor.isOfficial || !!apiTutor.isUniversityStudent;

    if (tutor.phone && ! tutor.phone.startsWith("+49") && ! tutor.phone.startsWith("+41") && ! tutor.phone.startsWith("+43")) {
        logger.error("tutor.phone not from Germany, Swiss or Austria");
        return 400;
    }

    if (apiTutor.isTutor) {
        if (apiTutor.subjects.length < 1) {
            logger.warn("Subjects needs to contain at least one element.");
            return 400;
        }

        for (let i = 0; i < apiTutor.subjects.length; i++) {
            if (!checkSubject(apiTutor.subjects[i].name)) {
                logger.warn("Subjects contain invalid subject " + apiTutor.subjects[i].name);
                return 400;
            }
        }
        tutor.subjects = JSON.stringify(apiTutor.subjects);
        tutor.openMatchRequestCount = 1;
        tutor.isStudent = true;
    }

    if (apiTutor.isInstructor || apiTutor.isOfficial) {
        tutor.isInstructor = true;
    }

    if (apiTutor.isOfficial) {
        if (apiTutor.hours == 0 || apiTutor.hours > 1000) {
            logger.warn("apiTutor.hours outside of size restrictions");
            return 400;
        }

        switch (apiTutor.module) {
            case "internship":
                tutor.module = TeacherModule.INTERNSHIP;
                break;
            case "seminar":
                tutor.module = TeacherModule.SEMINAR;
                break;
            case "other":
                tutor.module = TeacherModule.OTHER;
                break;
            default:
                logger.warn("Tutor registration has invalid string for teacher module " + apiTutor.module);
                return 400;
        }

        tutor.moduleHours = apiTutor.hours;
    }

    // Project coaching
    if (apiTutor.isProjectCoach) {
        tutor.isProjectCoach = apiTutor.isProjectCoach;
        await tutor.setProjectFields(apiTutor.projectFields.map(pf => {
            return {name: pf};
        }));
    }
    if (apiTutor.isProjectCoach && !apiTutor.isTutor) {
        //the following only applies if someone is not going to be registering for 1-on-1-tutoring as well (i.e. not a university student)
        //-> therefore we need the info of isUniversityStudent, wasJufoParticipant, hasJufoCertificate ...

        //expect tutors which are not registering for 1-on-1-tutoring to be at least a past jufo participant or a university student
        if (apiTutor.wasJufoParticipant !== TutorJufoParticipationIndication.YES && !apiTutor.isUniversityStudent) {
            logger.warn("Tutor registration failed, because the tutor tried to register without beeing either a university student or a past Jufo participant!");
            return 400;
        }
        if (apiTutor.wasJufoParticipant === TutorJufoParticipationIndication.YES
            && !apiTutor.isUniversityStudent
            && !apiTutor.hasJufoCertificate
            && !apiTutor.jufoPastParticipationInfo) {
            logger.warn("Tutor registration failed, because a tutor which was a past jufo participiant, has no certificate and is not a university student requires information on his past jufo participation to verify his state with Jugend forscht!");
            return 400;
        }

        tutor.wasJufoParticipant = apiTutor.wasJufoParticipant;
        tutor.isUniversityStudent = apiTutor.isUniversityStudent;
        tutor.jufoPastParticipationInfo = apiTutor.jufoPastParticipationInfo;

        if (apiTutor.wasJufoParticipant === TutorJufoParticipationIndication.YES && apiTutor.isUniversityStudent === false) {
            tutor.hasJufoCertificate = apiTutor.hasJufoCertificate;
        }
    }

    const result = await entityManager.findOne(Student, { email: tutor.email });
    if (result !== undefined) {
        logger.error("Tutor with given email already exists");
        return 409;
    }

    try {
        await entityManager.save(Student, tutor);
        await sendVerificationMail(tutor, apiTutor.redirectTo);
        await transactionLog.log(new VerificationRequestEvent(tutor));
        return 204;
    } catch (e) {
        logger.error("Unable to add Tutor to database: " + e.message);
        return 500;
    }
}

/**
 * @api {POST} /register/tutee RegisterTutee
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a tutee.
 *
 * @apiName RegisterTutee
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddTutee
 * @apiUse Subject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutee -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function postTuteeHandler(req: Request, res: Response) {
    let status = 204;

    logger.info(`GOT TUTEE REGISTRATION \n\twith params: ${JSON.stringify(req.params)} \n\tand body: ${JSON.stringify(req.body)}`);
    try {

        if (typeof req.body.firstname == 'string' &&
            typeof req.body.lastname == 'string' &&
            typeof req.body.email == 'string' &&
            (typeof req.body.phone == 'string' || typeof req.body.phone == 'undefined') &&
            typeof req.body.state == 'string' &&
            typeof req.body.school == 'string' &&
            typeof req.body.isTutee == 'boolean' &&
            typeof req.body.newsletter == 'boolean' &&
            typeof req.body.msg == 'string' &&
            typeof req.body.isProjectCoachee == "boolean" &&
            (typeof req.body.grade == 'number' || (req.body.isProjectCoachee && !req.body.isTutee))) {//require grade only if not only registering for project coaching

            if (req.body.isTutee) {
                if (req.body.subjects instanceof Array) {
                    for (let i = 0; i < req.body.subjects.length; i++) {
                        let elem = req.body.subjects[i];
                        if (typeof elem.name !== 'string') {
                            status = 400;
                            logger.error("Tutee registration with isTutee has malformed subjects.");
                        }
                    }
                } else {
                    status = 400;
                    logger.error("Tutee registration with isTutee missing subjects.");
                }
            }

            if (req.body.isProjectCoachee) {
                if (req.body.projectFields instanceof Array
                    && typeof req.body.isJufoParticipant === "string"
                    && typeof req.body.projectMemberCount === "number") {
                    // CHECK project fields for validity
                    if (req.body.projectFields.length <= 0) {
                        status = 400;
                        logger.error("Tutee registration with isProjectCoachee expects projectFields");
                    }
                    const unknownProjectField = (req.body.projectFields as string[]).find(s => !EnumReverseMappings.ProjectField(s));
                    if (unknownProjectField) {
                        status = 400;
                        logger.error(`Tutee registration with isProjectCoachee has invalid project field '${unknownProjectField}'`);
                    }
                    // CHECK isJufoParticipant for validity
                    if (!EnumReverseMappings.TuteeJufoParticipationIndication(req.body.isJufoParticipant)) {
                        status = 400;
                        logger.error(`Tutee registration with isProjectCoachee has invalid value for jufo participation: '${req.body.isJufoParticipant}'`);
                    }
                    // CHECK projectMemberCount for validity
                    const projectMemberCount: number = req.body.projectMemberCount;
                    if (projectMemberCount < 1 || projectMemberCount > 3) {
                        status = 400;
                        logger.error(`Tutee registration with isProjectCoachee has invalid value for projectMemberCount: ${projectMemberCount}`);
                    }
                }
                else {
                    status = 400;
                    logger.error("Tutee registration with isProjectCoachee has invalid parameters");
                }
            }

            if (req.body.redirectTo != undefined && typeof req.body.redirectTo !== "string")
                status = 400;

            if (status < 300) {
                // try registering
                status = await registerTutee(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for Tutee registration");
                status = 400;
            }

        } else {
            logger.error("Missing required parameters for Tutee registration");
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
}

async function registerTutee(apiTutee: ApiAddTutee): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (apiTutee.firstname.length == 0 || apiTutee.firstname.length > 100) {
        logger.error("apiTutee.firstname outside of length restrictions");
        return 400;
    }

    if (apiTutee.lastname.length == 0 || apiTutee.lastname.length > 100) {
        logger.error("apiTutee.lastname outside of length restrictions");
        return 400;
    }

    if (apiTutee.email.length == 0 || apiTutee.email.length > 100) {
        logger.error("apiTutee.email outside of length restrictions");
        return 400;
    }

    if (apiTutee.phone && (apiTutee.phone.length == 0 || apiTutee.phone.length > 100)) {
        logger.error("apiTutee.phone outside of length restrictions");
        return 400;
    }

    if (apiTutee.msg.length > 3000) {
        logger.error("apiTutee.msg outside of length restrictions");
        return 400;
    }

    const tutee = new Pupil();
    tutee.firstname = apiTutee.firstname;
    tutee.lastname = apiTutee.lastname;
    tutee.email = apiTutee.email.toLowerCase();
    tutee.phone = apiTutee.phone;
    if (apiTutee.grade) {
        tutee.grade = apiTutee.grade + ". Klasse";
    }

    if (tutee.phone && ! tutee.phone.startsWith("+49") && ! tutee.phone.startsWith("+41") && ! tutee.phone.startsWith("+43")) {
        logger.error("tutee.phone not from Germany, Swiss or Austria");
        return 400;
    }

    switch (apiTutee.state) {
        case "bw":
            tutee.state = State.BW;
            break;
        case "by":
            tutee.state = State.BY;
            break;
        case "be":
            tutee.state = State.BE;
            break;
        case "bb":
            tutee.state = State.BB;
            break;
        case "hb":
            tutee.state = State.HB;
            break;
        case "hh":
            tutee.state = State.HH;
            break;
        case "he":
            tutee.state = State.HE;
            break;
        case "mv":
            tutee.state = State.MV;
            break;
        case "ni":
            tutee.state = State.NI;
            break;
        case "nw":
            tutee.state = State.NW;
            break;
        case "rp":
            tutee.state = State.RP;
            break;
        case "sl":
            tutee.state = State.SL;
            break;
        case "sn":
            tutee.state = State.SN;
            break;
        case "st":
            tutee.state = State.ST;
            break;
        case "sh":
            tutee.state = State.SH;
            break;
        case "th":
            tutee.state = State.TH;
            break;
        case "other":
            tutee.state = State.OTHER;
            break;
        default:
            logger.error("Invalid value for Tutee registration state: " + apiTutee.state);
            return 400;
    }

    switch (apiTutee.school) {
        case "grundschule":
            tutee.schooltype = SchoolType.GRUNDSCHULE;
            break;
        case "gesamtschule":
            tutee.schooltype = SchoolType.GESAMTSCHULE;
            break;
        case "hauptschule":
            tutee.schooltype = SchoolType.HAUPTSCHULE;
            break;
        case "realschule":
            tutee.schooltype = SchoolType.REALSCHULE;
            break;
        case "gymnasium":
            tutee.schooltype = SchoolType.GYMNASIUM;
            break;
        case "förderschule":
            tutee.schooltype = SchoolType.FOERDERSCHULE;
            break;
        case "berufsschule":
            tutee.schooltype = SchoolType.BERUFSSCHULE;
            break;
        case "other":
            tutee.schooltype = SchoolType.SONSTIGES;
            break;
        default:
            logger.error("Invalid value for Tutee registration schooltype: " + apiTutee.school);
            return 400;
    }

    tutee.newsletter = apiTutee.newsletter;
    tutee.msg = apiTutee.msg;

    tutee.isParticipant = true;
    tutee.isPupil = false;

    tutee.wix_id = "Z-" + uuidv4();
    tutee.wix_creation_date = new Date();
    tutee.verification = generateToken();
    tutee.subjects = JSON.stringify([]);

    if (apiTutee.isTutee) {
        if (apiTutee.subjects.length < 1) {
            logger.error("Tutee subjects needs to contain at least one element.");
            return 400;
        }

        for (let i = 0; i < apiTutee.subjects.length; i++) {
            if (!checkSubject(apiTutee.subjects[i].name)) {
                logger.error("Tutee subjects contain invalid subject " + apiTutee.subjects[i].name);
                return 400;
            }
        }

        tutee.isPupil = true;
        tutee.subjects = JSON.stringify(apiTutee.subjects);
    }

    // Project coaching
    if (apiTutee.isProjectCoachee) {
        tutee.isProjectCoachee = apiTutee.isProjectCoachee;
        tutee.projectFields = apiTutee.projectFields;
        tutee.isJufoParticipant = apiTutee.isJufoParticipant;
        tutee.projectMemberCount = apiTutee.projectMemberCount;
    }

    const result = await entityManager.findOne(Pupil, { email: tutee.email });
    if (result !== undefined) {
        logger.error("Tutee with given email already exists.");
        return 409;
    }

    try {
        await entityManager.save(Pupil, tutee);
        await sendVerificationMail(tutee, apiTutee.redirectTo);
        await transactionLog.log(new VerificationRequestEvent(tutee));
        return 204;
    } catch (e) {
        logger.error("Unable to add Tutee to database: " + e.message);
        return 500;
    }
}

/**
 * @api {POST} /register/mentor RegisterMentor
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a mentor.
 *
 * @apiName RegisterMentor
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddMentor
 * @apiUse Subject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/mentor -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function postMentorHandler(req: Request, res: Response) {
    let status = 204;

    try {

        if (typeof req.body.firstname == 'string' &&
            typeof req.body.lastname == 'string' &&
            typeof req.body.email == 'string' &&
            (typeof req.body.phone == 'string' || typeof req.body.phone == 'undefined') &&
            typeof req.body.teachingExperience === 'boolean' &&
            req.body.division instanceof Array &&
            req.body.expertise instanceof Array &&
            req.body.subjects instanceof Array) {

            if (req.body.redirectTo != undefined && typeof req.body.redirectTo !== "string") {
                status = 400;
            }

            if (status < 300) {
                status = await registerMentor(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for mentor registration");
                status = 400;
            }

        } else {
            logger.error("Missing required parameters for mentor registration");
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
}

async function registerMentor(apiMentor: ApiAddMentor): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (apiMentor.firstname.length == 0 || apiMentor.firstname.length > 100) {
        logger.warn("apiMentor.firstname is outside of length restrictions");
        return 400;
    }
    if (apiMentor.lastname.length == 0 || apiMentor.lastname.length > 100) {
        logger.warn("apiMentor.lastname is outside of length restrictions");
        return 400;
    }
    if (apiMentor.email.length == 0 || apiMentor.email.length > 100) {
        logger.warn("apiMentor.email is outside of length restrictions");
        return 400;
    }
    if (apiMentor.phone && (apiMentor.phone.length == 0 || apiMentor.phone.length > 100)) {
        logger.warn("apiMentor.phone is outside of length restrictions");
        return 400;
    }
    if (apiMentor.message && apiMentor.message.length > 100) {
        logger.warn("apiMentor.message is outside of length restrictions");
        return 400;
    }
    if (apiMentor.description && apiMentor.description.length > 250) {
        logger.warn("apiMentor.description is outside of length restrictions");
        return 400;
    }
    if (apiMentor.division.length == 0 || apiMentor.expertise.length == 0) {
        logger.warn("apiMentor.division and apiMentor.expertise are mandatory");
        return 400;
    } else if (apiMentor.division.indexOf('supervision') > -1 ||
            apiMentor.expertise.indexOf('specialized expertise in subjects') > -1) {
        if (apiMentor.subjects.length == 0 ||
                apiMentor.teachingExperience == undefined) {
            logger.warn("apiMentor.subjects and apiMentor.teachingExperience are mandatory");
            return 400;
        }
    }

    const mentor = new Mentor();
    mentor.firstname = apiMentor.firstname;
    mentor.lastname = apiMentor.lastname;
    mentor.email = apiMentor.email;
    mentor.phone = apiMentor.phone;
    mentor.description = apiMentor.description;
    mentor.message = apiMentor.message;
    mentor.teachingExperience = apiMentor.teachingExperience;
    mentor.wix_id = "Z-" + uuidv4();
    mentor.wix_creation_date = new Date();
    mentor.verification = generateToken();

    if (mentor.phone && ! mentor.phone.startsWith("+49") && ! mentor.phone.startsWith("+41") && ! mentor.phone.startsWith("+43")) {
        logger.error("mentor.phone not from Germany, Swiss or Austria");
        return 400;
    }

    if (apiMentor.subjects.length > 0) {
        let subjects = checkSubjects(apiMentor.subjects);
        if (subjects === null) {
            return 400;
        }
        mentor.subjects = subjects;
    }

    if (apiMentor.division.length > 0) {
        let division = checkDivisions(apiMentor.division);
        if (division === null) {
            return 400;
        }
        mentor.division = division;
    }

    if (apiMentor.expertise.length > 0) {
        let expertise = checkExpertises(apiMentor.expertise);
        if (expertise === null) {
            return 400;
        }
        mentor.expertise = expertise;
    }

    const result = await entityManager.findOne(Mentor, {email: mentor.email});
    if (result !== undefined) {
        logger.error("Mentor with given email already exists");
        return 409;
    }

    try {
        await entityManager.save(Mentor, mentor);
        await sendVerificationMail(mentor, apiMentor.redirectTo);
        await transactionLog.log(new VerificationRequestEvent(mentor));
        return 204;
    } catch (e) {
        logger.error("Unable to add Mentor to database: " + e.message);
        return 500;
    }
}



/**
 * @api {POST} /register/tutee/state StateRegisterTutee
 * @apiVersion 1.1.0
 * @apiDescription
 * Register a user as a tutee for a specific state cooperation
 *
 * @apiName StateRegisterTutee
 * @apiGroup Registration
 *
 * @apiUse ContentType
 *
 * @apiUse AddStateTutee
 * @apiUse Subject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutee/state -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusConflict
 * @apiUse StatusInternalServerError
 */
export async function postStateTuteeHandler(req: Request, res: Response) {
    let status = 204;

    try {

        if (typeof req.body.firstname == 'string' &&
            typeof req.body.lastname == 'string' &&
            typeof req.body.email == 'string' &&
            (typeof req.body.phone == 'string' || typeof req.body.phone == 'undefined') &&
            typeof req.body.grade == 'number' &&
            typeof req.body.state == 'string' &&
            typeof req.body.isTutee == 'boolean' &&
            typeof req.body.newsletter == 'boolean' &&
            typeof req.body.teacherEmail == 'string' &&
            typeof req.body.msg == 'string') {

            if (req.body.isTutor) {
                if (req.body.subjects instanceof Array) {
                    for (let i = 0; i < req.body.subjects.length; i++) {
                        let elem = req.body.subjects[i];
                        if (typeof elem.name !== 'string') {
                            status = 400;
                            logger.error("Tutee registration (for specific state) with isTutee has malformed subjects.");
                        }
                    }
                } else {
                    status = 400;
                    logger.error("Tutee registration (for specific state) with isTutee missing subjects.");
                }
            }

            if (req.body.redirectTo != undefined && typeof req.body.redirectTo !== "string")
                status = 400;

            if (status < 300) {
                // try registering
                status = await registerStateTutee(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for Tutee registration (for specific state)");
                status = 400;
            }

        } else {
            logger.error("Missing required parameters for Tutee registration (for specific state)");
            status = 400;
        }
    } catch (e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
}

async function registerStateTutee(apiStateTutee: ApiAddStateTutee): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if (apiStateTutee.firstname.length == 0 || apiStateTutee.firstname.length > 100) {
        logger.error("apiStateTutee.firstname outside of length restrictions");
        return 400;
    }

    if (apiStateTutee.lastname.length == 0 || apiStateTutee.lastname.length > 100) {
        logger.error("apiStateTutee.lastname outside of length restrictions");
        return 400;
    }

    if (apiStateTutee.email.length == 0 || apiStateTutee.email.length > 100) {
        logger.error("apiStateTutee.email outside of length restrictions");
        return 400;
    }

    if (apiStateTutee.phone && (apiStateTutee.phone.length == 0 || apiStateTutee.phone.length > 100)) {
        logger.error("apiStateTutee.phone outside of length restrictions");
        return 400;
    }

    if (apiStateTutee.msg.length > 3000) {
        logger.error("apiStateTutee.msg outside of length restrictions");
        return 400;
    }

    const tutee = new Pupil();
    tutee.firstname = apiStateTutee.firstname;
    tutee.lastname = apiStateTutee.lastname;
    tutee.email = apiStateTutee.email.toLowerCase();
    tutee.phone = apiStateTutee.phone;
    tutee.grade = apiStateTutee.grade + ". Klasse";

    if (tutee.phone && ! tutee.phone.startsWith("+49") && ! tutee.phone.startsWith("+41") && ! tutee.phone.startsWith("+43")) {
        logger.error("tutee.phone not from Germany, Swiss or Austria");
        return 400;
    }

    const parsedState = EnumReverseMappings.State(apiStateTutee.state);
    if (!parsedState) {
        logger.error("Invalid value for Tutee registration state (for specific state): " + apiStateTutee.state);
        return 400;
    }

    tutee.newsletter = apiStateTutee.newsletter;
    tutee.msg = apiStateTutee.msg;

    tutee.isParticipant = true;
    tutee.isPupil = false; //default value

    tutee.wix_id = "Z-" + uuidv4();
    tutee.wix_creation_date = new Date();
    tutee.verification = generateToken();
    tutee.subjects = JSON.stringify([]);

    tutee.registrationSource = RegistrationSource.COOPERATION;

    if (apiStateTutee.isTutee) {
        if (apiStateTutee.subjects.length < 1) {
            logger.error("Tutee subjects needs to contain at least one element.");
            return 400;
        }

        for (let i = 0; i < apiStateTutee.subjects.length; i++) {
            if (!checkSubject(apiStateTutee.subjects[i].name)) {
                logger.error("Tutee subjects contain invalid subject " + apiStateTutee.subjects[i].name);
                return 400;
            }
        }

        tutee.isPupil = true;
        tutee.subjects = JSON.stringify(apiStateTutee.subjects);
    }

    const result = await entityManager.findOne(Pupil, { email: tutee.email });
    if (result !== undefined) {
        logger.error("Tutee with given email already exists.");
        return 409;
    }

    //check if teacher email address is valid
    try {
        tutee.teacherEmailAddress = apiStateTutee.teacherEmail.toLowerCase();

        const teacherEmailAddress = new Address(tutee.teacherEmailAddress);

        const school = await entityManager.findOne(School, {
            where: {
                emailDomain: teacherEmailAddress.host
            }
        });

        if (!school || !school.activeCooperation) {
            logger.error("Teacher email address is an address of a school we're not officially cooperating with!");
            return 400;
        }
        tutee.school = school;
        tutee.schooltype = school.schooltype;

        //check if state is equal to that given in the request
        if (parsedState !== school.state) {
            logger.error(`Tutee wanted to register for state ${apiStateTutee.state} while using a school email from state ${school.state}!`);
            return 400;
        }
        tutee.state = school.state;

    }
    catch {
        logger.error("Invalid email address for teacher email during Tutee registration (for specific state)");
        return 400;
    }


    try {
        await entityManager.save(Pupil, tutee);
        await sendVerificationMail(tutee, apiStateTutee.redirectTo);
        await transactionLog.log(new VerificationRequestEvent(tutee));
        return 204;
    } catch (e) {
        logger.error("Unable to add Tutee (for specific state) to database: " + e.message);
        return 500;
    }
}



/**
 * @api {GET} /courses GetSchools
 * @apiVersion 1.1.0
 * @apiDescription
 * Request a list of all available schools we're publicly cooperting with as part of the cooperations with several states in Germany.
 *
 * <p>This endpoint can be called without authentication.</p>
 *
 * @apiName GetSchools
 * @apiGroup Registration
 *
 * @apiUse OptionalAuthentication
 *
 * @apiParam (Query Parameter) {string} state The state of Germany for which the cooperation schools should be returned.
 *
 * @apiUse SchoolInfo
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET "https://api.corona-school.de/api/register/:state/schools"
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getSchoolsHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (typeof req.params.state != 'string') {
            logger.error("Missing required parameter state");
            status = 400;
        }
        else {
            //parse state
            const state = EnumReverseMappings.State(req.params.state);

            if (!state) {
                logger.error(`Given State "${req.params.state}" is unknown`);
                status = 400;
            }
            else {
                let obj = await getSchools(state);

                if (typeof obj == 'number') {
                    status = obj;
                } else {
                    res.json(obj);
                }
            }
        }
    } catch (e) {
        logger.error("An error occurred during GET /register/schools: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function getSchools(state: State): Promise<Array<ApiSchoolInfo> | number> {
    const entityManager = getManager();

    try {
        const schools = await entityManager.find(School, {
            where: {
                state: state,
                activeCooperation: true
            }
        });

        return schools.map( s => {
            return {
                name: s.name,
                emailDomain: s.emailDomain
            };
        });
    } catch (e) {
        logger.error("Can't fetch schools: " + e.message);
        logger.debug(e);
        return 500;
    }

}
