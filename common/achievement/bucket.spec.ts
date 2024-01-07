import moment from 'moment';
import { bucketCreatorDefs } from './bucket';
import { BucketCreatorContext, TimeBucket } from './types';

describe('test create buckets by_week', () => {
    const today = new Date(2023, 7, 15);

    // TODO: think about setting dow globally
    moment.updateLocale('de', { week: { dow: 1 } });
    jest.useFakeTimers().setSystemTime(today);

    const tests: {
        name: string;
        recordValue: number;
        expectedBuckets: TimeBucket[];
    }[] = [
        {
            name: 'should create one bucket if recordValue is 0',
            recordValue: 0,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-08-13T22:00:00.000Z').toDate(), endTime: moment('2023-08-20T21:59:59.999Z').toDate(), relation: null },
            ],
        },
        {
            name: 'should create two buckets if recordValue is 1. Elements should be ordered desc',
            recordValue: 1,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-08-13T22:00:00.000Z').toDate(), endTime: moment('2023-08-20T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-08-06T22:00:00.000Z').toDate(), endTime: moment('2023-08-13T21:59:59.999Z').toDate(), relation: null },
            ],
        },
        {
            name: 'should create three buckets if recordValue is 2. Elements should be ordered desc',
            recordValue: 2,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-08-13T22:00:00.000Z').toDate(), endTime: moment('2023-08-20T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-08-06T22:00:00.000Z').toDate(), endTime: moment('2023-08-13T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-07-30T22:00:00.000Z').toDate(), endTime: moment('2023-08-06T21:59:59.999Z').toDate(), relation: null },
            ],
        },
    ];

    it.each(tests)('$name', ({ recordValue, expectedBuckets }) => {
        const bucketContext: BucketCreatorContext = {
            recordValue,
            context: {
                match: [],
                subcourse: [],
            },
        };
        const bucketConfig = bucketCreatorDefs['by_weeks'].function(bucketContext);
        expect(bucketConfig).toBeDefined();
        expect(bucketConfig.buckets).toEqual(expectedBuckets);

        // The current timestamp should always be in the first bucket
        const firstBucket = bucketConfig.buckets[0] as TimeBucket;
        expect(today.getTime()).toBeGreaterThan(firstBucket.startTime.getTime());
        expect(today.getTime()).toBeLessThan(firstBucket.endTime.getTime());
    });
});

describe('test create buckets by_months', () => {
    const today = new Date(2023, 7, 15);

    // TODO: think about setting dow globally
    moment.updateLocale('de', { week: { dow: 1 } });
    jest.useFakeTimers().setSystemTime(today);

    const tests: {
        name: string;
        recordValue: number;
        expectedBuckets: TimeBucket[];
    }[] = [
        {
            name: 'should create one bucket if recordValue is 0',
            recordValue: 0,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-07-31T22:00:00.000Z').toDate(), endTime: moment('2023-08-31T21:59:59.999Z').toDate(), relation: null },
            ],
        },
        {
            name: 'should create two buckets if recordValue is 1. Elements should be ordered desc',
            recordValue: 1,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-07-31T22:00:00.000Z').toDate(), endTime: moment('2023-08-31T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-06-30T22:00:00.000Z').toDate(), endTime: moment('2023-07-31T21:59:59.999Z').toDate(), relation: null },
            ],
        },
        {
            name: 'should create three buckets if recordValue is 2. Elements should be ordered desc',
            recordValue: 2,
            expectedBuckets: [
                { kind: 'time', startTime: moment('2023-07-31T22:00:00.000Z').toDate(), endTime: moment('2023-08-31T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-06-30T22:00:00.000Z').toDate(), endTime: moment('2023-07-31T21:59:59.999Z').toDate(), relation: null },
                { kind: 'time', startTime: moment('2023-05-31T22:00:00.000Z').toDate(), endTime: moment('2023-06-30T21:59:59.999Z').toDate(), relation: null },
            ],
        },
    ];

    it.each(tests)('$name', ({ recordValue, expectedBuckets }) => {
        const bucketContext: BucketCreatorContext = {
            recordValue,
            context: {
                match: [],
                subcourse: [],
            },
        };
        const bucketConfig = bucketCreatorDefs['by_months'].function(bucketContext);
        expect(bucketConfig).toBeDefined();
        expect(bucketConfig.buckets).toEqual(expectedBuckets);

        // The current timestamp should always be in the first bucket
        const firstBucket = bucketConfig.buckets[0] as TimeBucket;
        expect(today.getTime()).toBeGreaterThan(firstBucket.startTime.getTime());
        expect(today.getTime()).toBeLessThan(firstBucket.endTime.getTime());
    });
});
