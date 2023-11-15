import moment from 'moment';
import { Bucket, BucketFormula } from './types';
import { getRelationContext } from './util';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {
    default: {
        function: (): Bucket[] => {
            return [];
        },
    },
    by_lecture_start: {
        function: async (relation): Promise<Bucket[]> => {
            if (!relation) {
                return [];
            }
            const context = await getRelationContext(relation);
            return context.lecture.map((lecture) => ({
                startTime: moment(lecture.start).subtract(10, 'minutes').toDate(),
                endTime: moment(lecture.start).add(lecture.duration, 'minutes').add(10, 'minutes').toDate(),
            }));
        },
    },
    by_weeks: {
        function: (relation) => {
            return [];
        },
    },
};
