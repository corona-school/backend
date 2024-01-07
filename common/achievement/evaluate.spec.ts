import { achievement_event } from '@prisma/client';
import { prismaMock } from '../../jest/singletons';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations } from './types';

describe('evaluate', () => {
    it('should evaluate condition to true', async () => {
        const event: achievement_event = {
            id: 1,
            action: 'test',
            metric: 'testMetric',
            relation: 'test',
            value: 1,
            userId: 'student/1',
            createdAt: new Date(),
        };
        const dataAggr: ConditionDataAggregations = {
            x: {
                aggregator: 'sum',
                metric: 'testMetric',
            },
        };

        prismaMock.achievement_event.findMany.mockResolvedValue([event]);
        prismaMock.match.findMany.mockResolvedValue([]);
        prismaMock.subcourse.findMany.mockResolvedValue([]);

        const res = await evaluateAchievement('student/1', 'x > 0', dataAggr, ['testMetric'], 0, undefined);

        expect(res).toBeDefined();
        expect(res.conditionIsMet).toBe(true);
    });
});
