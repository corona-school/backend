import moment from 'moment';
import { BucketFormula, DefaultBucket, GenericBucketConfig, TimeBucket } from './types';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {
    default: {
        function: (): GenericBucketConfig<DefaultBucket> => {
            return { bucketKind: 'default', buckets: [] };
        },
    },
    by_lecture_start: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { context } = bucketContext;
            const timeBucket: GenericBucketConfig<TimeBucket> = {
                bucketKind: 'time',
                buckets: [],
            };
            context[context.type].forEach((contextType) => {
                if (!contextType.lecture) {
                    return;
                }
                const buckets: TimeBucket[] = contextType.lecture.map((lecture) => ({
                    kind: 'time',
                    relation: `${context.type}/${contextType['id']}`,
                    startTime: moment(lecture.start).subtract(10, 'minutes').toDate(),
                    endTime: moment(lecture.start).add(lecture.duration, 'minutes').add(10, 'minutes').toDate(),
                }));
                timeBucket.buckets.push(...buckets);
            });
            return timeBucket;
        },
    },
    by_weeks: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { context } = bucketContext;
            const { periodLength: weeks } = bucketContext;
            // the buckets are created in a desc order
            const today = moment();
            const timeBucket: GenericBucketConfig<TimeBucket> = {
                bucketKind: 'time',
                buckets: [],
            };

            /*
            This is to look at the last few weeks before the current event so that we can evaluate whether the streak has been interrupted for the last few weeks or whether we have a new record.
            ---
            Why do we pass the `recordValue` as weeks / months?
            Let's imagine our current record: 6
            We now want to see if this record still exists. We want to know whether the last 7 weeks are correct, because the previous record was 6.
            Now it doesn't matter how long the user was inactive or similar. As soon as only one bucket is found among these buckets (7 buckets) that contains nothing, we know that the record has not been surpassed.
            */
            context[context.type].forEach((contextType) => {
                if (!contextType.lecture) {
                    return;
                }
                for (let i = 0; i < weeks + 1; i++) {
                    const weeksBefore = today.clone().subtract(i, 'week');
                    timeBucket.buckets.push({
                        kind: 'time',
                        relation: `${context.type}/${contextType['id']}`,
                        startTime: weeksBefore.startOf('week').toDate(),
                        endTime: weeksBefore.endOf('week').toDate(),
                    });
                }
            });

            return timeBucket;
        },
    },
    by_months: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { context } = bucketContext;
            const { periodLength: months } = bucketContext;

            // the buckets are created in a desc order
            const today = moment();
            const timeBucket: GenericBucketConfig<TimeBucket> = {
                bucketKind: 'time',
                buckets: [],
            };

            context[context.type].forEach((contextType) => {
                if (!contextType.lecture) {
                    return;
                }
                for (let i = 0; i < months + 1; i++) {
                    const monthsBefore = today.clone().subtract(i, 'month');
                    timeBucket.buckets.push({
                        kind: 'time',
                        relation: `${context.type}/${contextType['id']}`,
                        startTime: monthsBefore.startOf('month').toDate(),
                        endTime: monthsBefore.endOf('month').toDate(),
                    });
                }
            });

            return timeBucket;
        },
    },
};
