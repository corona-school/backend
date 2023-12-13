import moment from 'moment';
import { BucketFormula, DefaultBucket, GenericBucketConfig, TimeBucket } from './types';
import { getBucketContext, getRelationTypeAndId } from './util';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {
    default: {
        function: async (): Promise<GenericBucketConfig<DefaultBucket>> => {
            return await { bucketKind: 'default', buckets: [] };
        },
    },
    by_lecture_start: {
        // TODO: do not create a bucket if lecture.declinedBy includes the userId
        function: async (relation): Promise<GenericBucketConfig<TimeBucket>> => {
            const [type] = getRelationTypeAndId(relation);

            if (!relation) {
                return { bucketKind: 'time', buckets: [] };
            }
            const context = await getBucketContext(relation);
            if (!context[context.type].lecture) {
                return { bucketKind: 'time', buckets: [] };
            }
            return {
                bucketKind: 'time',
                buckets: context[context.type].lecture.map((lecture) => ({
                    kind: 'time',
                    startTime: moment(lecture.start).subtract(10, 'minutes').toDate(),
                    endTime: moment(lecture.start).add(lecture.duration, 'minutes').add(10, 'minutes').toDate(),
                })),
            };
        },
    },
    by_weeks: {
        function: async (_relation, weeks): Promise<GenericBucketConfig<TimeBucket>> => {
            // the buckets are created in a desc order
            const today = moment();
            const buckets: TimeBucket[] = [];

            for (let i = 0; i < weeks + 1; i++) {
                const weeksBefore = today.clone().subtract(i, 'week');
                buckets.push({
                    kind: 'time',
                    startTime: weeksBefore.startOf('week').toDate(),
                    endTime: weeksBefore.endOf('week').toDate(),
                });
            }

            return await {
                bucketKind: 'time',
                buckets,
            };
        },
    },
    by_months: {
        function: async (_relation, months): Promise<GenericBucketConfig<TimeBucket>> => {
            // the buckets are created in a desc order
            const today = moment();
            const buckets: TimeBucket[] = [];

            for (let i = 0; i < months + 1; i++) {
                const monthsBefore = today.clone().subtract(i, 'month');
                buckets.push({
                    kind: 'time',
                    startTime: monthsBefore.startOf('month').toDate(),
                    endTime: monthsBefore.endOf('month').toDate(),
                });
            }

            return await {
                bucketKind: 'time',
                buckets,
            };
        },
    },
};
