import { getLogger } from '../logger/logger';
import { s3 } from './s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const logger = getLogger();

/// Stores the given buffer in the specified bucket associated with the given key
/// NOTE: May throw in case the upload failed
export async function putS3File(f: Buffer, key: string, bucket: string, isPublic: boolean, mimetype: string) {
    const command = new PutObjectCommand({
        Key: key,
        Bucket: bucket,
        Body: f,
        ACL: isPublic ? 'public-read' : undefined,
        ContentDisposition: 'inline',
        ContentType: mimetype,
    });

    const result = await s3.send(command);

    logger.info(`Put file with key '${key}' into bucket ${bucket}. Result: ${JSON.stringify(result)}`);
}
