import { getLogger } from '../../../common/logger/logger';
import express, { Request, Response, Router } from 'express';
import { createRemissionRequestVerificationPage } from '../../../common/remission-request';
import { CertificateError, CertificateType, CERTIFICATETYPES, DefaultLanguage, getConfirmationPage, Language, LANGUAGES } from '../../../common/certificate';

const logger = getLogger();

export const certificateRouter = Router();
certificateRouter.get('/:certificateId/confirmation', /* NO AUTH REQUIRED */ getCertificateConfirmationEndpoint);

// Also mount the assets next to the assets relative to the hosted HTML file
// TODO: Make paths in certificates absolute
certificateRouter.use('/:certificateId/public', express.static('./assets/public'));

const DefaultCertificateType = 'participation';

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
 * curl -k -i -X GET https://api.lern-fair.de/api/certificate/000000001-0000-0000-0701-1b4c4c526384/confirmation
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
async function getCertificateConfirmationEndpoint(req: Request, res: Response) {
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
            return res.status(400).send('Language not known');
        }

        if (!CERTIFICATETYPES.includes(ctype as CertificateType)) {
            return res.status(400).send('Certificate type not known');
        }

        if (typeof certificateId !== 'string') {
            return res.status(400).send('Missing parameter certificateId');
        }
        if (ctype === 'participation' || ctype === 'instant') {
            const confirmation = await getConfirmationPage(certificateId, lang as Language, ctype);

            return res.send(confirmation);
        } else {
            const remissionRequestVerificationPage = await createRemissionRequestVerificationPage(certificateId.toUpperCase());

            if (!remissionRequestVerificationPage) {
                return res.status(404).send('<h1>Zertifikatslink nicht valide.</h1>');
            }

            return res.send(remissionRequestVerificationPage);
        }
    } catch (error) {
        if (error instanceof CertificateError) {
            return res.status(400).send(error.message);
        }

        logger.error('Failed to generate certificate confirmation', error);
        return res.status(500).send('<h1>Ein Fehler ist aufgetreten... 😔</h1>');
    }
}
