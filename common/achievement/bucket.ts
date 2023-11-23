import moment from 'moment';
import { Bucket, BucketFormula } from './types';
import { getRelationContext } from './util';

type BucketCreatorDefs = Record<string, BucketFormula>;

// Buckets are needed to pre-sort and aggregate certain events by types / a certain time window (e.g. weekly) etc.
export const bucketCreatorDefs: BucketCreatorDefs = {
    default: {
        function: async (): Promise<Bucket[]> => {
            return await [];
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
        function: async (): Promise<Bucket[]> => {
            // TODO - where did we get the number of weeks
            const weeks = 5;
            const today = moment();
            const bucekts: Bucket[] = [];

            for (let i = 0; i < weeks; i++) {
                const weeksBefore = today.clone().subtract(i, 'week');
                bucekts.push({
                    startTime: weeksBefore.startOf('week').toDate(),
                    endTime: weeksBefore.endOf('week').toDate(),
                });
            }

            return await bucekts;
        },
    },
    by_months: {
        function: async (): Promise<Bucket[]> => {
            // TODO - where did we get the number of months

            const months = 12;
            const today = moment();
            const bucekts: Bucket[] = [];

            for (let i = 0; i < months; i++) {
                const monthsBefore = today.clone().subtract(i, 'month');
                bucekts.push({
                    startTime: monthsBefore.startOf('month').toDate(),
                    endTime: monthsBefore.endOf('month').toDate(),
                });
            }

            return await bucekts;
        },
    },
};
