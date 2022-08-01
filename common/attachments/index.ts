import {Student} from "../entity/Student";
import {Pupil} from "../entity/Pupil";
import { prisma } from '../prisma';
import { v4 as uuid } from "uuid";
import {putFile, ATTACHMENT_BUCKET, generatePresignedURL} from "../file-bucket";
import {getUserIdTypeORM} from "../user";
import {friendlyFileSize} from "../util/basic";

export interface AttachmentGroup {
    attachmentGroupId: string;
    attachmentListHTML: string;
    attachmentIds: string[];
}

/**
 * Creates an attachment in the database and uploads the specified file to the S3 bucket.
 *
 * @param   file               File from multer to upload to S3
 * @param   uploader           Entity that uploaded the file
 * @param   attachmentGroupId  Unique per group of attachments (per message)
 * @return  attachmentId       Unique per individual attachment
 */
export async function createAttachment(file: Express.Multer.File, uploader: Student | Pupil, attachmentGroupId: string) {
    let attachmentId = uuid().toString();
    await prisma.attachment.create({
        data: {
            id: attachmentId,
            uploaderID: getUserIdTypeORM(uploader),
            filename: file.originalname,
            size: file.size,
            attachmentGroupId,
            date: new Date()
        }
    });

    await putFile(file.buffer, `attachments/${attachmentGroupId}/${attachmentId}/${file.originalname}`, ATTACHMENT_BUCKET, false, file.mimetype);

    return attachmentId;
}

/**
 * If not provided, this function fetches the corresponding attachmentGroupId for the provided attachmentId and generates the presigned URL.
 * @param attachmentId      The unique ID of the attachment.
 * @param key               The location of the attachment in the bucket.
 * @param attachmentGroupId (optional) The unique ID of the attachment group. Will be fetched if not available.
 * @return                  Presigned URL which enables users to access the file temporarily.
 */
export async function getAttachmentURL(attachmentId: string, key: string, attachmentGroupId?: string) {
    if (attachmentGroupId == null) {
        let dbAttachment = await prisma.attachment.findUnique({
            where: {
                id: attachmentId
            },
            select: {
                attachmentGroupId: true
            }
        });
        attachmentGroupId = dbAttachment.attachmentGroupId;
    }
    return await generatePresignedURL(`attachments/${attachmentGroupId}/${attachmentId}/${key}`, ATTACHMENT_BUCKET);
}


/**
 * Function creating the HTML which is attached to the email, consisting of a headline and a bulleted list with the attachment links, file names and file sizes.
 * @param attachments   The attachments to be added to the list.
 * @param attachmentGroupId
 * @return              HTML of the list.
 */
export async function getAttachmentListHTML(attachments: { attachmentId: string, filename: string, size: number }[], attachmentGroupId: string) {
    let attachmentListHTML = "<h3>Anhänge</h3>";

    for (let {attachmentId, filename, size} of attachments) {
        attachmentListHTML = attachmentListHTML + `<p><a href="https://api2.corona-school.de/api/attachments/${attachmentId}/${filename}">${filename}</a> (${friendlyFileSize(size, true)})</p>`;
    }

    return attachmentListHTML;
}

/**
 * Returns an AttachmentGroup object using the attachmentGroupId.
 * If you already have an Attachment object, better invoke getAttachmentListHTML directly and construct your object by hand,
 * as this function assumes no values known, which causes fetching of unnecessary data.
 * @param attachmentGroupId
 * @return AttachmentGroup
 */
export async function getAttachmentGroupByAttachmentGroupId(attachmentGroupId: string): Promise<AttachmentGroup> {
    const attachments = await prisma.attachment.findMany({
        where: {
            attachmentGroupId
        }
    });
    const attachmentList = attachments.map(a => ({attachmentId: a.id, filename: a.filename, size: a.size}));
    const attachmentListHTML = await getAttachmentListHTML(attachmentList, attachmentGroupId);

    return { attachmentGroupId, attachmentListHTML, attachmentIds: attachments.map(a => a.id) };
}
