import { prisma } from '../prisma';
import { User } from '../user';
import { getMetricsByAction } from './util';
import { getLogger } from '../logger/logger';
import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { Achievement_template, achievement_type_enum } from '../../graphql/generated';
import { getTemplatesByAction } from './template';
import { evaluateAchievement } from './evaluate';
import { ConditionDataAggregations, EventValue, Metric } from './types';
import { createUserAchievement } from './create';

const logger = getLogger('Achievement');

export type UserAchievementWithTemplate = {
    userId: string;
    template: {
        id: number;
        group: string;
        groupOrder: number;
        condition: string;
        conditionDataAggregations: ConditionDataAggregations;
        metrics: string[];
        type: achievement_type_enum;
    };
};

export type ActionEvent<ID extends ActionID> = {
    actionId: ActionID;
    at: Date;
    user: User;
    context: SpecificNotificationContext<ID>;
};
export type Achievement_Event = {
    userId?: string;
    metric: string;
    value: EventValue;
    action?: string;
    relation?: string; // e.g. "user/10", "subcourse/15", "match/20"
};

export async function actionTaken<ID extends ActionID>(user: User, actionId: ID, context: SpecificNotificationContext<ID>) {
    const templatesForAction = await getTemplatesByAction(actionId);
    console.log('ACTION TAKEN - TEMPLATES:', JSON.stringify(templatesForAction));

    // check if action triggers an achievement
    if (templatesForAction.length === 0) {
        logger.debug(`No achievement found for action '${actionId}'`);
        return;
    }
    let groupedTemplatesForAction: Map<string, Achievement_template[]>;

    for (const template of templatesForAction) {
        if (!groupedTemplatesForAction.has(template.group)) {
            groupedTemplatesForAction.set(template.group, []);
        }
        groupedTemplatesForAction[template.group].push(template);
    }

    groupedTemplatesForAction.forEach((templates, group) => {
        groupedTemplatesForAction.set(
            group,
            templates.sort((a, b) => a.groupOrder - b.groupOrder)
        );
    });

    groupedTemplatesForAction.forEach(async (templateGroup) => {
        const userAchievements = [];
        for (const template of templateGroup) {
            const foundAchievements = await prisma.user_achievement.findMany({
                where: { userId: user.userID, templateId: template.id },
                select: {
                    userId: true,
                    template: {
                        select: { id: true, condition: true, conditionDataAggregations: true, metrics: true, group: true, groupOrder: true, type: true },
                    },
                },
            });
            userAchievements.push(foundAchievements);
        }
        if (userAchievements.length === 0) {
            // TODO
            // createUserAchievement()
        }
    });
    // gibt es für dieses template bereits ein user achievement?

    const event: ActionEvent<ID> = {
        actionId,
        at: new Date(),
        user: user,
        context,
    };

    await trackEvent(event, context);

    // achievedAt: null
    const userAchievements = await prisma.user_achievement.findMany({
        where: { userId: user.userID, templateId: { in: templatesForAction.map((t) => t.id) } },
        select: {
            userId: true,
            template: { select: { id: true, condition: true, conditionDataAggregations: true, metrics: true, group: true, groupOrder: true, type: true } },
        },
    });

    // const templatesWithUserAch: Achievement_template[] = await createUserAchievement(userAchievements, userId, context);
    await checkAndCreateAchievement(userAchievements as UserAchievementWithTemplate[], user.userID, context);

    return null;
}

async function trackEvent<ID extends ActionID>(event: ActionEvent<ID>, context: SpecificNotificationContext<ID>) {
    const metricsForEvent = getMetricsByAction(event.actionId);

    if (!metricsForEvent) {
        logger.debug(`Can't track event, because no metrics found for action '${event.actionId}'`);
        return;
    }

    for (const metric of metricsForEvent) {
        const formula = metric.formula;
        const value = formula(context);

        await prisma.achievement_event.create({
            data: {
                metric: metric.metricName,
                value: value,
                action: event.actionId,
                userId: event.user.userID,
                // TODO - get relation OR get relationId from context?
                relation: event.context.relationId ?? '',
            },
        });
    }

    return true;
}

async function checkAndCreateAchievement<ID extends ActionID>(
    userAchievements: UserAchievementWithTemplate[],
    userId: string,
    context: SpecificNotificationContext<ID>
) {
    for (const achievement of userAchievements) {
        if (achievement) {
            const isMet = await isAchievementConditionMet(achievement, context);
            if (isMet) {
                await createUserAchievement(userAchievements, userId, context);
            }
        }
    }
}

async function isAchievementConditionMet(achievement: UserAchievementWithTemplate, context: NotificationContext) {
    const {
        userId,
        template: { condition, conditionDataAggregations, metrics },
    } = achievement;
    if (!condition) {
        return;
    }
    const conditionIsMet = await evaluateAchievement(condition, conditionDataAggregations as ConditionDataAggregations, metrics);
    return conditionIsMet;
}

async function awardUser(userAchievementId: number) {
    const awarded = await prisma.user_achievement.update({ where: { id: userAchievementId }, data: { achievedAt: new Date() } });
}
