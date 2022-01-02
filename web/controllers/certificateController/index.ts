import { getLogger } from 'log4js';
import { Request, Response } from 'express';
import { Pupil } from '../../../common/entity/Pupil';
import { Student } from '../../../common/entity/Student';
import { assert } from 'console';
import { createRemissionRequestPDF, createRemissionRequestVerificationPage } from "../../../common/remission-request";
import { CERTIFICATE_MEDIUMS, CertificateState, ICertificateCreationParams, createCertificate, DefaultLanguage, LANGUAGES, Language, signCertificate, VALID_BASE64, getCertificatePDF, getConfirmationPage, getCertificatesFor, CertificateError } from '../../../common/certificate';

const logger = getLogger();


// certificate types
const CERTIFICATETYPES = ["participation", "remission"] as const;
type CertificateType = (typeof CERTIFICATETYPES)[number];
const DefaultCertificateType = "participation";

/**
 * @api {POST} /certificate/create getCertificate
 * @apiVersion 1.1.0
 * @apiDescription
 * Create a certificate
 *
 * It is only available for students.
 *
 * @apiParam (JSON Body) {string} pupil UUID of the pupil
 * @apiParam (JSON body) {number} endDate Unix Timestamp for the end date
 * @apiParam (JSON body) {string} subjects Must be a comma seperated string of the subjects. Only subjects that are matched are available
 * @apiParam (JSON body) {number} hoursPerWeek Hours per week helped
 * @apiParam (JSON body) {number} hoursTotal Total hours helped
 * @apiParam (JSON body) {string} medium Support medium
 * @apiParam (JSON body) {string} categories String of category texts for pupil's student description, separated by newlines
 * @apiParam (JSON body) {string} automatic if set, the pupil will automatically receive a signature request
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/00000000-0000-0002-0001-1b4c4c526364/00000000-0000-0001-0001-1b4c4c526364
 *
 * @apiUse Authentication
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function createCertificateEndpoint(req: Request, res: Response) {
    try {
        assert(res.locals.user, "Must be logged in");

        const { pupil, automatic, endDate, subjects, hoursPerWeek, hoursTotal, medium, activities, ongoingLessons } = req.body;
        const requestor = res.locals.user as Student;

        if (requestor instanceof Pupil) {
            return res.status(403).send("Only students may request certificates");
        }

        if (!pupil || !endDate || !subjects || hoursPerWeek === undefined || hoursTotal === undefined || !medium || !activities) {
            return res.status(400).send("Missing parameters");
        }

        if (automatic !== undefined && typeof automatic !== "boolean") {
            return res.status(400).send("automatic must be boolean");
        }

        if (typeof endDate !== "number") {
            return res.status(400).send("endDate must be a number");
        }

        if (!Array.isArray(subjects) || subjects.some(it => typeof it !== "string")) {
            return res.status(400).send("subjects must be an array of strings");
        }

        if (typeof hoursPerWeek !== "number" || hoursPerWeek < 0) {
            return res.status(400).send("hoursPerWeek must be a positive number");
        }

        if (typeof hoursTotal !== "number" || hoursTotal < 0) {
            return res.status(400).send("hoursTotal must be a positive number");
        }

        if (!CERTIFICATE_MEDIUMS.includes(medium)) {
            return res.status(400).send(`medium must be one of ${CERTIFICATE_MEDIUMS}`);
        }

        if (!Array.isArray(activities) || activities.some(it => typeof it !== "string")) {
            return res.status(400).send("categories must be an array of strings");
        }

        if (ongoingLessons !== undefined && typeof ongoingLessons !== "boolean") {
            return res.status(400).send("ongoingLessons must be boolean");
        }

        let state = automatic ? CertificateState.awaitingApproval : CertificateState.manual;

        let params: ICertificateCreationParams = {
            endDate,
            subjects: subjects.join(","),
            hoursPerWeek,
            hoursTotal,
            medium,
            activities: activities.join("\n"),
            ongoingLessons,
            state
        };

        // Students may only request for their matches

        const certificate = await createCertificate(requestor, pupil, params);

        return res.json({ uuid: certificate.uuid, automatic });
    } catch (error) {
        if (error instanceof CertificateError) {
            return res.status(400).send(error.message);
        }

        logger.error("Unexpected format of express request: " + error.message);
        logger.debug(req, error);
        return res.status(500).send("Internal server error");
    }
}


/**
 * @api {GET} /certificate/:certificateId?lang=... getCertificateConfirmation
 * @apiVersion 1.1.0
 * @apiDescription
 * View a certificate
 *
 * Returns the certificate as PDF
 *
 * @apiParam (URL Parameter) {string} certificateId UUID of the certificate
 * @apiParam (URL Query)     {string} lang=de The language
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCertificateEndpoint(req: Request, res: Response) {
    try {
        const { certificateId } = req.params;
        let { lang } = req.query;
        const requestor = res.locals.user as Student;
        assert(requestor, "No user set");

        if (lang === undefined) {
            lang = DefaultLanguage;
        }

        if (!LANGUAGES.includes(lang as Language)) {
            return res.status(400).send("Language not known");
        }

        if (typeof certificateId !== "string") {
            return res.status(400).send("Missing parameter certificateId");
        }

        const pdf = await getCertificatePDF(certificateId, requestor, lang as Language);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });
        return res.end(pdf);
    } catch (error) {
        if (error instanceof CertificateError) {
            return res.status(400).send(error.message);
        }

        logger.error("Failed to generate certificate confirmation", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

/**
 * @api {GET} /certificate/:certificateId/confirmation?lang=... getCertificateConfirmation
 * @apiVersion 1.1.0
 * @apiDescription
 * View a certificate
 *
 * This endpoint allows looking at a certificate (as HTML) as confirmation link printed on the PDF Certificate.
 *
 * @apiParam (URL Parameter) {string} certificateId UUID of the certificate
 * @apiParam (URL Query)     {string} lang=de The language
 *
 * @apiName getCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384/confirmation
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getCertificateConfirmationEndpoint(req: Request, res: Response) {
    try {
        const { certificateId } = req.params;
        let { lang, ctype } = req.query;

        if (lang === undefined) {
            lang = DefaultLanguage;
        }

        if (ctype === undefined) {
            ctype = DefaultCertificateType;
        }

        if (!LANGUAGES.includes(lang as Language)) {
            return res.status(400).send("Language not known");
        }

        if (!CERTIFICATETYPES.includes(ctype as CertificateType)) {
            return res.status(400).send("Certificate type not known");
        }

        if (typeof certificateId !== "string") {
            return res.status(400).send("Missing parameter certificateId");
        }
        if (ctype === "participation") {
            const confirmation = await getConfirmationPage(certificateId, lang as Language);

            return res.send(confirmation);
        } else {
            const remissionRequestVerificationPage = await createRemissionRequestVerificationPage(certificateId.toUpperCase());

            if (!remissionRequestVerificationPage) {
                return res.status(404).send("<h1>Zertifikatslink nicht valide.</h1>");
            }

            return res.send(remissionRequestVerificationPage);
        }
    } catch (error) {
        if (error instanceof CertificateError) {
            return res.status(400).send(error.message);
        }

        logger.error("Failed to generate certificate confirmation", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}


/**
 * @api {POST} /certificate/:certificateId/sign
 * @apiVersion 1.1.0
 * @apiDescription
 * Sign a signature in the automatic signature approval process
 *
 * @apiParam (JSON Body) {string} signaturePupil  The signature of the pupil encoded as base64 JPG. Either the pupil or the parent signature must be set.
 * @apiParam (JSON Body) {string} signatureParent The signature of the parent encoded as base64 JPG.
 * @apiName signCertificate
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X POST https://api.corona-school.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384/sign
 *
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 *
 */
export async function signCertificateEndpoint(req: Request, res: Response) {
    const signer = res.locals.user as Pupil;
    const { signaturePupil, signatureParent, signatureLocation } = req.body;
    const { certificateId } = req.params;

    if (typeof certificateId !== "string") {
        return res.status(400).send("Missing parameter certificateId");
    }

    if (signaturePupil !== undefined && (typeof signaturePupil !== "string" || !signaturePupil.match(VALID_BASE64))) {
        return res.status(400).send("Parameter signaturePupil must be a string and valid base64 encoding");
    }

    if (signatureParent !== undefined && (typeof signatureParent !== "string" || !signatureParent.match(VALID_BASE64))) {
        return res.status(400).send("Parameter signatureParent must be a string and valid base64 encoding");
    }

    if (!signaturePupil && !signatureParent) {
        return res.status(400).send("Either the parent or the pupil must sign the certificate");
    }

    if (typeof signatureLocation !== "string" || !signatureLocation) {
        return res.status(400).send("Parameter signatureLocation must be a string");
    }


    try {
        await signCertificate(certificateId, signer, signatureParent, signaturePupil, signatureLocation);
        return res.send("Certificate signed");
    } catch (error) {
        if (error instanceof CertificateError) {
            return res.status(400).send(error.message);
        }

        logger.error("Failed to sign certificate", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}

/**
 * @api {GET} /certificates
 * @apiVersion 1.1.0
 * @apiDescription
 * View certificate data
 *
 * Returns data for certificates requested by the user or to be approved by the user (either student = user or pupil = user)
 *
 *
 * @apiName getCertificates
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.corona-school.de/api/certificates
 *
 * @apiUse StatusUnauthorized
 * @apiUse StatusInternalServerError
 *
 * @typedef {Object} Response
 * @property {Array} certificates
 *
 * @returns {Response}
 */
export async function getCertificatesEndpoint(req: Request, res: Response) {
    assert(res.locals.user, "No user set");


    try {
        const certificates = await getCertificatesFor(res.locals.user);
        return res.json({ certificates });
    } catch (error) {
        logger.error("Retrieving certificates for user failed with", error);
        return res.status(500).send("Internal Server error");
    }
}

/**
 * @api {GET} /certificate/remissionRequest getRemissionRequest
 * @apiVersion 1.1.0
 * @apiDescription
 * View a remission request
 *
 * Returns the remission request as PDF
 *
 *
 * @apiName getRemissionRequest
 * @apiGroup Certificate
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET -H "Token: <AUTHTOKEN>" https://api.corona-school.de/api/remissionRequest
 *
 * @apiUse StatusNoContent
 * @apiUse StatusInternalServerError
 */
export async function getRemissionRequestEndpoint(req: Request, res: Response) {
    const student = res.locals.user as Student;

    try {
        const pdf = await createRemissionRequestPDF(student);

        if (pdf === undefined) {
            return res.status(404).send("Could not find a remission request for this user.");
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': pdf.length
        });

        return res.end(pdf);
    } catch (error) {
        logger.error("Generating remission request failed with: ", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}