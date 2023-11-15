import { Achievement_template } from '../../graphql/generated';
import { getLogger } from '../logger/logger';
import { ActionID } from '../notification/actions';
import { prisma } from '../prisma';
import { metricsByAction } from './metrics';
import { Metric } from './types';

const logger = getLogger('Achievement Template');

type AchievementTemplatesMap = Map<string, Readonly<Achievement_template>[]>;
let _achievementTemplates: Promise<AchievementTemplatesMap>;

function getAchievementTemplates(): Promise<AchievementTemplatesMap> {
    if (_achievementTemplates === undefined) {
        _achievementTemplates = (async function () {
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
            }

            logger.debug(`Loaded ${achievementTemplates.length} achievement templates into the cache`);

            return result;
        })();
    }

    return _achievementTemplates;
}

async function doesTemplateExistForAction<ID extends ActionID>(actionId: ID): Promise<boolean> {
    const metrics = getMetricsByAction(actionId);
    const templates = await getAchievementTemplates();
    for (const metric of metrics) {
        if (templates.has(metric.metricName)) {
            return true;
        }
    }

    return false;
}

function getMetricsByAction<ID extends ActionID>(actionId: ID): Metric[] {
    return metricsByAction.get(actionId) || [];
}

function isMetricExistingForActionId<ID extends ActionID>(actionId: ID): boolean {
    return metricsByAction.has(actionId);
}

export { isMetricExistingForActionId, getAchievementTemplates, doesTemplateExistForAction };
