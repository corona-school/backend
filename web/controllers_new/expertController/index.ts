import {Request, Response} from "express";
import {getLogger} from "log4js";
import {ExpertData} from "../../../common/entity/ExpertData";
import { getExpertiseTags, getExperts} from "../../datastore/dataModel";
import {checkgetExpertsHandlerValidity, checkGetUsedTagsHandlerValidity, checkPostContactExpertValidity, checkPutExpertsHandlerValidity} from "./handler";
import {postContactExpert, putExpert, transformAPIExpertData, transformAPIExpertiseTags} from "./internal";
import {ServiceError} from "../../custom_error_handlers/ServiceError";
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
        status = 500;
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
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
        checkgetExpertsHandlerValidity(req, res);
        const experts: ExpertData[] = await getExperts();
        const response = await transformAPIExpertData(experts);
        res.json(response);
    } catch (e) {
        status = 500;
        logger.error("GetExperts failed with ", e.message);
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
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
        checkPutExpertsHandlerValidity(req, res);
        status = await putExpert(req.params.id, res.locals.user, req.body);
    } catch (e) {
        status = 500;
        logger.error("PUT expert/:id failed with ", e.message);
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
    }
    res.status(status).end();
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
        checkGetUsedTagsHandlerValidity(req, res);
        const tags= await getExpertiseTags({relations: ["expertData"]});
        const apiResponse = await transformAPIExpertiseTags(tags);
        res.json(apiResponse);
    } catch (e) {
        status = 500;
        logger.error("GetUsedTags failed with ", e);
        if (e instanceof ServiceError) {
            status = e.getRESTStatusCode();
        }
    }
    res.status(status).end();
}