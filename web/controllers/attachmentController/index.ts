import {getLogger} from "log4js";
import {Request, Response} from "express";
import {getManager} from "typeorm";
import {getAttachmentURL} from "../../../common/attachments";

const logger = getLogger();



/**
 * @api {GET} /attachments/:attachmentId/:filename getCertificateConfirmation
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
 * curl -k -i -X GET https://api.corona-school.de/api/attachments/000000001-0000-0000-0701-1b4c4c526384/helloworld.png
 *
 * @apiUse StatusNoContent
 * @apiUse StatusBadRequest
 * @apiUse StatusUnauthorized
 * @apiUse StatusForbidden
 * @apiUse StatusInternalServerError
 */
export async function getAttachmentUrlEndpoint(req: Request, res: Response) {
    try {
        const { attachmentId, filename } = req.params;

        if (typeof attachmentId !== "string" || typeof filename !== "string") {
            return res.status(400).send("Missing/invalid parameters");
        }


        let s3url = await getAttachmentURL(attachmentId, filename);

        return res.json({url: s3url});
    } catch (error) {
        logger.error("Failed to generate attachment URL", error);
        return res.status(500).send("<h1>Ein Fehler ist aufgetreten... 😔</h1>");
    }
}
