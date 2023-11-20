import { Achievement_template } from '../../graphql/generated';
import { getLogger } from '../logger/logger';
import { ActionID } from '../notification/actions';
import { prisma } from '../prisma';
import { metricsByAction } from './metrics';
import { getMetricsByAction } from './util';

const logger = getLogger('Achievement Template');

type AchievementTemplatesByMetric = Map<string, Readonly<Achievement_template>[]>;
// TODO - achievement templates by metric, by group
let achievementTemplatesByMetric: Promise<AchievementTemplatesByMetric>;
export const achievementsByGroup: Map<string, Readonly<Achievement_template>[]> = new Map();

function getAchievementTemplates(): Promise<AchievementTemplatesByMetric> {
    if (achievementTemplatesByMetric === undefined) {
        achievementTemplatesByMetric = (async function () {
            const result = new Map<string, Readonly<Achievement_template>[]>();

            const achievementTemplates = await prisma.achievement_template.findMany({
                where: { isActive: true },
            });

            for (const template of achievementTemplates) {
                for (const metric of template.metrics) {
                    if (!result.has(metric)) {
                        result.set(metric, []);
                    }

                    result.get(metric).push(template);
                }
                for (const group of template.group) {
                    if (!achievementsByGroup.has(group)) {
                        achievementsByGroup.set(group, []);
                    }
                    achievementsByGroup.get(group).push(template);
                }
            }

            logger.debug(`Loaded ${achievementTemplates.length} achievement templates into the cache`);

            return result;
        })();
    }

    return achievementTemplatesByMetric;
}

async function getTemplatesByAction<ID extends ActionID>(actionId: ID) {
    const templates = await getAchievementTemplates();
    const metricsForAction = metricsByAction.get(actionId);

    console.log('_____________________');
    console.log('GET TEMPLATE - TEMPLATES', templates);
    console.log('GET TEMPLATE - Metrics for action', metricsForAction);
    console.log('_____________________');

    let templatesForAction: Achievement_template[];
    for (const metric of metricsForAction) {
        templatesForAction = templates.get(metric.metricName);
    }

    return templatesForAction;
}

async function doesTemplateExistForAction<ID extends ActionID>(actionId: ID): Promise<boolean> {
    const metrics = getMetricsByAction(actionId);
    const achievements = await getAchievementTemplates();
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
