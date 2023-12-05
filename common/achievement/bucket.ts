import moment from 'moment';
import { Bucket, BucketConfig, BucketFormula, DefaultBucket, FilterBucket, GenericBucketConfig, TimeBucket } from './types';
import { getAchievementContext, getRelationTypeAndId } from './util';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {
    default: {
        function: async (): Promise<GenericBucketConfig<DefaultBucket>> => {
            return await { bucketKind: 'default', buckets: [] };
        },
    },
    by_lecture_start: {
        function: async (relation): Promise<GenericBucketConfig<TimeBucket>> => {
            const [type] = getRelationTypeAndId(relation);

            if (!relation) {
                return { bucketKind: 'time', buckets: [] };
            }
            const context = await getAchievementContext(relation);
            if (!context[relation].lecture) {
                return { bucketKind: 'time', buckets: [] };
            }
            return {
                bucketKind: 'time',
                buckets: context[type].lecture.map((lecture) => ({
                    kind: 'time',
                    startTime: moment(lecture.start).subtract(10, 'minutes').toDate(),
                    endTime: moment(lecture.start).add(lecture.duration, 'minutes').add(10, 'minutes').toDate(),
                })),
            };
        },
    },
    by_weeks: {
        function: async (): Promise<GenericBucketConfig<TimeBucket>> => {
            // TODO - where did we get the number of weeks
            const weeks = 5;
            const today = moment();
            const buckets: TimeBucket[] = [];

            for (let i = 0; i < weeks; i++) {
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
        function: async (): Promise<GenericBucketConfig<TimeBucket>> => {
            // TODO - where did we get the number of months

            const months = 12;
            const today = moment();
            const buckets: TimeBucket[] = [];

            for (let i = 0; i < months; i++) {
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
    // this is a filter bucket array, which means that it will only contain buckets for events related to certain action names
    by_conducted_match_meeting: {
        function: async (relation): Promise<GenericBucketConfig<FilterBucket>> => {
            const actions = await getAchievementContext(relation);
            const buckets: FilterBucket[] = actions.actionNames.map((action) => {
                return {
                    kind: 'filter',
                    actionName: action,
                };
            });
            return await {
                bucketKind: 'filter',
                buckets: buckets,
            };
        },
    },
};
