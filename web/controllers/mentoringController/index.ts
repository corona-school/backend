import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { Student } from '../../../common/entity/Student';
import {
    ApiContactMentor
} from './format';
import { getTransactionLog } from '../../../common/transactionlog';
import { EnumReverseMappings } from '../../../common/util/enumReverseMapping';
import { MentoringCategory } from '../../../common/mentoring/categories';
import mailjet from '../../../common/mails/mailjet';
import { DEFAULTSENDERS } from '../../../common/mails/config';
import ContactMentorEvent from '../../../common/transactionlog/types/ContactMentorEvent';
import {getNextDueEvent, listFiles, listVideos} from "../../../common/google";
import List = Mocha.reporters.List;
import { material } from "../../../common/mentoring/material";

const logger = getLogger();

/**
 * @api {POST} /mentoring/contact ContactMentor
 * @apiVersion 1.1.0
 * @apiDescription
 * Writes an email to the mentoring team in the specified category
 *
 * If email was successfully sent out, status code 200 is returned.
 * Note: delivery cannot be guaranteed
 *
 * @apiName ContactMentor
 * @apiGroup Mentoring
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse ContactMentor
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://api.corona-school.de/api/mentoring/contact -d "<REQUEST>"
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function postContactMentorHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student) {
            if (typeof req.body.emailText == 'string' &&
                typeof req.body.category == 'string') {

                // Check if category is valid
                if (!EnumReverseMappings.MentoringCategory(req.body.category)) {
                    logger.warn(`Invalid mentoring category "${req.body.category}" specified when trying to send mentor-contact-mail!`);
                    status = 400;
                }
                //make sure that text is non-empty
                if (req.body.emailText.length === 0) {
                    logger.warn(`Empty email text specified when trying to send mentor-contact-mail!`);
                    status = 400;
                }

                if (status < 300) {
                    status = await postContactMentor(res.locals.user, req.body);
                }
            } else {
                status = 400;
                logger.warn("Invalid request for POST /course/:id/subcourse");
                logger.debug(req.body);
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to contact a mentor");
            logger.debug(res.locals.user);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function postContactMentor(student: Student, apiContactMentor: ApiContactMentor): Promise<number> {
    const transactionLog = getTransactionLog();

    const mentoringCategory = EnumReverseMappings.MentoringCategory(apiContactMentor.category);

    const replyToAddress = student.email;
    const replyToName = `${student.firstname} ${student.lastname}`;

    const receiverAddress = MentoringCategory.emailAddress(mentoringCategory);

    await mailjet.sendPure(
        apiContactMentor.subject ?? "",
        apiContactMentor.emailText,
        DEFAULTSENDERS.noreply,
        receiverAddress,
        replyToName,
        undefined,
        replyToAddress,
        replyToName
    );

    //log that mentor contact
    await transactionLog.log(new ContactMentorEvent(student, {
        category: mentoringCategory,
        subject: apiContactMentor.subject,
        text: apiContactMentor.emailText
    }));

    return 200;
}

/**
 * @api {GET} /mentoring/material GetMaterial
 * @apiVersion 1.1.0
 * @apiDescription
 * Query for access data for supportive material for students
 *
 * @apiName GetMaterial
 * @apiGroup Mentoring
 *
 * @apiParam (QueryParameter) {string} type The type of the queried ressource. Can be either 'files' or 'playlist'
 * @apiParam (QueryParameter) {string} location The location key for the queried ressource. Possible keys are specified in /common/mentoring/material.ts
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/mentoring/material?type=files&location=pdf_entry"
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getMaterial(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student){
            const { type, location } = req.query;
            if (!(location in material)) {
                status = 400;
                logger.warn("Invalid location for mentoring materials in GET /mentoring/material");
                logger.debug(location);
                return res.status(status).end();
            }

            if (type === "files") {
                let folder = await listFiles(material[location]);
                return res.status(status).json(folder).end();
            }

            if (type === "playlist") {
                let playlist = await listVideos(material[location]);
                return res.status(status).json(playlist).end();
            }

            else {
                status = 400;
                logger.warn("Invalid material type in GET /mentoring/material");
                logger.debug(location);
                return res.status(status).end();
            }
        } else {
            status = 403;
            logger.warn("A non-student wanted to access mentoring material.");
            return res.status(status).end();
        }
    } catch (e) {
        logger.error("Error when querying for mentoring material: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    return res.status(status).end();
}

/**
 * @api {GET} /mentoring/feedbackCall GetFeedbackCallLink
 * @apiVersion 1.1.0
 * @apiDescription
 * Query for the next feedback call date and its meeting link
 *
 * @apiName GetFeedbackCallLink
 * @apiGroup Mentoring
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/mentoring/feedbackCall"
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getFeedbackCallData(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student){
            let date = await getNextDueEvent(material.call_calendar);
            return res.status(status).json(date).end();
        } else {
            status = 403;
            logger.warn("A non-student wanted to access student feedback call data.");
            return res.status(status).end();
        }
    } catch (e) {
        logger.error("Error when querying for mentoring feedback call data: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    return res.status(status).end();
}