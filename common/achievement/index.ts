import { prisma } from '../prisma';
import { User } from '../user';
import { checkIfAchievementIsGlobal, sortActionTemplatesToGroups } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { getAchievementTemplates, getTemplatesByMetrics, TemplateSelectEnum } from './template';
import { evaluateAchievement } from './evaluate';
import { AchievementToCheck, ActionEvent, ConditionDataAggregations, UserAchievementTemplate } from './types';
import { createAchievement, getOrCreateUserAchievement } from './create';
// eslint-disable-next-line import/no-cycle
import { actionTakenAt } from '../notification';
import tracer from '../logger/tracing';
import { getMetricsByAction } from './metrics';
import { achievement_type_enum, achievement_template_for_enum } from '../../graphql/generated';
import { isGamificationFeatureActive } from '../../utils/environment';
import { achievement_template } from '@prisma/client';

const logger = getLogger('Achievement');

export const rewardActionTaken = tracer.wrap('achievement.rewardActionTaken', _rewardActionTaken);
async function _rewardActionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    if (!isGamificationFeatureActive()) {
        logger.warn(`Gamification feature is not active`);
        return;
    }
    const metricsForAction = getMetricsByAction(actionId);
    const templatesForAction = await tracer.trace('achievement.getTemplatesByMetrics', () => getTemplatesByMetrics(metricsForAction));

    if (templatesForAction.length === 0) {
        logger.debug(`No achievement found for action`, { actionId });
        return;
    }
    logger.info('found achievement templates for action', {
        actionId,
        metrics: metricsForAction.map((metric) => metric.metricName),
        templates: templatesForAction.map((temp) => temp.name),
    });

    const templatesByGroups = sortActionTemplatesToGroups(templatesForAction);

    const actionEvent: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };
    const isEventTracked = await tracer.trace('achievement.trackEvent', () => trackEvent(actionEvent, templatesByGroups));
    if (!isEventTracked) {
        logger.warn(`Can't track action for user`, { actionId, userId: user.userID });
        return;
    }

    for (const [groupName, group] of templatesByGroups) {
        try {
            await tracer.trace('achievement.evaluateAchievementGroups', async (span) => {
                span?.setTag('achievement.group', groupName);
                logger.info('evaluate achievement group', { groupName });

                let achievementToCheck: AchievementToCheck | undefined = undefined;
                for (const template of group) {
                    const userAchievement = await tracer.trace('achievement.getOrCreateUserAchievement', () =>
                        getOrCreateUserAchievement(template, user.userID, context)
                    );
                    if (userAchievement && (userAchievement.achievedAt === null || userAchievement.template?.type === achievement_type_enum.STREAK)) {
                        logger.info('found achievement to check', {
                            achievementId: userAchievement.id,
                            achievementName: userAchievement.template?.name,
                            type: userAchievement.template?.type,
                        });
                        achievementToCheck = userAchievement;
                        break;
                    }
                }
                span?.setTag('achievement.foundToCheck', !!achievementToCheck);
                if (achievementToCheck) {
                    span?.setTag('achievement.id', achievementToCheck.id);
                    await tracer.trace('achievement.checkUserAchievement', () =>
                        checkUserAchievement(achievementToCheck as UserAchievementTemplate, {
                            ...actionEvent,
                            context,
                        })
                    );
                }
                logger.info('group evaluation done', { groupName });
            });
        } catch (e) {
            logger.error(`Error occurred while checking achievement for user`, e as Error, { userId: user.userID });
        }
    }
}

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>, templateGroups: Map<string, achievement_template[]>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    if (metricsForEvent.length === 0) {
        logger.warn(`Can't track event, because no metrics found for action`, { actionId: event.actionId });
        return false;
    }

    const lectureStart = event.context['lectureStart'] ? new Date(event.context['lectureStart']) : undefined;

    for (const metric of metricsForEvent) {
        let templateForMetric: achievement_template | undefined = undefined;
        templateGroups.forEach((temp) => {
            const key = Object.keys(temp[0].conditionDataAggregations)[0];
            if (temp[0].conditionDataAggregations[key].metric === metric.metricName) {
                templateForMetric = temp[0];
            }
        });
        const formula = metric.formula;
        const value = formula(event.context);

        logger.info('track event', {
            metric: metric.metricName,
            action: event.actionId,
            value,
            relation: event.context.relation ?? '',
            createdAt: lectureStart || event.at,
        });
        await prisma.achievement_event.create({
            data: {
                metric: metric.metricName,
                value: value,
                action: event.actionId,
                userId: event.user.userID,
                relation: event.context.relation ?? '',
                createdAt: lectureStart || event.at,
            },
        });
    }

    return true;
}

async function checkUserAchievement<ID extends ActionID>(userAchievement: UserAchievementTemplate, event: ActionEvent<ID>) {
    const evaluationResult = await isAchievementConditionMet(userAchievement, event);
    logger.info('sucessfully evaluated achievement condition', {
        actionId: event.actionId,
        achievementId: userAchievement.id,
        condition: userAchievement.template.condition,
        conditionIsMet: evaluationResult?.conditionIsMet,
        resultObject: JSON.stringify(evaluationResult?.resultObject, null, 4),
    });

    if (evaluationResult === null) {
        // TODO: handle this case
        return;
    }

    if (evaluationResult.conditionIsMet) {
        const conditionDataAggregations = userAchievement?.template.conditionDataAggregations as ConditionDataAggregations;
        const dataAggregationKey = Object.keys(conditionDataAggregations)[0];
        const evaluationResultValue =
            typeof evaluationResult.resultObject[dataAggregationKey] === 'number' ? Number(evaluationResult.resultObject[dataAggregationKey]) : null;
        const awardedAchievement = await rewardUser(evaluationResultValue, userAchievement, event);
        await createAchievement(awardedAchievement.template, userAchievement.userId, event.context);
    } else {
        await prisma.user_achievement.update({
            where: { id: userAchievement.id },
            data: { achievedAt: null, isSeen: false },
        });
    }
}

async function isAchievementConditionMet<ID extends ActionID>(achievement: UserAchievementTemplate, event: ActionEvent<ID>) {
    const {
        userId,
        recordValue,
        template: { condition, conditionDataAggregations },
    } = achievement;
    if (!condition) {
        logger.error(`No condition found for achievement`, undefined, { template: achievement.template.name, achievementId: achievement.id });
        return { conditionIsMet: false, resultObject: {} };
    }
    const result = await evaluateAchievement(userId, condition, conditionDataAggregations as ConditionDataAggregations, recordValue, event.context.relation);
    if (result === undefined) {
        return null;
    }
    return result;
}

async function rewardUser<ID extends ActionID>(evaluationResult: number | null, userAchievement: UserAchievementTemplate, event: ActionEvent<ID>) {
    let newRecordValue = null;
    if (typeof userAchievement.recordValue === 'number' && evaluationResult) {
        newRecordValue = evaluationResult;
    }
    logger.info('reward user', { achievementId: userAchievement.id, userId: userAchievement.userId, recordValue: newRecordValue, achievedAt: new Date() });
    const updatedAchievement = await prisma.user_achievement.update({
        where: { id: userAchievement.id },
        data: { achievedAt: new Date(), recordValue: newRecordValue, isSeen: false },
        select: { id: true, userId: true, achievedAt: true, template: true },
    });

    const { type, group, groupOrder } = updatedAchievement.template;

    if (type === achievement_type_enum.SEQUENTIAL) {
        const templatesByGroup = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
        const groupTemplates = templatesByGroup.get(group);
        /**
         * Templates are evaluated in sequence, starting from the first and progressing towards the last.
         * The @param lastTemplate requiring evaluation is the second-to-last one in the group.
         * The final template in the sequence serves solely to display information about the sequential achievement being rewarded.
         * Before generating the reward achievement for a sequential achievement, the system checks if the last achievement to be evaluated has been achieved.
         */
        if (!groupTemplates) {
            return updatedAchievement;
        }
        const lastTemplate = groupTemplates[groupTemplates.length - 2];
        if (groupOrder === lastTemplate.groupOrder) {
            await actionTakenAt(new Date(event.at), event.user, 'user_achievement_reward_issued', {
                achievement: { name: updatedAchievement.template.name, id: updatedAchievement.id.toString() },
            });
        }
    } else {
        await actionTakenAt(new Date(event.at), event.user, 'user_achievement_reward_issued', {
            achievement: { name: updatedAchievement.template.name, id: updatedAchievement.id.toString() },
        });
    }
    return updatedAchievement;
}
