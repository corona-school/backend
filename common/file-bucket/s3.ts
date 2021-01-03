import * as aws from "aws-sdk";

export const AWS_BUCKET_ENDPOINT = process.env.AWS_BUCKET_ENDPOINT;
export const DEFAULT_BUCKET = process.env.AWS_DEFAULT_BUCKET;

/// The domain that can be used to access the files in the bucket
export const ACCESS_DOMAIN_NAME = `${DEFAULT_BUCKET}.${AWS_BUCKET_ENDPOINT}`;

/// The default s3 endpoint
const s3Endpoint = new aws.Endpoint(AWS_BUCKET_ENDPOINT);

/// Returns the default s3 instance
export const s3 = new aws.S3({
    endpoint: s3Endpoint
});

/// Returns a URL for a given key (it is not ensured whether the file for that key exists or is even publicly accessible)
export function accessURLForKey(key: string) {
    return new URL(key, `https://${ACCESS_DOMAIN_NAME}`).href;
}