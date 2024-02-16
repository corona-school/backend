import moment from 'moment';
import { BucketFormula, DefaultBucket, GenericBucketConfig, TimeBucket, ContextMatch, ContextSubcourse, ContextLecture } from './types';

type BucketCreatorDefs = Record<string, BucketFormula>;

enum LectureBucketMeasuringType {
    start = 'start',
    participation = 'participation',
}

function createLectureBuckets<T extends ContextMatch | ContextSubcourse>(data: T, measuringType: LectureBucketMeasuringType): TimeBucket[] {
    if (!data.lecture || data.lecture.length === 0) {
        return [];
    }

    const buckets: TimeBucket[] = data.lecture
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((lecture) => ({
            kind: 'time',
            relation: data.relation,
            startTime:
                measuringType === LectureBucketMeasuringType.start ? moment(lecture.start).subtract(10, 'minutes').toDate() : moment(lecture.start).toDate(),
            endTime: measuringType === LectureBucketMeasuringType.start ? moment(lecture.start).add(5, 'minutes').toDate() : moment(lecture.start).toDate(),
        }));
    return buckets;
}

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
            // the context.type is a discriminator to define what relationType is used for the bucket (match, subcourse, global_match, global_subcourse)
            // using the context key context[context.type] is equivalent for using a variable key like context.match etc..., meaining that this forEach is iterating over an array of matches/subcourses
            const matchBuckets = context.match
                .map((match) => createLectureBuckets(match, LectureBucketMeasuringType.start))
                .reduce((acc, val) => acc.concat(val), []);
            const subcourseBuckets = context.subcourse
                .map((subcourse) => createLectureBuckets(subcourse, LectureBucketMeasuringType.start))
                .reduce((acc, val) => acc.concat(val), []);
            const buckets: TimeBucket[] = [...matchBuckets, ...subcourseBuckets].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
            return { bucketKind: 'time', buckets: buckets };
        },
    },
    by_lecture_participation: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { context } = bucketContext;
            const matchBuckets = context.match
                .map((match) => createLectureBuckets(match, LectureBucketMeasuringType.participation))
                .reduce((acc, val) => acc.concat(val), []);
            const subcourseBuckets = context.subcourse
                .map((subcourse) => createLectureBuckets(subcourse, LectureBucketMeasuringType.participation))
                .reduce((acc, val) => acc.concat(val), []);
            const buckets: TimeBucket[] = [...matchBuckets, ...subcourseBuckets].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
            return { bucketKind: 'time', buckets: buckets };
        },
    },
    by_weeks: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { recordValue: weeks } = bucketContext;
            // the buckets are created in a desc order
            const today = moment();
            const timeBucket: GenericBucketConfig<TimeBucket> = {
                bucketKind: 'time',
                buckets: [],
            };

            if (weeks === undefined || weeks === null) {
                return timeBucket;
            }

            /*
            This is to look at the last few weeks before the current event so that we can evaluate whether the streak has been interrupted for the last few weeks or whether we have a new record.
            ---
            Why do we pass the `recordValue` as weeks / months?
            Let's imagine our current record: 6
            We now want to see if this record still exists. We want to know whether the last 7 weeks are correct, because the previous record was 6.
            Now it doesn't matter how long the user was inactive or similar. As soon as only one bucket is found among these buckets (7 buckets) that contains nothing, we know that the record has not been surpassed.
            */
            for (let i = 0; i < weeks + 1; i++) {
                const weeksBefore = today.clone().subtract(i, 'week');
                timeBucket.buckets.push({
                    kind: 'time',
                    relation: undefined,
                    startTime: weeksBefore.startOf('week').toDate(),
                    endTime: weeksBefore.endOf('week').toDate(),
                });
            }

            return timeBucket;
        },
    },
    by_months: {
        function: (bucketContext): GenericBucketConfig<TimeBucket> => {
            const { recordValue: months } = bucketContext;

            // the buckets are created in a desc order
            const today = moment();
            const timeBucket: GenericBucketConfig<TimeBucket> = {
                bucketKind: 'time',
                buckets: [],
            };

            if (months === undefined || months === null) {
                return timeBucket;
            }

            for (let i = 0; i < months + 1; i++) {
                const monthsBefore = today.clone().subtract(i, 'month');
                timeBucket.buckets.push({
                    kind: 'time',
                    relation: undefined,
                    startTime: monthsBefore.startOf('month').toDate(),
                    endTime: monthsBefore.endOf('month').toDate(),
                });
            }

            return timeBucket;
        },
    },
};
