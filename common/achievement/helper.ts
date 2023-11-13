import { ActionID } from '../notification/actions';
import { prisma } from '../prisma';
import { metrics } from './metrics';

function isMetricExistingForActionId<ID extends ActionID>(actionId: ID): boolean {
    return metrics.some((m) => m.onActions.includes(actionId));
}

async function isAchievementExistingForAction<ID extends ActionID>(actionId: ID): Promise<boolean> {
    const metricsByAction = metrics.filter((m) => m.onActions.includes(actionId));

    for (const metric of metricsByAction) {
        const templates = await prisma.achievement_template.findMany({ where: { metrics: { has: metric.metricName } } });
        if (templates.length > 0) {
            return true;
        }
    }

    return false;
}

export { isMetricExistingForActionId, isAchievementExistingForAction };
