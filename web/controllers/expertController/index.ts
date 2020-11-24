import {Request, Response} from "express";
import {Student} from "../../../common/entity/Student";
import {getLogger} from "log4js";
import {Pupil} from "../../../common/entity/Pupil";
import {ApiContactExpert} from "./format";
import {getTransactionLog} from "../../../common/transactionlog";
import {getManager} from "typeorm";
import {ExpertData} from "../../../common/entity/ExpertData";
import mailjet from "../../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../../common/mails/config";
import ContactExpertEvent from "../../../common/transactionlog/types/ContactExpertEvent";

const logger = getLogger();

/**
 * @api {POST} /expert/:id/contact
 * @apiVersion 1.1.0
 * @apiDescription
 * Writes an email to an expert
 *
 * If email was successfully sent, status code 200 us returned.
 * Note: delivery cannot be guaranteed
 *
 * @apiName ContactExpert
 * @apiGroup Expert
 *
 * @apiUse Authentication
 * @apiUse ContentType
 *
 * @apiUse ContactExpert
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST =H "Token: <AUTHTOKEN>" -H "Content-Type: application/json" https://[HOST]/api/expert/:id/contact
 *
 * @apiUse StatusOk
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
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

            logger.debug(`res.locals.user instanceof Student || res.locals.user instanceof Pupil: ${res.locals.user instanceof Student || res.locals.user instanceof Pupil}`);
            logger.debug(`req.params.id != undefined: ${req.params.id != undefined}`);
            logger.debug(`typeof req.body.emailText == 'string': ${typeof req.body.emailText == 'string'}`);
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