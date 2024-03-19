import { prisma } from '../prisma';
import { User } from '../user';
import { sortActionTemplatesToGroups } from './util';
import { getAchievementRelationFromEvent } from './relation';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { getAchievementTamplateUID, getAchievementTemplates, getTemplatesByMetrics, TemplateSelectEnum } from './template';
import { isAchievementConditionMet } from './evaluate';
import { AchievementToCheck, AchievementType, ActionEvent } from './types';
import { createAchievement, getOrCreateUserAchievement } from './create';
// eslint-disable-next-line import/no-cycle
import { actionTakenAt } from '../notification';
import tracer from '../logger/tracing';
import { getMetricsByAction } from './metrics';
import { isGamificationFeatureActive } from '../../utils/environment';
import { metrics } from '../logger/metrics';

const logger = getLogger('Achievement');

export const rewardActionTakenAt = tracer.wrap('achievement.rewardActionTaken', _rewardActionTakenAt);
async function _rewardActionTakenAt<ID extends ActionID>(at: Date, user: User, actionId: ID, eventContext: SpecificNotificationContext<ID>) {
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
        templates: templatesForAction.map((temp) => temp.title),
    });

    const templatesByGroups = sortActionTemplatesToGroups(templatesForAction);

    const actionEvent: ActionEvent<ID> = {
        actionId,
        at,
        user: user,
        context: eventContext,
    };
    const isEventTracked = await tracer.trace('achievement.trackEvent', () => trackEvent(actionEvent));
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
                let achievementContext: SpecificNotificationContext<ID> | undefined = undefined;
                for (const template of group) {
                    achievementContext = { ...eventContext, relation: await getAchievementRelationFromEvent(actionEvent, template.templateFor) };
                    const userAchievement = await tracer.trace('achievement.getOrCreateUserAchievement', () =>
                        getOrCreateUserAchievement(template, user.userID, achievementContext)
                    );
                    if (userAchievement && (userAchievement.achievedAt === null || userAchievement.template?.type === AchievementType.STREAK)) {
                        logger.info('found achievement to check', {
                            achievementId: userAchievement.id,
                            achievementName: userAchievement.template?.title,
                            type: userAchievement.template?.type,
                        });
                        achievementToCheck = userAchievement;
                        break;
                    }
                }
                span?.setTag('achievement.foundToCheck', !!achievementToCheck);
                if (achievementToCheck && achievementContext) {
                    span?.setTag('achievement.id', achievementToCheck.id);
                    await tracer.trace('achievement.checkUserAchievement', () =>
                        checkUserAchievement(achievementToCheck, {
                            ...actionEvent,
                            context: achievementContext,
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

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    if (metricsForEvent.length === 0) {
        logger.warn(`Can't track event, because no metrics found for action`, { actionId: event.actionId });
        return false;
    }

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(event.context);

        logger.info('track event', {
            metric: metric.metricName,
            action: event.actionId,
            value,
            relation: event.context.relation ?? '',
            createdAt: event.at,
        });
        await prisma.achievement_event.create({
            data: {
                metric: metric.metricName,
                value: value,
                action: event.actionId,
                userId: event.user.userID,
                relation: event.context.relation ?? null,
                createdAt: event.at,
            },
        });
        metrics.AchievementsTrackedEvents.inc({ metric: metric.metricName, action: event.actionId });
    }

    return true;
}

async function checkUserAchievement<ID extends ActionID>(userAchievement: AchievementToCheck, event: ActionEvent<ID>) {
    const evaluationResult = await isAchievementConditionMet(userAchievement);
    logger.info('sucessfully evaluated achievement condition', {
        actionId: event.actionId,
        achievementId: userAchievement.id,
        condition: userAchievement.template.condition,
        conditionIsMet: evaluationResult.isConditionMet,
        aggrResult: evaluationResult.aggregationResult,
        shouldInvalidateStreak: evaluationResult.shouldInvalidateStreak,
    });

    if (evaluationResult.isConditionMet) {
        const evaluationResultValue = evaluationResult.aggregationResult;
        const awardedAchievement = await rewardUser(evaluationResultValue, userAchievement, event);
        await createAchievement(awardedAchievement.template, userAchievement.userId, event.context);
    } else if (evaluationResult.shouldInvalidateStreak) {
        await prisma.user_achievement.update({
            where: { id: userAchievement.id },
            data: { achievedAt: null, isSeen: false },
        });
    }
}

async function rewardUser<ID extends ActionID>(evaluationResult: number | null, userAchievement: AchievementToCheck, event: ActionEvent<ID>) {
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
    metrics.AchievementsAchieved.inc({
        id: updatedAchievement.template.id.toString(),
        uid: getAchievementTamplateUID(updatedAchievement.template),
        type: updatedAchievement.template.type,
    });

    const { type, group, groupOrder } = updatedAchievement.template;

    if (type === AchievementType.SEQUENTIAL) {
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
        const lastTemplate = groupTemplates[groupTemplates.length - 1];
        if (groupOrder === lastTemplate.groupOrder) {
            await actionTakenAt(new Date(), event.user, 'user_achievement_reward_issued', {
                achievement: { name: updatedAchievement.template.title, id: updatedAchievement.id.toString() },
            });
        }
    } else {
        await actionTakenAt(new Date(), event.user, 'user_achievement_reward_issued', {
            achievement: { name: updatedAchievement.template.title, id: updatedAchievement.id.toString() },
        });
    }
    return updatedAchievement;
}
