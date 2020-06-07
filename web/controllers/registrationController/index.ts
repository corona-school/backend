import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { ApiAddTutor, ApiAddTutee } from './format';
import { sendVerificationMail } from '../../../jobs/backend/verification';
import { getManager } from 'typeorm';
import { getTransactionLog } from '../../../common/transactionlog';
import { Student } from '../../../common/entity/Student';
import VerificationRequestEvent from '../../../common/transactionlog/types/VerificationRequestEvent';
import { checkSubject } from '../userController/format';
import { Pupil } from '../../../common/entity/Pupil';

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
 * @apiUse AddTutorSubject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutor -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */
export async function postTutorHandler(req: Request, res: Response) {
    let status = 204;

    try {

        if(typeof req.body.firstname == 'string' &&
           typeof req.body.lastname == 'string' &&
           typeof req.body.email == 'string' &&
           typeof req.body.isTutor == 'boolean' &&
           typeof req.body.isOfficial == 'boolean' &&
           typeof req.body.newsletter == 'boolean' &&
           typeof req.body.msg == 'string') {

            if(req.body.isTutor) {
                if(req.body.subjects instanceof Array) {
                    for(let i = 0; i < req.body.subjects.length; i++) {
                        let elem = req.body.subjects[i];
                        if(typeof elem.name !== 'string'
                        || typeof elem.minGrade !== 'number' 
                        || typeof elem.maxGrade !== 'number') {
                            status = 400;
                            logger.error("Tutor registration with isTutor has malformed subjects.")
                        }
                    }
                } else {
                    status = 400;
                    logger.error("Tutor registration with isTutor missing subjects.")                    
                }                
            }

            if(req.body.isOfficial) {
                if(typeof req.body.state == 'string' ||
                typeof req.body.university == 'string' ||
                typeof req.body.module == 'string' ||
                typeof req.body.hours == 'number') {
                    status = 400;
                    logger.error("Tutor registration with isOfficial has incomplete/invalid parameters")
                }
            }

            if(status < 300) {
                // try registering
                status = await registerTutor(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for Tutor registration")
                status = 400;
            }
 
        } else {
            logger.error("Missing required parameters for Tutor registration");
            status = 400;
        }
    } catch(e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
}

async function registerTutor(apiTutor: ApiAddTutor): Promise<number> {
    // TODO: check State and TeacherModule enums and values

    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if(apiTutor.firstname.length == 0 || apiTutor.firstname.length > 100) {
        return 400;
    }

    if(apiTutor.lastname.length == 0 || apiTutor.lastname.length > 100) {
        return 400;
    }
    
    if(apiTutor.email.length == 0 || apiTutor.email.length > 100) {
        return 400;
    }

    if(apiTutor.msg.length == 0 || apiTutor.msg.length > 3000) {
        return 400;
    }

    const tutor = new Student();
    tutor.firstname  = apiTutor.firstname;
    tutor.lastname = apiTutor.lastname;
    tutor.email = apiTutor.email;    
    tutor.newsletter = apiTutor.newsletter;
    tutor.msg = apiTutor.msg;

    if(apiTutor.isTutor) {
        if(apiTutor.subjects.length < 1) {
            logger.warn("Subjects needs to contain at least one element.");
            return 400;
        }

        for(let i = 0; i < apiTutor.subjects.length; i++) {
            if(!checkSubject(apiTutor.subjects[i].name)) {
                logger.warn("Subjects contain invalid subject " + apiTutor.subjects[i].name);
                return 400;
            }
        }

        tutor.isInstructor = true;
        tutor.subjects = JSON.stringify(apiTutor.subjects);
    }

    if(apiTutor.isOfficial) {
        if(apiTutor.university.length == 0 || apiTutor.university.length > 100) {
            return 400;
        }

        if(apiTutor.module.length == 0 || apiTutor.module.length > 100) {
            return 400;
        }
        
        if(apiTutor.hours > 1000) {
            return 400;
        }

        // tutor.state = apiTutor.state;
        tutor.university = apiTutor.university;
        // tutor.module = apiTutor.module;
        tutor.moduleHours = apiTutor.hours;
    }

    try {
        // Saving may fail for some reasons, e.g. duplicate user/email errors.
        await entityManager.save(Student, tutor);
        await sendVerificationMail(tutor);
        await transactionLog.log(new VerificationRequestEvent(tutor));
        return 204;
    } catch(e) {
        logger.error("Unable to add Tutor to database: " + e.message)
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
 * @apiUse AddTuteeSubject
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Content-Type: application/json" https://api.corona-school.de/api/register/tutee -d "<REQUEST>"
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusInternalServerError
 */
export async function postTuteeHandler(req: Request, res: Response) {
    let status = 204;

    try {

        if(typeof req.body.firstname == 'string' &&
           typeof req.body.lastname == 'string' &&
           typeof req.body.email == 'string' &&
           typeof req.body.grade == 'number' &&
           typeof req.body.state == 'string' &&
           typeof req.body.school == 'string' &&
           typeof req.body.isTutee == 'boolean' &&
           typeof req.body.newsletter == 'boolean' &&
           typeof req.body.msg == 'string') {

            if(req.body.isTutor) {
                if(req.body.subjects instanceof Array) {
                    for(let i = 0; i < req.body.subjects.length; i++) {
                        let elem = req.body.subjects[i];
                        if(typeof elem.name !== 'string') {
                            status = 400;
                            logger.error("Tutee registration with isTutee has malformed subjects.")
                        }
                    }
                } else {
                    status = 400;
                    logger.error("Tutee registration with isTutee missing subjects.")                    
                }                
            }

            if(status < 300) {
                // try registering
                status = await registerTutee(req.body);
            } else {
                logger.error("Malformed parameters in optional fields for Tutor registration")
                status = 400;
            }

        } else {
            logger.error("Missing required parameters for Tutee registration");
            status = 400;
        }
    } catch(e) {
        logger.error("Unexpected request format: " + e.message);
        logger.debug(req, e);
        status = 500;
    }

    res.status(status).end();
}

async function registerTutee(apiTutee: ApiAddTutee): Promise<number> {
    // TODO: check State and Schooltype values

    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    if(apiTutee.firstname.length == 0 || apiTutee.firstname.length > 100) {
        return 400;
    }

    if(apiTutee.lastname.length == 0 || apiTutee.lastname.length > 100) {
        return 400;
    }
    
    if(apiTutee.email.length == 0 || apiTutee.email.length > 100) {
        return 400;
    }

    if(apiTutee.msg.length == 0 || apiTutee.msg.length > 3000) {
        return 400;
    }

    const tutee = new Pupil();
    tutee.firstname  = apiTutee.firstname;
    tutee.lastname = apiTutee.lastname;
    tutee.email = apiTutee.email;
    tutee.grade = apiTutee.grade + ". Klasse";
    //tutee.state = 
    //tutee.schooltype = 
    tutee.newsletter = apiTutee.newsletter;
    tutee.msg = apiTutee.msg;

    if(apiTutee.isTutee) {
        if(apiTutee.subjects.length < 1) {
            logger.warn("Tutee subjects needs to contain at least one element.");
            return 400;
        }

        for(let i = 0; i < apiTutee.subjects.length; i++) {
            if(!checkSubject(apiTutee.subjects[i].name)) {
                logger.warn("Tutee subjects contain invalid subject " + apiTutee.subjects[i].name);
                return 400;
            }
        }

        tutee.isPupil = true;
        tutee.subjects = JSON.stringify(apiTutee.subjects);
    }

    try {
        // Saving may fail for some reasons, e.g. duplicate user/email errors.
        await entityManager.save(Pupil, tutee);
        await sendVerificationMail(tutee);
        await transactionLog.log(new VerificationRequestEvent(tutee));
        return 204;
    } catch(e) {
        logger.error("Unable to add Tutee to database: " + e.message)
        return 500;
    }
}