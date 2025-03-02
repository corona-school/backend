import moment from 'moment-timezone';
import { achievement_event, lecture, match, subcourse } from '@prisma/client';
import { prismaMock } from '../../jest/singletons';
import { exportedForTesting } from './evaluate';
import { ConditionDataAggregations } from './types';
import { Prisma } from '@prisma/client';

function createTestEvent({ metric, value, relation, ts }: { metric: string; value: number; relation?: string; ts?: Date }): achievement_event {
    const eventTs = ts || new Date();
    return {
        id: 1,
        action: 'test',
        metric: metric,
        relation: relation ?? '',
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

        await expect(exportedForTesting.evaluateAchievement('student/1', 'x > 0', dataAggr, 0, undefined)).rejects.toThrow();
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

        const res = await exportedForTesting.evaluateAchievement(userId, condition, dataAggr, 0, undefined);

        expect(res).toBeDefined();
        expect(res?.conditionIsMet).toBe(expectedResult);
    });
});

describe('evaluate record value condition with time buckets', () => {
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

        const res = await exportedForTesting.evaluateAchievement(testUserId, condition, dataAggr, recordValue, undefined);

        expect(res).toBeDefined();
        expect(res?.conditionIsMet).toBe(expectNewRecord);
    });
});

type SubcourseWithLectures = Prisma.subcourseGetPayload<{ include: { lecture: true } }>;

function createSubcourse({ lectures }: { lectures: lecture[] }): SubcourseWithLectures {
    return {
        lecture: lectures,

        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        minGrade: 1,
        maxGrade: 13,
        maxParticipants: 10,
        joinAfterStart: false,
        published: true,
        publishedAt: new Date(),
        cancelled: false,
        alreadyPromoted: false,
        conversationId: null,
        allowChatContactParticipants: false,
        allowChatContactProspects: false,
        groupChatType: 'NORMAL',
        courseId: 1,
        prospectChats: [],
    };
}

type MatchWithLectures = Prisma.matchGetPayload<{ include: { lecture: true } }>;

function createTestMatch({ lectures }: { lectures: lecture[] }): MatchWithLectures {
    return {
        lecture: lectures,

        id: 1,
        uuid: 'uuid',
        dissolved: false,
        dissolvedAt: null,
        dissolvedBy: null,
        dissolveReasons: [],
        otherDissolveReason: null,
        didHaveMeeting: true,
        proposedTime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        feedbackToPupilMail: false,
        feedbackToStudentMail: false,
        followUpToPupilMail: false,
        followUpToStudentMail: false,
        studentFirstMatchRequest: null,
        pupilFirstMatchRequest: null,
        matchPool: null,
        studentId: null,
        pupilId: null,
        matchPoolRunId: null,
    };
}

function createLecture({ start }: { start: Date }): lecture {
    return {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),

        start: start,
        duration: 60,
        subcourseId: 1,
        matchId: null,

        appointmentType: 'group',
        title: null,
        description: null,
        isCanceled: false,
        organizerIds: [],
        participantIds: [],
        declinedBy: [],
        zoomMeetingId: null,
        zoomMeetingReport: [],
        instructorId: null,
        override_meeting_link: null,
    };
}

describe('evaluate bucket with match / subcourse context', () => {
    moment.updateLocale('de', { week: { dow: 1 } });
    jest.useFakeTimers().setSystemTime(new Date(2023, 7, 15));

    const today = moment();
    const yesterday = moment().subtract(1, 'day');
    const twoDaysAgo = moment().subtract(2, 'day');

    const testUserId = 'student/1';
    const tests: {
        name: string;
        condition: string;
        expectNewRecord: boolean;
        dataAggr: ConditionDataAggregations;

        events?: achievement_event[];
        matches?: match[];
        subcourses?: SubcourseWithLectures[];
    }[] = [
        {
            name: 'should get achievement if participated in all lectures of a subcourse',
            condition: 'participatedLectures == 3',
            expectNewRecord: true,
            dataAggr: {
                participatedLectures: {
                    aggregator: 'count',
                    metric: 'matchLectureParticipation',
                    createBuckets: 'by_lecture_start',
                    bucketAggregator: 'count',
                },
            },
            events: [
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: today.subtract(5, 'minute').toDate() }),
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: twoDaysAgo.add(5, 'minute').toDate() }),
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: yesterday.subtract(3, 'minute').toDate() }),
            ],
            subcourses: [
                createSubcourse({
                    lectures: [
                        createLecture({ start: twoDaysAgo.toDate() }),
                        createLecture({ start: yesterday.toDate() }),
                        createLecture({ start: today.toDate() }),
                    ],
                }),
            ],
        },
        {
            name: 'should get achievement if participated in at least 3 lectures of a match',
            condition: 'participatedLectures >= 3',
            expectNewRecord: true,
            dataAggr: {
                participatedLectures: {
                    aggregator: 'count',
                    metric: 'matchLectureParticipation',
                    createBuckets: 'by_lecture_start',
                    bucketAggregator: 'count',
                },
            },
            events: [
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: today.subtract(5, 'minute').toDate() }),
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: twoDaysAgo.add(5, 'minute').toDate() }),
                createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: yesterday.subtract(3, 'minute').toDate() }),
            ],
            matches: [
                createTestMatch({
                    lectures: [
                        createLecture({ start: twoDaysAgo.toDate() }),
                        createLecture({ start: yesterday.toDate() }),
                        createLecture({ start: today.toDate() }),
                    ],
                }),
            ],
        },
        {
            name: 'should not count event if too far away from lecture start',
            condition: 'participatedLectures > 0',
            expectNewRecord: true,
            dataAggr: {
                participatedLectures: {
                    aggregator: 'count',
                    metric: 'matchLectureParticipation',
                    createBuckets: 'by_lecture_start',
                    bucketAggregator: 'count',
                },
            },
            events: [createTestEvent({ metric: 'matchLectureParticipation', value: 1, ts: today.subtract(1, 'hour').toDate() })],
            matches: [
                createTestMatch({
                    lectures: [createLecture({ start: today.toDate() })],
                }),
            ],
        },
    ];

    it.each(tests)('$name', async ({ expectNewRecord, condition, dataAggr, events, matches, subcourses }) => {
        prismaMock.achievement_event.findMany.mockResolvedValue(events || []);
        prismaMock.match.findMany.mockResolvedValue(matches || []);
        prismaMock.subcourse.findMany.mockResolvedValue(subcourses || []);

        const res = await exportedForTesting.evaluateAchievement(testUserId, condition, dataAggr, 0, undefined);

        expect(res).toBeDefined();
        expect(res?.conditionIsMet).toBe(expectNewRecord);
    });
});
