import { getLogger } from "log4js";
import { DEFAULT_BUCKET, s3 } from "./s3";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";

const logger = getLogger();


export async function deleteFile(key: string) {
    const command = new DeleteObjectCommand({
        Key: key,
        Bucket: DEFAULT_BUCKET
    });

    const result = await s3.send(command);

    logger.info(`Deleted file with key '${key}' from default bucket. Result: ${JSON.stringify(result)}`);
}
