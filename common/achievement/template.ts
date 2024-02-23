import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { AchievementType, ConditionDataAggregations, Metric } from './types';
import { achievement_template as AchievementTemplate } from '@prisma/client';
import { PrerequisiteError, RedundantError } from '../util/error';
import swan from '@onlabsorg/swan-js';
import { isMetric } from './metrics';
import { isAggregator } from './aggregator';
import { isBucketCreator } from './bucket';

const logger = getLogger('Achievement Template');

export enum TemplateSelectEnum {
    BY_GROUP = 'group',
    BY_METRIC = 'metrics',
}

// ------------------- Achievement Template Cache & Getters -------------------

// string == metricId, group
const achievementTemplates: Map<TemplateSelectEnum, Map<string, AchievementTemplate[]>> = new Map();

export function purgeAchievementTemplateCache() {
    achievementTemplates.clear();
}

async function buildCache() {
    const templates = await prisma.achievement_template.findMany({
        where: { isActive: true },
    });

    buildGroupCache(templates);
    buildMetricCache(templates);

    logger.info(`Loaded ${templates.length} achievement templates into the cache`);
}

function buildGroupCache(templates: AchievementTemplate[]) {
    achievementTemplates.set(TemplateSelectEnum.BY_GROUP, new Map());
    for (const template of templates) {
        const group = template.group;
        if (!achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.has(group)) {
            achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.set(group, []);
        }
        achievementTemplates.get(TemplateSelectEnum.BY_GROUP)?.get(group)?.push(template);
    }
}

function buildMetricCache(templates: AchievementTemplate[]) {
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

export async function getAchievementTemplates(select: TemplateSelectEnum): Promise<Map<string, AchievementTemplate[]>> {
    if (achievementTemplates.size === 0) {
        await buildCache();
    }

    if (!achievementTemplates.has(select)) {
        logger.warn(`No achievement templates were found in the database`, { select });
    }

    return achievementTemplates.get(select) ?? new Map();
}

export async function getTemplatesByMetrics(metricsForAction: Metric[]) {
    const templatesByMetric = await getAchievementTemplates(TemplateSelectEnum.BY_METRIC);
    if (Array.from(templatesByMetric.values()).reduce((all, temp) => all.concat(temp), []).length === 0) {
        logger.debug(`No achievement templates were found in the database for the metrics: ${metricsForAction.map((m) => `${m.metricName}, `)}`);
        return [];
    }
    let templatesForAction: AchievementTemplate[] = [];
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

export const getTemplate = (id: number) => prisma.achievement_template.findUniqueOrThrow({ where: { id } });
export const getAllTemplates = () => prisma.achievement_template.findMany();
export const getActiveTemplateGroup = (group: string) =>
    prisma.achievement_template.findMany({ where: { group, isActive: true }, orderBy: { groupOrder: 'asc' } });

// ------------------- Achievement Template Create & Update -------------------

// The metadata consists of values that are safe to update at runtime
export type AchievementTemplateMetadata = Pick<
    AchievementTemplate,
    | 'name'
    | 'achievedText'
    | 'actionName'
    | 'actionRedirectLink'
    | 'actionType'
    | 'description'
    | 'subtitle'
    | 'stepName'
    | 'image'
    | 'achievedImage'
    | 'progressDescription'
    | 'streakProgress'
>;
// The logic fields are unsafe to update while a template is active
export type AchievementTemplateLogicFields = Pick<
    AchievementTemplate,
    'condition' | 'conditionDataAggregations' | 'type' | 'templateFor' | 'group' | 'groupOrder'
>;

export type AchievementTemplateCreate = AchievementTemplateMetadata & AchievementTemplateLogicFields;

export async function createTemplate(data: AchievementTemplateCreate) {
    const result = await prisma.achievement_template.create({
        data: { ...data, isActive: false },
    });

    // No need to purge caches as the template is not yet active
    logger.info(`Created inactive AchievementTemplate(${result.id})`, { data });
    return result.id;
}

const logicFields: (keyof AchievementTemplateLogicFields)[] = ['condition', 'conditionDataAggregations', 'group', 'groupOrder', 'templateFor', 'type'];

export type AchievementTemplateUpdate = Partial<AchievementTemplateCreate>;

export async function updateAchievementTemplate(id: number, update: AchievementTemplateUpdate) {
    const updatesLogic = Object.keys(update).some((it) => logicFields.includes(it as any));
    const template = await getTemplate(id);

    if (template.isActive && updatesLogic) {
        // It might be dangerous to update achievement templates when they are active and used
        // Also we generally validate achievevements during activation
        throw new PrerequisiteError(`Cannot update logic of active AchievementTemplate`);
    }

    await prisma.achievement_template.update({ where: { id }, data: update });
    purgeAchievementTemplateCache();

    logger.info(`AchievementTemplate(${id}) was updated`, { update });
}

// ------------------- Achievement Template Activation & Consistency -------------------

export async function checkTemplateConsistencyBeforeActivating(template: AchievementTemplate): Promise<void | never> {
    const group = await getActiveTemplateGroup(template.group);
    logger.info(`Checking AchievementTemplate(${template.id}) for consistency`, { template, group });

    // ---- Template Metadata -----
    if (!template.name || !template.description || !template.subtitle) {
        throw new PrerequisiteError(`AchievementTemplates need a name, description and subtitle`);
    }

    const actionFields = [!!template.actionName, !!template.actionRedirectLink, !!template.actionType];
    if (actionFields.some((it) => it) && !actionFields.every((it) => it)) {
        throw new PrerequisiteError(`actionName, actionRedirectLink and actionType must either all be set or all empty`);
    }

    if ((template.type === AchievementType.SEQUENTIAL) !== !!template.stepName) {
        throw new PrerequisiteError(`stepName must be set for sequential achievements, and only for those`);
    }

    // ---- Template Logic --------
    const aggregations = Object.keys(template.conditionDataAggregations);
    if (aggregations.length < 1) {
        throw new PrerequisiteError(`AchievementTemplate needs at least one data aggregation`);
    }

    for (const [name, aggregation] of Object.entries(template.conditionDataAggregations as ConditionDataAggregations)) {
        if (!isMetric(aggregation.metric)) {
            throw new PrerequisiteError(`Aggregation ${name} uses unknown metric ${aggregation.metric}`);
        }

        if ((template.type === AchievementType.TIERED) !== !!aggregation.valueToAchieve) {
            throw new PrerequisiteError(`valueToAchieve must be set for aggregations of tiered achievements, and only for them`);
        }

        if (!isAggregator(aggregation.aggregator)) {
            throw new PrerequisiteError(`Unknown aggregator ${aggregation.aggregator}`);
        }

        // Bucket Aggregation
        if (aggregation.bucketAggregator && aggregation.createBuckets) {
            if (!isAggregator(aggregation.bucketAggregator)) {
                throw new PrerequisiteError(`Unknown bucket aggregator ${aggregation.aggregator}`);
            }

            if (!isBucketCreator(aggregation.createBuckets)) {
                throw new PrerequisiteError(`Unknown bucket creator ${aggregation.createBuckets}`);
            }
        } else if (aggregation.bucketAggregator || aggregation.createBuckets) {
            throw new PrerequisiteError(`Bucket Aggregator and Bucket Creator must either both be set or not`);
        }
    }

    const availableContext = Object.fromEntries(aggregations.map((it) => [it, 0]));
    if (template.type === AchievementType.STREAK) {
        // Streaks can additionally have a condition based on the current recordValue
        availableContext.recordValue = 0;
    }

    // Unfortunately Swan does not offer a way to find undefined variables.
    // The following is a best effort try to detect wrong conditions:
    const sampleResult = await swan.parse(template.condition)(availableContext);
    if (typeof sampleResult !== 'boolean') {
        throw new PrerequisiteError(
            `AchievementTemplate condition does not evaluate to a boolean - This could be as it references to non existent aggregations`
        );
    }

    // ---- Template Group --------
    for (const other of group) {
        // Only contains already activated templates, so also not self
        // Check that groupOrders define a total order (does not have to be sequential)
        if (other.groupOrder === template.groupOrder) {
            throw new PrerequisiteError(`Inconsistency in groupOrder, must define a total order`);
        }

        // Check that type is set consistently for the whole group
        if (other.type !== template.type) {
            throw new PrerequisiteError(`Inconsistent type in achievement template group`);
        }

        // Check that template type is set consistently for the whole group
        if (other.templateFor !== template.templateFor) {
            throw new PrerequisiteError(`Inconsistent templateFor in achievement template group`);
        }
    }

    // Everything is awesome!
}

export async function activateAchievementTemplate(id: number) {
    const template = await getTemplate(id);

    if (template.isActive) {
        throw new RedundantError('Template is already active');
    }

    await checkTemplateConsistencyBeforeActivating(template);

    await prisma.achievement_template.update({
        where: { id },
        data: { isActive: true },
    });

    purgeAchievementTemplateCache();
    logger.info(`Activated AchievementTemplate(${id})`);
}

export async function deactivateAchievementTemplate(id: number) {
    const template = await getTemplate(id);

    if (!template.isActive) {
        throw new RedundantError('Template is already inactive');
    }

    const hasAchivements = (await prisma.user_achievement.count({ where: { templateId: id } })) > 0;
    if (hasAchivements) {
        throw new PrerequisiteError(`Cannot deactivate AchievementTemplate as it is already in use`);
    }

    await prisma.achievement_template.update({
        where: { id },
        data: { isActive: false },
    });

    purgeAchievementTemplateCache();

    logger.info(`Deactivated AchievementTemplate(${id})`);
}
