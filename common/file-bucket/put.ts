import { getLogger } from "log4js";
import { DEFAULT_BUCKET, s3 } from "./s3";

const logger = getLogger();


/// Stores the given buffer in the default bucket associated with the given key
/// NOTE: May throw in case the upload failed
export async function putFile(f: Buffer, key: string) {
    const request = s3.putObject({
        Key: key,
        Bucket: DEFAULT_BUCKET,
        Body: f
    });

    const result = await request.promise();

    logger.info(`Put file with key '${key}' into default bucket. Result: ${JSON.stringify(result)}`);
}