import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { ConditionDataAggregations, Metric } from './types';
import { achievement_template, achievement_template_for_enum } from '@prisma/client';

const logger = getLogger('Achievement Template');

export enum TemplateSelectEnum {
    BY_GROUP = 'group',
    BY_METRIC = 'metrics',
    BY_RELATION = 'templateFor',
}

// string == metricId, group
const achievementTemplates: Map<TemplateSelectEnum, Map<string, achievement_template[]>> = new Map();

export function purgeAchievementTemplateCache() {
    achievementTemplates.clear();
}

async function buildCache() {
    const templates = await prisma.achievement_template.findMany({
        where: { isActive: true },
    });

    buildGroupCache(templates);
    buildMetricCache(templates);
    buildRelationCache(templates);

    logger.info(`Loaded ${templates.length} achievement templates into the cache`);
}

function buildGroupCache(templates: achievement_template[]) {
    achievementTemplates.set(TemplateSelectEnum.BY_GROUP, new Map());
    for (const template of templates) {
        const group = template.group;
        if (!achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.has(group)) {
            achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.set(group, []);
        }
        achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.get(group)?.push(template);
    }
}

function buildMetricCache(templates: achievement_template[]) {
    achievementTemplates.set(TemplateSelectEnum.BY_METRIC, new Map());
    for (const template of templates) {
        const dataAggr = template.conditionDataAggregations as ConditionDataAggregations;

        for (const aggr in dataAggr) {
            const metric = dataAggr[aggr].metric;
            if (!achievementTemplates.get(TemplateSelectEnum.BY_METRIC)?.has(metric)) {
                achievementTemplates.get(TemplateSelectEnum.BY_METRIC)?.set(metric, []);
            }
            achievementTemplates.get(TemplateSelectEnum.BY_METRIC)?.get(metric)?.push(template);
        }
    }
}

function buildRelationCache(templates: achievement_template[]) {
    achievementTemplates.set(TemplateSelectEnum.BY_RELATION, new Map());
    for (const template of templates) {
        if (achievementTemplates.get(TemplateSelectEnum.BY_RELATION)?.has(template.templateFor)) {
            achievementTemplates.get(TemplateSelectEnum.BY_RELATION)?.set(template.templateFor, []);
        }
        achievementTemplates.get(TemplateSelectEnum.BY_RELATION)?.get(template.templateFor)?.push(template);
    }
}

async function getAchievementTemplates(select: TemplateSelectEnum): Promise<Map<string, achievement_template[]>> {
    if (achievementTemplates.size === 0) {
        await buildCache();
    }

    if (!achievementTemplates.has(select)) {
        logger.warn(`No achievement templates were found in the database`, { select });
    }

    return achievementTemplates.get(select) ?? new Map();
}

async function getTemplatesByMetrics(metricsForAction: Metric[]) {
    const templatesByMetric = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    if (Array.from(templatesByMetric.values()).reduce((all, temp) => all.concat(temp), []).length === 0) {
        logger.debug(`No achievement templates were found in the database for the metrics: ${metricsForAction.map((m) => `${m.metricName}, `)}`);
        return [];
    }
    let templatesForAction: achievement_template[] = [];
    if (!metricsForAction || !templatesByMetric) {
        return [];
    }
    for (const metric of metricsForAction) {
        const templatesForMetric = templatesByMetric.get(metric.metricName);
        if (templatesForMetric) {
            templatesForAction = [...templatesForAction, ...templatesForMetric];
        }
    }
    return templatesForAction;
}

async function getTemplatesWithRelation(relation: achievement_template_for_enum): Promise<achievement_template[]> {
    const templatesByRelation = await getAchievementTemplates(TemplateSelectEnum.BY_RELATION)[relation];
    const relatedTemplates: achievement_template[] = templatesByRelation ? templatesByRelation.get(relation) : [];

    return relatedTemplates;
}

export { getAchievementTemplates, getTemplatesByMetrics, getTemplatesWithRelation };
