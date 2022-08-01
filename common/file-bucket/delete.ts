import { getLogger } from "log4js";
import { s3 } from "./s3";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";

const logger = getLogger();


export async function deleteFile(key: string, bucket: string) {
    const command = new DeleteObjectCommand({
        Key: key,
        Bucket: bucket
    });

    const result = await s3.send(command);

    logger.info(`Deleted file with key '${key}' from bucket ${bucket}. Result: ${JSON.stringify(result)}`);
}
