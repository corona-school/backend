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
    if (achievementTemplates === undefined) {
        const achievementTemplates = await prisma.achievement_template.findMany({
            where: { isActive: true },
        });

        for (const template of achievementTemplates) {
            const selection = template[select];

            if (Array.isArray(selection)) {
                for (const value of selection) {
                    if (!achievementTemplates[select].has(value)) {
                        achievementTemplates[select].set(value, []);
                    }
                    achievementTemplates[select][value].push(template);
                }
            } else {
                if (!achievementTemplates[select].has(selection)) {
                    achievementTemplates[select].set(selection, []);
                }
                achievementTemplates[select][selection].push(template);
            }
        }
        logger.debug(`Loaded ${achievementTemplates.length} achievement templates into the cache`);
        return achievementTemplates[select];
    }
}

async function getTemplatesByAction<ID extends ActionID>(actionId: ID) {
    const templatesByMetric = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    const metricsForAction = metricsByAction.get(actionId);

    console.log('_____________________');
    console.log('GET TEMPLATE - TEMPLATES', templatesByMetric);
    console.log('GET TEMPLATE - Metrics for action', metricsForAction);
    console.log('_____________________');

    let templatesForAction: Achievement_template[];
    for (const metric of metricsForAction) {
        templatesForAction = templatesByMetric[metric.metricName];
    }

    return templatesForAction;
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
