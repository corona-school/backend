import moment from 'moment-timezone';
import { bucketCreatorDefs } from './bucket';
import { BucketCreatorContext, ContextMatch, ContextSubcourse, TimeBucket } from './types';
import { BucketConfig } from './types';

function sortBuckets(bucket: BucketConfig): BucketConfig {
    if (bucket.bucketKind === 'time') {
        bucket.buckets.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
    return bucket;
}

describe('test create buckets by_lecture_start', () => {
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
                    startTime: moment('2023-08-14T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-15T00:05:00.000Z').toDate(),
                    relation: 'appointment/1',
                },
            ],
            matches: [{ id: 1, relation: 'match', lecture: [{ id: 1, start: today.toDate(), duration: 60 }] }],
        },
        {
            name: 'should create multiple buckets for a match with multiple lectures',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-14T00:05:00.000Z').toDate(),
                    relation: 'appointment/1',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-15T00:05:00.000Z').toDate(),
                    relation: 'appointment/2',
                },
            ],
            matches: [
                {
                    id: 1,
                    relation: 'match',
                    lecture: [
                        { id: 1, start: yesterday.toDate(), duration: 60 },
                        { id: 2, start: today.toDate(), duration: 60 },
                    ],
                },
            ],
        },
        {
            name: 'should create one bucket for a subcourse with a single lecture',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-15T00:05:00.000Z').toDate(),
                    relation: 'appointment/1',
                },
            ],
            matches: [{ id: 1, relation: 'subcourse', lecture: [{ id: 1, start: today.toDate(), duration: 60 }] }],
        },
        {
            name: 'should create multiple buckets for a subcourse with multiple lectures, sorted desc',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-14T00:05:00.000Z').toDate(),
                    relation: 'appointment/1',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-15T00:05:00.000Z').toDate(),
                    relation: 'appointment/2',
                },
            ],
            subcourses: [
                {
                    id: 1,
                    relation: 'subcourse',
                    lecture: [
                        { id: 1, start: yesterday.toDate(), duration: 60 },
                        { id: 2, start: today.toDate(), duration: 60 },
                    ],
                },
            ],
        },
        {
            name: 'should create multiple buckets for multiple subcourses and matches',
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-07-31T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-01T00:05:00.000Z').toDate(),
                    relation: 'appointment/4',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-07T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-08T00:05:00.000Z').toDate(),
                    relation: 'appointment/2',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-13T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-14T00:05:00.000Z').toDate(),
                    relation: 'appointment/1',
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T23:00:00.000Z').toDate(),
                    endTime: moment('2023-08-15T00:05:00.000Z').toDate(),
                    relation: 'appointment/3',
                },
            ],
            subcourses: [
                {
                    id: 1,
                    relation: 'subcourse',
                    lecture: [
                        { id: 1, start: yesterday.toDate(), duration: 105 },
                        { id: 2, start: lastWeek.toDate(), duration: 290 },
                    ],
                },
            ],
            matches: [
                {
                    id: 1,
                    relation: 'match',
                    lecture: [
                        { id: 3, start: today.toDate(), duration: 30 },
                        { id: 4, start: twoWeeksAgo.toDate(), duration: 45 },
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
        let res = bucketCreatorDefs['by_lecture_start'].function({
            recordValue: 0,
            context: {
                match: matches ?? [],
                subcourse: subcourses ?? [],
            },
        });
        res = sortBuckets(res);

        expect(res.buckets).toEqual(expectedBuckets.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
    });
});

describe('test create buckets by_week', () => {
    const today = new Date(2023, 7, 15);

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
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-20T23:59:59.999').toDate(),
                    relation: undefined,
                },
            ],
        },
        {
            name: 'should create two buckets if recordValue is 1. Elements should be ordered desc',
            recordValue: 1,
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-20T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-07T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-13T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
            ],
        },
        {
            name: 'should create three buckets if recordValue is 2. Elements should be ordered desc',
            recordValue: 2,
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-14T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-20T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-08-07T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-13T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-07-31T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-06T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
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
                {
                    kind: 'time',
                    startTime: moment('2023-08-01T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-31T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
            ],
        },
        {
            name: 'should create two buckets if recordValue is 1. Elements should be ordered desc',
            recordValue: 1,
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-01T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-31T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-07-01T00:00:00.000').toDate(),
                    endTime: moment('2023-07-31T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
            ],
        },
        {
            name: 'should create three buckets if recordValue is 2. Elements should be ordered desc',
            recordValue: 2,
            expectedBuckets: [
                {
                    kind: 'time',
                    startTime: moment('2023-08-01T00:00:00.000Z').toDate(),
                    endTime: moment('2023-08-31T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-07-01T00:00:00.000Z').toDate(),
                    endTime: moment('2023-07-31T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
                {
                    kind: 'time',
                    startTime: moment('2023-06-01T00:00:00.000Z').toDate(),
                    endTime: moment('2023-06-30T23:59:59.999Z').toDate(),
                    relation: undefined,
                },
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
