import {getLogger} from 'log4js';
import {Request, Response} from 'express';
import {Pupil} from '../../../common/entity/Pupil';
import {Student} from '../../../common/entity/Student';
import {getTransactionLog} from '../../../common/transactionlog';
import {getManager} from 'typeorm';
import {Match} from '../../../common/entity/Match';

const logger = getLogger();

/**
 * @api {GET} /certificate/:student/:pupil getCertificate
 * @apiVersion 1.1.0
 * @apiDescription
 * Fetch a certificate
 *
 * This endpoint allows fetching a certificate (as PDF) with the second page customized for a pupil.
 * It is only available for students.
 *
 * @apiParam (URL Parameter) {string} student ID of the student
 * @apiParam (URL Parameter) {string} pupil ID of a matched pupil
 *
 * @apiParam (Query Parameter) {number} endDate Unix Timestamp for the end date
 * @apiParam (Query Parameter) {string} subjects Must be a comma seperated string of the subjects. Only subjects that are matched are available
 * @apiParam (Query Parameter) {number} hoursPerWeek Hours per week helped
 * @apiParam (Query Parameter) {number} hoursTotal Total hours helped
 * @apiParam (Query Parameter) {string} categories Comma seperated integers specifying indices for predefined help categories. Maximum count: 5
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://dashboard.corona-school.de/api/certificate/00000000-0000-0002-0001-1b4c4c526364/00000000-0000-0001-0001-1b4c4c526364
 *
 * @apiUse Authentication
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function certificateHandler(req: Request, res: Response) {
    let status;

    try {
        if (req.params.student != undefined && req.params.pupil != undefined && (res.locals.user instanceof Student || res.locals.user instanceof Pupil)) {
            let certificate = await generateCertificate(res.locals.user, req.params.student, req.params.pupil);
            if (certificate.status == 200) {
                res.send(certificate.pdf);
            }
            status = certificate.status;
        } else {
            status = 500;
        }
    } catch (e) {
        logger.error("Unexpected format of express request: " + e.message);
        logger.debug(req, e);
        status = 500;
    }
    res.status(status).contentType('application/pdf').end();
}

async function generateCertificate(requestor: (Pupil | Student), studentid: string, pupilid: string): Promise<{ status: number, pdf: any }> {
    const entityManager = getManager();
    const transactionLog = getTransactionLog();

    let ret = {
        status: 500,
        pdf: null
    };

    // Only students may request
    if (requestor instanceof Pupil) {
        ret.status = 403;
        return ret;
    }

    // Students may only request for themselves
    if (requestor.wix_id != studentid) {
        ret.status = 403;
        return ret;
    }

    // Students may only request for their matches
    let pupil = await entityManager.findOne(Pupil, {wix_id: pupilid});
    let matches = await entityManager.findOne(Match, {student: requestor, pupil: pupil});
    if (pupil == undefined || matches == undefined) {
        ret.status = 400;
        return ret;
    }

    // Todo: Load PDF and modify
    // todo: Save request in transactionlog

    return ret;
}
