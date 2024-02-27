import { achievement_template, achievement_type_enum } from '@prisma/client';
import { prismaMock } from '../../jest/singletons';
import { getAchievementTemplates, purgeAchievementTemplateCache, TemplateSelectEnum } from './template';
import { ConditionDataAggregations } from './types';

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function createTestTemplate(group: string, metrics: string[]): achievement_template {
    const dataAggr: ConditionDataAggregations = {};
    for (const metricIdx in metrics) {
        dataAggr[`metric_${metricIdx}`] = {
            metric: metrics[metricIdx],
            aggregator: 'test',
        };
    }
    return {
        id: getRandomInt(10000),
        name: 'test',
        templateFor: 'Global',
        group,
        groupOrder: 1,
        stepName: 'test',
        type: achievement_type_enum.TIERED,
        subtitle: 'test',
        description: 'test',
        image: 'test',
        achievedImage: 'test',
        achievedDescription: null,
        actionName: null,
        actionRedirectLink: null,
        actionType: null,
        achievedText: null,
        progressDescription: null,
        streakProgress: null,
        condition: '',
        conditionDataAggregations: dataAggr,
        isActive: true,
    };
}

describe('test build group cache', () => {
    const tests: {
        name: string;
        expectedGroups: { name: string; size: number }[];
        templates: achievement_template[];
    }[] = [
        {
            name: 'should find a single group with a single template',
            expectedGroups: [{ name: 'group1', size: 1 }],
            templates: [createTestTemplate('group1', [])],
        },
        {
            name: 'should find a single group with multiple templates',
            expectedGroups: [{ name: 'group1', size: 3 }],
            templates: [createTestTemplate('group1', []), createTestTemplate('group1', []), createTestTemplate('group1', [])],
        },
        {
            name: 'should find multiple groups with multiple templates',
            expectedGroups: [
                { name: 'group1', size: 2 },
                { name: 'group2', size: 1 },
            ],
            templates: [createTestTemplate('group1', []), createTestTemplate('group1', []), createTestTemplate('group2', [])],
        },
        {
            name: 'should not find any group if there are no templates',
            expectedGroups: [],
            templates: [],
        },
    ];

    it.each(tests)('$name', async ({ templates: mockTemplates, expectedGroups }) => {
        purgeAchievementTemplateCache();
        prismaMock.achievement_template.findMany.mockResolvedValue(mockTemplates);

        const templates = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
        expect(templates.size).toBe(expectedGroups.length);
        for (const expectedGroup of expectedGroups) {
            expect(templates.has(expectedGroup.name)).toBe(true);
            expect(templates.get(expectedGroup.name)?.length).toBe(expectedGroup.size);
        }
    });
});

describe('test build metrics cache', () => {
    const tests: {
        name: string;
        expectedGroups: { name: string; size: number }[];
        templates: achievement_template[];
    }[] = [
        {
            name: 'should find a single group with a single template',
            expectedGroups: [{ name: 'metric1', size: 1 }],
            templates: [createTestTemplate('n/a', ['metric1'])],
        },
        {
            name: 'should find a single group with multiple templates',
            expectedGroups: [{ name: 'metric1', size: 3 }],
            templates: [createTestTemplate('n/a', ['metric1']), createTestTemplate('n/a', ['metric1']), createTestTemplate('n/a', ['metric1'])],
        },
        {
            name: 'should find multiple groups with multiple templates',
            expectedGroups: [
                { name: 'metric1', size: 2 },
                { name: 'metric2', size: 1 },
            ],
            templates: [createTestTemplate('n/a', ['metric1']), createTestTemplate('n/a', ['metric1']), createTestTemplate('n/a', ['metric2'])],
        },
        {
            name: 'should find the same template for multiple metrics',
            expectedGroups: [
                { name: 'metric1', size: 1 },
                { name: 'metric2', size: 1 },
            ],
            templates: [createTestTemplate('n/a', ['metric1', 'metric2'])],
        },
        {
            name: 'should not find any group if there are no templates',
            expectedGroups: [],
            templates: [],
        },
    ];

    it.each(tests)('$name', async ({ templates: mockTemplates, expectedGroups }) => {
        purgeAchievementTemplateCache();
        prismaMock.achievement_template.findMany.mockResolvedValue(mockTemplates);

        const templates = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
        expect(templates.size).toBe(expectedGroups.length);
        for (const expectedGroup of expectedGroups) {
            expect(templates.has(expectedGroup.name)).toBe(true);
            expect(templates.get(expectedGroup.name)?.length).toBe(expectedGroup.size);
        }
    });
});
