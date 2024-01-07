import moment from 'moment';
import { achievement_event, match, subcourse } from '@prisma/client';
import { prismaMock } from '../../jest/singletons';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations } from './types';

function createTestEvent({ metric, value, relation, ts }: { metric: string; value: number; relation?: string; ts?: Date }): achievement_event {
    const eventTs = ts || new Date();
    return {
        id: 1,
        action: 'test',
        metric: metric,
        relation: relation,
        value: value,
        userId: 'student/1',
        createdAt: eventTs,
    };
}

describe('evaluate should throw errors for misconfiguration', () => {
    const tests: {
        name: string;
        dataAggr: ConditionDataAggregations;
    }[] = [
        { name: 'should throw error if invalid aggregator was set', dataAggr: { x: { aggregator: 'invalid', metric: 'testMetric' } } },
        {
            name: 'should throw error if invalid createBuckets was set',
            dataAggr: { x: { aggregator: 'sum', metric: 'testMetric', createBuckets: 'invalid', bucketAggregator: 'sum' } },
        },
        {
            name: 'should throw error if invalid bucketAggregator was set',
            dataAggr: { x: { aggregator: 'sum', metric: 'testMetric', createBuckets: 'by_weeks', bucketAggregator: 'invalid' } },
        },
    ];

    it.each(tests)('$name', async ({ dataAggr }) => {
        prismaMock.achievement_event.findMany.mockResolvedValue([]);
        prismaMock.match.findMany.mockResolvedValue([]);
        prismaMock.subcourse.findMany.mockResolvedValue([]);

        await expect(evaluateAchievement('student/1', 'x > 0', dataAggr, 0, undefined)).resolves.toBeUndefined();
    });
});

describe('evaluate condition without default bucket aggregator', () => {
    const tests: {
        name: string;
        expectedResult: boolean;
        condition: string;
        userId: string;
        dataAggr: ConditionDataAggregations;

        events?: achievement_event[];
    }[] = [
        {
            name: 'should evaluate condition to true',
            expectedResult: true,
            condition: 'x > 0',
            userId: 'student/1',
            dataAggr: {
                x: {
                    aggregator: 'sum',
                    metric: 'testMetric',
                },
            },
            events: [createTestEvent({ metric: 'testMetric', value: 1 })],
        },
        {
            name: 'should ignore events that are not relevant',
            expectedResult: false,
            condition: 'x > 0',
            userId: 'student/1',
            dataAggr: {
                x: {
                    aggregator: 'sum',
                    metric: 'testMetric',
                },
            },
            events: [createTestEvent({ metric: 'irrelevantMetric', value: 1 })],
        },
    ];

    it.each(tests)('$name', async ({ expectedResult, condition, userId, dataAggr, events }) => {
        prismaMock.achievement_event.findMany.mockResolvedValue(events || []);
        prismaMock.match.findMany.mockResolvedValue([]);
        prismaMock.subcourse.findMany.mockResolvedValue([]);

        const res = await evaluateAchievement(userId, condition, dataAggr, 0, undefined);

        expect(res).toBeDefined();
        expect(res.conditionIsMet).toBe(expectedResult);
    });
});

describe('evaluate record value condition with time buckets', () => {
    // TODO: think about setting dow globally
    moment.updateLocale('de', { week: { dow: 1 } });
    jest.useFakeTimers().setSystemTime(new Date(2023, 7, 15));

    const today = moment();
    const yesterday = moment().subtract(1, 'day');
    const lastWeek = moment().subtract(1, 'week');
    const twoWeeksAgo = moment().subtract(2, 'week');

    const testUserId = 'student/1';
    const tests: {
        name: string;
        condition: string;
        recordValue: number;
        expectNewRecord: boolean;
        dataAggr: ConditionDataAggregations;

        events?: achievement_event[];
        matches?: match[];
        subcourses?: subcourse[];
    }[] = [
        {
            name: 'should achieve new record',
            condition: 'currentStreak > recordValue',
            expectNewRecord: true,
            recordValue: 1,
            dataAggr: {
                currentStreak: {
                    aggregator: 'count',
                    metric: 'testMetric',
                    bucketAggregator: 'count',
                    createBuckets: 'by_weeks',
                },
            },
            events: [
                createTestEvent({ metric: 'testMetric', value: 1, ts: today.toDate() }),
                createTestEvent({ metric: 'testMetric', value: 1, ts: lastWeek.toDate() }),
            ],
        },
        {
            name: 'should not achieve new record if both event are in the same week',
            condition: 'currentStreak > recordValue',
            expectNewRecord: false,
            recordValue: 1,
            dataAggr: {
                currentStreak: {
                    aggregator: 'count',
                    metric: 'testMetric',
                    bucketAggregator: 'count',
                    createBuckets: 'by_weeks',
                },
            },
            events: [
                createTestEvent({ metric: 'testMetric', value: 1, ts: today.toDate() }),
                createTestEvent({ metric: 'testMetric', value: 1, ts: yesterday.toDate() }),
            ],
        },
        {
            name: 'should not achieve new record if there is a gap in the streak',
            condition: 'currentStreak > recordValue',
            expectNewRecord: false,
            recordValue: 1,
            dataAggr: {
                currentStreak: {
                    aggregator: 'count',
                    metric: 'testMetric',
                    bucketAggregator: 'count',
                    createBuckets: 'by_weeks',
                },
            },
            events: [
                createTestEvent({ metric: 'testMetric', value: 1, ts: today.toDate() }),
                // gap of one week
                createTestEvent({ metric: 'testMetric', value: 1, ts: twoWeeksAgo.toDate() }),
            ],
        },
        {
            name: 'should not achieve new record if there is a gap in the streak, even if there is a event in the gap but with wrong metric',
            condition: 'currentStreak > recordValue',
            expectNewRecord: false,
            recordValue: 1,
            dataAggr: {
                currentStreak: {
                    aggregator: 'count',
                    metric: 'testMetric',
                    bucketAggregator: 'count',
                    createBuckets: 'by_weeks',
                },
            },
            events: [
                createTestEvent({ metric: 'testMetric', value: 1, ts: today.toDate() }),
                createTestEvent({ metric: 'invalidMetric', value: 1, ts: today.toDate() }),
                createTestEvent({ metric: 'testMetric', value: 1, ts: twoWeeksAgo.toDate() }),
            ],
        },
        {
            name: 'should not not crash if no events were found',
            condition: 'currentStreak > recordValue',
            expectNewRecord: false,
            recordValue: 1,
            dataAggr: {
                currentStreak: {
                    aggregator: 'count',
                    metric: 'testMetric',
                    bucketAggregator: 'count',
                    createBuckets: 'by_weeks',
                },
            },
            events: [],
        },
    ];

    it.each(tests)('$name', async ({ condition, expectNewRecord, recordValue, dataAggr, events, matches, subcourses }) => {
        prismaMock.achievement_event.findMany.mockResolvedValue(events || []);
        prismaMock.match.findMany.mockResolvedValue(matches || []);
        prismaMock.subcourse.findMany.mockResolvedValue(subcourses || []);

        const res = await evaluateAchievement(testUserId, condition, dataAggr, recordValue, undefined);

        expect(res).toBeDefined();
        expect(res.conditionIsMet).toBe(expectNewRecord);
    });
});
