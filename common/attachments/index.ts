import {Student} from "../entity/Student";
import {Pupil} from "../entity/Pupil";
import { prisma } from '../prisma';
import { v4 as uuid } from "uuid";
import {putFile, ATTACHMENT_BUCKET, generatePresignedURL} from "../file-bucket";


export async function createAttachment(file: Express.Multer.File, uploader: Student | Pupil, attachmentGroupId: string) {
    let id = uuid().toString();
    await prisma.attachment.create({
        data: {
            id,
            uploaderID: uploader.wix_id,
            filename: file.originalname,
            attachmentGroupId
        }
    });

    await putFile(file.buffer, `${attachmentGroupId}/${id}/${file.originalname}`, ATTACHMENT_BUCKET);

    return id;
}


export async function getAttachmentURL(id, key, attachmentGroupId?) {
    if (attachmentGroupId == null) {
        let dbAttachment = await prisma.attachment.findUnique({
            where: {
                id
            },
            select: {
                attachmentGroupId: true
            }
        })
        attachmentGroupId = dbAttachment.attachmentGroupId;
    }
    return await generatePresignedURL(`${attachmentGroupId}/${id}/${key}`, ATTACHMENT_BUCKET);
}