import { BucketFormula } from './types';

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: Map<string, BucketFormula> = new Map();
