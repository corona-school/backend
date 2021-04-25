import { Request, Response } from 'express';
import { getLogger } from 'log4js';
import { getManager } from 'typeorm';
import { InterestConfirmationStatus } from '../../../common/entity/PupilTutoringInterestConfirmationRequest';
import { changeStatus } from '../../../common/interest-confirmation/tutoring/persistence/change-status';
import { EnumReverseMappings } from '../../../common/util/enumReverseMapping';

const logger = getLogger();


/**
 * @api {POST} /interest-confirmation/status ChangePupilInterestConfirmationRequestStatus
 * @apiVersion 1.1.0
 * @apiDescription
 * Changes the status of a pupil interest confirmation as specified by the given token
 *
 */
export async function postInterestConfirmationRequestStatus(req: Request, res: Response) {
    let status = 200;
    try {
        if (typeof req.body.token === "string" && typeof req.body.status === "string") {
            // Check if status is valid
            const confirmationStatus = EnumReverseMappings.PupilTutoringInterestConfirmationStatus(req.body.status);
            if (!confirmationStatus || ![InterestConfirmationStatus.CONFIRMED, InterestConfirmationStatus.REFUSED].includes(confirmationStatus)) {
                logger.warn(`Invalid interest confirmation status ${req.body.status} specified when trying to change interest-confirmation status!`);
                status = 400;
            }
            //make sure that token is non-empty
            if (req.body.token.length === 0) {
                logger.warn(`Empty token specified when trying to change interest-confirmaion status!`);
                status = 400;
            }

            if (status < 300) {
                status = await changeInterestConfirmationRequestStatus(req.body.token, confirmationStatus);
            }
        } else {
            status = 400;
            logger.warn("Invalid request for POST /interest-confirmation/status");
            logger.debug(req.body);
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).end();
}

async function changeInterestConfirmationRequestStatus(token: string, confirmationStatus: InterestConfirmationStatus): Promise<number> {
    const entityManager = getManager();

    try {
        await changeStatus(token, confirmationStatus, entityManager);

        logger.info(`Successfully changed interest-confirmation status of pupil (token='${token}') to '${confirmationStatus}'`);

        return 200;
    } catch (e) {
        logger.error(`Can't change interest-confirmation status of pupil (token='${token}') to status '${confirmationStatus}', ` + e.message);
        return 500;
    }
}