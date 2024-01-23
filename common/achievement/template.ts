import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { Achievement_template } from '../../graphql/generated';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { Metric } from './types';

const logger = getLogger('Achievement Template');

export enum TemplateSelectEnum {
    BY_GROUP = 'group',
    BY_METRIC = 'metrics',
}

// string == metricId, group
const achievementTemplates: Map<TemplateSelectEnum, Map<string, Achievement_template[]>> = new Map();

async function getAchievementTemplates(select: TemplateSelectEnum): Promise<Map<string, Achievement_template[]>> {
    if (!achievementTemplates.has(select)) {
        achievementTemplates.set(select, new Map());

        const templatesFromDB = await prisma.achievement_template.findMany({
            where: { isActive: true },
        });

        for (const template of templatesFromDB) {
            const selection = template[select];

            if (Array.isArray(selection)) {
                for (const value of selection) {
                    if (!achievementTemplates.get(select)?.has(value)) {
                        achievementTemplates.get(select)?.set(value, []);
                    }
                    achievementTemplates.get(select)?.get(value)?.push(template);
                }
            } else {
                if (!achievementTemplates.get(select)?.has(selection)) {
                    achievementTemplates.get(select)?.set(selection, []);
                }
                achievementTemplates.get(select)?.get(selection)?.push(template);
            }
        }
        logger.info(`Loaded ${templatesFromDB.length} achievement templates into the cache`);
    }
    return achievementTemplates.get(select);
}

async function getTemplatesByMetrics(metricsForAction: Metric[]) {
    const templatesByMetric = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    const templateKeys = templatesByMetric ? Array.from(templatesByMetric.keys()) : [];
    if (templateKeys.map((key) => templatesByMetric[key]).reduce((all, temp) => all.concat(temp), []).length === 0) {
        logger.debug(`No achievement templates were found in the database for the metrics: ${metricsForAction.map((m) => `${m.metricName}, `)}`);
        return [];
    }
    let templatesForAction: Achievement_template[] = [];
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

export { getAchievementTemplates, getTemplatesByMetrics };
