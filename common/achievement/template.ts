import 'reflect-metadata';
import { Achievement_template } from '../../graphql/generated';
import { getLogger } from '../logger/logger';
import { ActionID } from '../notification/actions';
import { prisma } from '../prisma';
import { metricsByAction } from './metrics';
import { getMetricsByAction } from './util';

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
        logger.debug(`Loaded ${templatesFromDB.length} achievement templates into the cache`);
    }
    return achievementTemplates.get(select);
}

async function getTemplatesByAction<ID extends ActionID>(actionId: ID) {
    const templatesByMetric = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    if (!Object.keys(templatesByMetric)) {
        logger.warn(`No achievement templates were found in the database for the action with id: ${actionId}`);
        return [];
    }
    const metricsForAction = metricsByAction.get(actionId);

    let templatesForAction: Achievement_template[] = [];
    if (!metricsForAction || !templatesByMetric) {
        return [];
    } else {
        for (const metric of metricsForAction) {
            templatesForAction = [...templatesForAction, ...templatesByMetric.get(metric.metricName)];
        }
        return templatesForAction;
    }
}

async function doesTemplateExistForAction<ID extends ActionID>(actionId: ID): Promise<boolean> {
    const metrics = getMetricsByAction(actionId);
    const achievements = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    for (const metric of metrics) {
        if (achievements.has(metric.metricName)) {
            return true;
        }
    }

    return false;
}

function isMetricExistingForActionId<ID extends ActionID>(actionId: ID): boolean {
    return metricsByAction.has(actionId);
}

export { isMetricExistingForActionId, getAchievementTemplates, doesTemplateExistForAction, getTemplatesByAction };
