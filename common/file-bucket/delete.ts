import { getLogger } from "log4js";
import { DEFAULT_BUCKET, s3 } from "./s3";

const logger = getLogger();


export async function deleteFile(key: string) {
    const request = s3.deleteObject({
        Key: key,
        Bucket: DEFAULT_BUCKET
    });

    const result = await request.promise();

    logger.info(`Deleted file with key '${key}' from default bucket. Result: ${JSON.stringify(result)}`);
}