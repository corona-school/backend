import {Student} from "../entity/Student";
import {Pupil} from "../entity/Pupil";
import { prisma } from '../prisma';
import { v4 as uuid } from "uuid";
import {putFile, ATTACHMENT_BUCKET, generatePresignedURL} from "../file-bucket";
import {getUserId} from "../user";

export interface AttachmentGroup {
    attachmentGroupId: string;
    attachmentListHTML: string;
    attachmentIds: string[];
}

/*
Creates an attachment in the database and uploads the specified file to the S3 bucket.

attachmentGroupId: Unique per group of attachments (per message)
returns: attachmentId: Unique per individual attachment
 */
export async function createAttachment(file: Express.Multer.File, uploader: Student | Pupil, attachmentGroupId: string) {
    let attachmentId = uuid().toString();
    await prisma.attachment.create({
        data: {
            id: attachmentId,
            uploaderID: getUserId(uploader),
            filename: file.originalname,
            attachmentGroupId,
            date: new Date()
        }
    });

    await putFile(file.buffer, `${attachmentGroupId}/${attachmentId}/${file.originalname}`, ATTACHMENT_BUCKET);

    return attachmentId;
}

/*
If not provided, this function fetches the corresponding attachmentGroupId for the provided attachmentId and generates the presigned URL.
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
    return await generatePresignedURL(`${attachmentGroupId}/${attachmentId}/${key}`, ATTACHMENT_BUCKET);
}