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

const logger = getLogger();

/**
 * @api {POST} /expert/:id/contact contactExpert
 * @apiVersion 1.0.1
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
        if ((res.locals.user instanceof Student || res.locals.user instanceof Pupil)
            && req.params.id != undefined
            && typeof req.body.emailText == 'string') {

            if (req.body.emailText.length === 0) {
                logger.warn(`Empty email text specified when trying to send mentor-contact-mail!`);
                status = 400;
            }

            if (status < 300) {
                status = await postContactExpert(req.params.id, res.locals.user, req.body);
            }
        } else {
            status = 400;
            logger.warn("Invalid request for POST /expert/:id/contact");
            logger.debug(req.body);
        }
    } catch (e) {
        logger.error("POST /expert/:id/contact failed with ", e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function postContactExpert(id: string, user: Pupil | Student, apiContactExpert: ApiContactExpert): Promise<number> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    const expert = await entityManager.findOne(ExpertData, { id: Number(id) });
    if (expert === undefined) {
        logger.warn(`Expert with ID ${id} does not exist.`);
        return 404;
    }

    const receiverAdress = expert.contactEmail;
    const receiverName = `${expert.student.firstname} ${expert.student.lastname}`;
    const replyToAdress = user.email;
    const replyToName = `${user.firstname} ${user.lastname}`;

    await mailjet.sendPure(
        apiContactExpert.subject ?? "",
        apiContactExpert.emailText,
        DEFAULTSENDERS.noreply,
        receiverAdress,
        replyToName,
        receiverName,
        replyToAdress,
        replyToName
    );

    await transactionLog.log(new ContactExpertEvent(user, apiContactExpert));

    return 200;
}

/**
 * @api {GET} /expert getExperts
 * @apiVersion 1.0.1
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
    const entityManager = getManager();

    let status = 200;
    try {
        if (res.locals.user instanceof Student || res.locals.user instanceof Pupil) {

            const experts: ExpertData[] = await entityManager
                .createQueryBuilder(ExpertData, "e")
                .leftJoinAndSelect("e.student", "s")
                .leftJoinAndSelect("e.expertiseTags", "t")
                .where("e.active AND e.allowed")
                .getMany();

            let apiResponse: ApiGetExpert[] = [];

            for (let i = 0; i < experts.length; i++) {
                let apiExpert = new ApiGetExpert();
                apiExpert.id = experts[i].id;
                apiExpert.firstName = experts[i].student.firstname;
                apiExpert.lastName = experts[i].student.lastname;
                apiExpert.description = experts[i].description;
                apiExpert.expertiseTags = experts[i].expertiseTags?.map(t => (t.name)) || [];

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
 * @api {POST} /expert/:id putExpert
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
        if (res.locals.user instanceof Student
            && req.params.id != undefined
            && (req.body.contactEmail === undefined || typeof req.body.contactEmail === "string")
            && (req.body.description === undefined || typeof req.body.description === "string")
            && req.body.expertiseTags instanceof Array
            && typeof req.body.active === "boolean") {

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

    const entityManager = getManager();

    const expertiseTags: ExpertiseTag[] = await GetExpertiseTagEntities(info.expertiseTags);

    let expertData = await entityManager.findOne(ExpertData, { student: student });
    if (!expertData) {
        expertData = new ExpertData();
        expertData.student = student;
    }

    logger.debug(expertData);

    expertData.contactEmail = info.contactEmail ?? student.email;
    expertData.description = info.description;
    expertData.expertiseTags = expertiseTags;
    expertData.active = info.active;
    expertData.allowed = false;

    try {
        await entityManager.save(ExpertiseTag, expertiseTags);
        await entityManager.save(ExpertData, expertData);
    } catch (e) {
        logger.error("Failed to save expert data with: ", e.message);
        return 500;
    }
    return 204;
}


async function GetExpertiseTagEntities(tagNames: string[]): Promise<ExpertiseTag[]> {
    const entityManager = getManager();

    const tags: ExpertiseTag[] = await entityManager.find(ExpertiseTag, { where: tagNames.map(t => ({ name: t }))});

    for (let i = 0; i < tagNames.length; i++) {
        if (!tags.map(t => (t.name)).includes(tagNames[i])) {
            let newTag = new ExpertiseTag();
            newTag.name = tagNames[i];
            tags.push(newTag);
        }
    }

    return tags;
}

/**
 * @api {GET} /expert/tags getUsedTags
 * @apiVersion 1.0.1
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
            const entityManager = getManager();

            const tags = await entityManager.find(ExpertiseTag, {
                relations: ["expertData"]
            });

            const apiResponse: ApiGetExpertiseTag[] = [];

            for (let i = 0; i < tags.length; i++) {
                let apiTag: ApiGetExpertiseTag = {
                    name: tags[i].name,
                    experts: tags[i].expertData.map(e => e.id)
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