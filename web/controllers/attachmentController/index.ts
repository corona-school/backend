import { getLogger } from '../../../common/logger/logger';
import { Request, Response, Router } from 'express';
import { getAttachmentURL } from '../../../common/attachments';

const logger = getLogger();

export const attachmentRouter = Router();
attachmentRouter.get('/:attachmentId/:filename', getAttachmentUrlEndpoint);

/**
 * @api {GET} /attachments/:attachmentId/:filename getS3AttachmentLink
 * @apiVersion 1.1.0
 * @apiDescription
 * Generate an AWS S3 URL for the given attachment path.
 *
 * Attachments are stored in the S3 Attachment bucket with the following structure:
 *
 * ```
 *  root
 *  ├(attachmentGroupId)
 *  │ ├(attachmentId)
 *  │ │ └filename
 *  │ └(attachmentId)
 *  │   └filename
 *  └(attachmentGroupId)
 *     └(attachmentId)
 *      └filename
 * ```
 *
 * @apiParam (URL Parameter) {string} attachmentId UUID of the attachment (unique per message)
 * @apiParam (URL Parameter) {string} filename Name of the file
 *
 * @apiName getAttachmentURL
 * @apiGroup Attachments
 *
 * @apiExample {curl} Curl
 * curl -k -i -X GET https://api.lern-fair.de/api/attachments/000000001-0000-0000-0701-1b4c4c526384/helloworld.png
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
async function getAttachmentUrlEndpoint(req: Request, res: Response) {
    try {
        const { attachmentId, filename } = req.params;

        if (typeof attachmentId !== 'string' || typeof filename !== 'string') {
            return res.status(400).send('Missing/invalid parameters');
        }

        const s3url = await getAttachmentURL(attachmentId, filename);

        return res.redirect(s3url);
    } catch (error) {
        logger.error('Failed to generate attachment URL', error);
        return res.status(500).send('<h1>Ein Fehler ist aufgetreten... 😔</h1>');
    }
}
