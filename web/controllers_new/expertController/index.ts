import {Request, Response} from "express";
import {Student} from "../../../common/entity/Student";
import {getLogger} from "log4js";
import {Pupil} from "../../../common/entity/Pupil";
import {ApiContactExpert, ApiGetExpert, ApiGetExpertiseTag, ApiPutExpert} from "./format";
import {getTransactionLog} from "../../../common/transactionlog";
import {getManager} from "typeorm";
import {ExpertData} from "../../../common/entity/ExpertData";
import mailjet from "../../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../../common/mails/config";
import ContactExpertEvent from "../../../common/transactionlog/types/ContactExpertEvent";
import {ExpertiseTag} from "../../../common/entity/ExpertiseTag";
import {ExpertAllowedIndication} from "../../../common/jufo/expertAllowedIndication";
import {getExpertById, getExpertByStudent, GetExpertiseTagEntities, getExpertiseTags, getExperts, saveExpertData, saveExpertiseTags} from "../../datastore/dataModel";
import {checkPostContactExpertValidity, checkValidity} from "./handler";
import {isInstance} from "class-validator";
import {postContactExpert} from "./internal";

const logger = getLogger();

/**
 * @api {POST} /expert/:id/contact contactExpert
 * @apiVersion 1.1.0
 * @apiDescription
 * Writes an email to an expert
 *
 * If email was successfully sent, status code 200 is returned.
 * Note: delivery cannot be guaranteed.
 *
 * @apiName ContactExpert
 * @apiGroup Expert
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse ContactExpert
 *
 * @apiParam (URL Parameter) {string} id Expert Id
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://[HOST]/api/expert/:id/contact
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusNotFound
 * @apiUse StatusInternalServerError
 */
export async function postContactExpertHandler(req: Request, res: Response) {
    let status = 200;
    try {
        checkPostContactExpertValidity(req, res);
        status = await postContactExpert(req.params.id, res.locals.user, req.body);
    } catch (e) {
        logger.error(e.message);
        status = e.status || 500;
    }
    res.status(status).end();
}


/**
 * @api {GET} /expert getExperts
 * @apiVersion 1.1.0
 * @apiDescription
 * Get all active and allowed experts in the database
 *
 * Only students or pupils with a valid token in the header can use the API.
 *
 * @apiName getExperts
 * @apiGroup Expert
 *
 * @apiUse Expert
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://[HOST]/api/expert
 *
 * @apiUse StatusOk
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getExpertsHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student || res.locals.user instanceof Pupil) {

            const experts: ExpertData[] = await getExperts();

            let apiResponse: ApiGetExpert[] = [];

            for (const expert of experts) {
                const expertiseTags = expert.expertiseTags?.map(t => (t.name)) || [];
                const projectFields = await expert.student.getProjectFields().then((res) => res.map(f => f.name));
                let apiExpert = new ApiGetExpert(expert.id, expert.student.firstname, expert.student.lastname, expert.description, expertiseTags, projectFields);
                apiResponse.push(apiExpert);
            }

            res.json(apiResponse);
        } else {
            logger.warn("Someone who is neither student or pupil wanted to access the expert data.");
            status = 403;
        }
    } catch (e) {
        logger.error("GetExperts failed with ", e);
        status = 500;
    }
    res.status(status).end();
}

/**
 * @api {PUT} /expert/:id putExpert
 * @apiVersion 1.1.0
 * @apiDescription
 * As a student become an expert or change my expert data
 *
 * The user has to be authenticated.
 *
 * @apiName postExpert
 * @apiGroup Expert
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/expert/<ID>
 *
 * @apiParam (URL Parameter) {string} id User Id
 *
 * @apiUse PutExpert
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function putExpertHandler(req: Request, res: Response) {
    let status = 204;

    try {
        if (checkValidity(req, res)) {

            for (let i = 0; i < req.body.expertiseTags.length; i++) {
                if (typeof req.body.expertiseTags[i] !== "string") {
                    logger.error(`Invalid expertise tag ${JSON.stringify(req.body.expertiseTags[i])}`);
                    status = 400;
                }
            }

            if (status < 300) {
                status = await putExpert(req.params.id, res.locals.user, req.body);
            }
        } else {
            logger.warn("Invalid request parameters for PUT /expert/:id");
            status = 400;
        }
    } catch (e) {
        logger.error("PUT expert/:id failed with ", e.message);
        status = 500;
    }
    res.status(status).end();
}

async function putExpert(wixId: string, student: Student, info: ApiPutExpert): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn(`Person with id ${student.wix_id} tried to access data from id ${wixId}`);
        return 403;
    }

    if (!student.isProjectCoach) {
        logger.warn("Non-project-coach tried to put expert data.");
        return 403;
    }

    const expertiseTags: ExpertiseTag[] = await GetExpertiseTagEntities(info.expertiseTags);

    let expertData = await getExpertByStudent({student: student});

    expertData.contactEmail = info.contactEmail ?? student.email;
    expertData.description = info.description;
    expertData.expertiseTags = expertiseTags;
    expertData.active = info.active;
    expertData.allowed = ExpertAllowedIndication.PENDING;

    try {
        await saveExpertiseTags(expertiseTags);
        await saveExpertData(expertData);
    } catch (e) {
        logger.error("Failed to save expert data with: ", e.message);
        return 500;
    }
    return 204;
}


/**
 * @api {GET} /expert/tags getUsedTags
 * @apiVersion 1.1.0
 * @apiDescription
 * Get all expertise tags in the database
 *
 * Only students or pupils with a valid token in the header can use the API.
 *
 * @apiName getUsedTags
 * @apiGroup Expert
 *
 * @apiUse GetExpertiseTag
 *
 * @apiUse Authentication
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://[HOST]/api/expert/tags
 *
 * @apiUse StatusOk
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 */
export async function getUsedTagsHandler(req: Request, res: Response) {
    let status = 200;
    try {
        if (res.locals.user instanceof Student || res.locals.user instanceof Pupil) {
            const tags = await getExpertiseTags({relations: ["expertData"]});
            const apiResponse: ApiGetExpertiseTag[] = [];

            for (const tag of tags) {
                let apiTag: ApiGetExpertiseTag = {
                    name: tag.name,
                    experts: tag.expertData.map(e => e.id)
                };
                apiResponse.push(apiTag);
            }

            res.json(apiResponse);
        } else {
            logger.warn("Someone who is neither student or pupil wanted to access the expertise tags.");
            status = 401;
        }
    } catch (e) {
        logger.error("GetUsedTags failed with ", e);
        status = 500;
    }
    res.status(status).end();
}