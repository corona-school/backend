import { getLogger } from "log4js";
import { s3 } from "./s3";

const logger = getLogger();


/// Stores the given buffer in the specified bucket associated with the given key
/// NOTE: May throw in case the upload failed
export async function putFile(f: Buffer, key: string, bucket: string) {
    const request = s3.putObject({
        Key: key,
        Bucket: bucket,
        Body: f
    });

    const result = await request.promise();

    logger.info(`Put file with key '${key}' into bucket ${bucket}. Result: ${JSON.stringify(result)}`);
}
