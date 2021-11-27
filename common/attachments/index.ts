import {Student} from "../entity/Student";
import {Pupil} from "../entity/Pupil";
import { prisma } from '../prisma';
import { v4 as uuid } from "uuid";

import { attachment } from ".prisma/client"
import { putFile, ATTACHMENT_BUCKET } from "../file-bucket";


export async function createAttachment(attachmentGroupId: string, file: File, uploader: Student | Pupil) {
    let id = uuid();
    await prisma.attachment.create({
        data: {
            id,
            uploaderID: uploader.id,
            filename: file.name,
            attachmentGroupId
        }
    });

    await putFile(file, `${attachmentGroupId}/${id}/${file.name}`, ATTACHMENT_BUCKET);
    return id;
}
