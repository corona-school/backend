import moment from 'moment';
import { bucketCreatorDefs } from './bucket';
import { BucketCreatorContext, ContextMatch, ContextSubcourse, TimeBucket } from './types';

describe('test create buckets by_lecture_start', () => {
    // TODO: think about setting dow globally
    moment.updateLocale('de', { week: { dow: 1 } });
    jest.useFakeTimers().setSystemTime(new Date(2023, 7, 15));

    const today = moment();
    const yesterday = moment().subtract(1, 'day');
    const lastWeek = moment().subtract(1, 'week');
    const twoWeeksAgo = moment().subtract(2, 'week');

    const tests: {
        name: string;
        expectedBuckets: TimeBucket[];
        matches?: ContextMatch[];
        subcourses?: ContextSubcourse[];
    }[] = [
        {
            name: 'should create one bucket for a match with a single lecture',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-14T23:10:00.000Z').toDate(),
                    relation: 'match',
                },
            ],
            matches: [{ id: 1, relation: 'match', lecture: [{ start: today.toDate(), duration: 60 }] }],
        },
        {
            name: 'should create multiple buckets for a match with multiple lectures',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-13T23:10:00.000Z').toDate(),
                    relation: 'match',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-14T23:10:00.000Z').toDate(),
                    relation: 'match',
                },
            ],
            matches: [
                {
                    id: 1,
                    relation: 'match',
                    lecture: [
                        { start: yesterday.toDate(), duration: 60 },
                        { start: today.toDate(), duration: 60 },
                    ],
                },
            ],
        },
        {
            name: 'should create one bucket for a subcourse with a single lecture',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-14T23:10:00.000Z').toDate(),
                    relation: 'subcourse',
                },
            ],
            matches: [{ id: 1, relation: 'subcourse', lecture: [{ start: today.toDate(), duration: 60 }] }],
        },
        {
            name: 'should create multiple buckets for a subcourse with multiple lectures, sorted desc',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-13T23:10:00.000Z').toDate(),
                    relation: 'subcourse',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-14T23:10:00.000Z').toDate(),
                    relation: 'subcourse',
                },
            ],
            subcourses: [
                {
                    id: 1,
                    relation: 'subcourse',
                    lecture: [
                        { start: yesterday.toDate(), duration: 60 },
                        { start: today.toDate(), duration: 60 },
                    ],
                },
            ],
        },
        {
            name: 'should create multiple buckets for multiple subcourses and matches',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-14T22:40:00.000Z').toDate(),
                    relation: 'match',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-07-31T21:50:00.000Z').toDate(),
                    endTime: moment('2023-07-31T22:55:00.000Z').toDate(),
                    relation: 'match',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-13T23:55:00.000Z').toDate(),
                    relation: 'subcourse',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-07T21:50:00.000Z').toDate(),
                    endTime: moment('2023-08-08T03:00:00.000Z').toDate(),
                    relation: 'subcourse',
                },
            ],
            subcourses: [
                {
                    id: 1,
                    relation: 'subcourse',
                    lecture: [
                        { start: yesterday.toDate(), duration: 105 },
                        { start: lastWeek.toDate(), duration: 290 },
                    ],
                },
            ],
            matches: [
                {
                    id: 1,
                    relation: 'match',
                    lecture: [
                        { start: today.toDate(), duration: 30 },
                        { start: twoWeeksAgo.toDate(), duration: 45 },
                    ],
                },
            ],
        },
        {
            name: 'should not create any buckets if there are no lectures',
            expectedBuckets: [],
            matches: [{ id: 1, relation: 'match', lecture: [] }],
        },
    ];

    it.each(tests)('$name', ({ expectedBuckets, matches, subcourses }) => {
        const res = bucketCreatorDefs['by_lecture_start'].function({
            recordValue: 0,
            context: {
                match: matches ?? [],
                subcourse: subcourses ?? [],
            },
        });

        expect(res.buckets).toEqual(expectedBuckets);
    });
});

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
