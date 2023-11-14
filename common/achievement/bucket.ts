import { BucketFormula } from './types';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {};
