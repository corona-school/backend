import aws from "aws-sdk";
import { assert } from "console";

export const AWS_BUCKET_ENDPOINT = process.env.AWS_BUCKET_ENDPOINT;
export const DEFAULT_BUCKET = process.env.AWS_DEFAULT_BUCKET;
export const ATTACHMENT_BUCKET = process.env.AWS_ATTACHMENT_BUCKET;

/// The domain that can be used to access the files in the bucket
export const ACCESS_DOMAIN_NAME = DEFAULT_BUCKET && AWS_BUCKET_ENDPOINT ? `${DEFAULT_BUCKET}.${AWS_BUCKET_ENDPOINT}` : undefined;

/// The default s3 endpoint
const s3Endpoint = AWS_BUCKET_ENDPOINT ? new aws.Endpoint(AWS_BUCKET_ENDPOINT) : undefined;

/// Returns the default s3 instance
export const s3 = new aws.S3({
    ...(s3Endpoint && {endpoint: s3Endpoint})
});

/// Returns a URL for a given key (it is not ensured whether the file for that key exists or is even publicly accessible)
export function accessURLForKey(key: string) {
    assert(ACCESS_DOMAIN_NAME, `Cannot create access URL for key ${key} because the ACCESS_DOMAIN_NAME is undefined. Please consider setting the appropriate environment variables to make the file bucket work.`);
    return new URL(key, `https://${ACCESS_DOMAIN_NAME}`).href;
}

export async function generatePredefinedURL(key: string, bucket: string) {
    return await s3.getSignedUrlPromise("getObject", {Bucket: bucket, Key: key, Expires: 3600, Method: "GET"})
}



/*
const remindersCreated = await prisma.concrete_notification.createMany({
                    data: reminders.map(it => ({
                        notificationID: it.id,
                        state: ConcreteNotificationState.DELAYED,
                        sentAt: new Date(Date.now() + it.delay),
                        userId: getUserId(user),
                        contextID: notificationContext.uniqueId,
                        context: notificationContext
                    }))
});
 */