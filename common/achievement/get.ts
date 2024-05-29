import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { User } from '../user';
import { AchievementState, AchievementType, PublicAchievement, PublicStep, ThenArg } from './types';
import { getAchievementState, renderAchievementWithContext, transformPrismaJson } from './util';
import { getAchievementImageURL } from './util';
import { isDefined } from './util';
import { isAchievementConditionMet } from './evaluate';
import { getLogger } from '../logger/logger';
import { deriveAchievements, deriveAchievementTemplates } from './derive';

const logger = getLogger('Achievement');

export async function getUserAchievementsWithTemplates(user: User, byType: AchievementType | null = null) {
    const templateSearch = { isActive: true };
    if (byType !== null) {
        templateSearch['type'] = byType;
    }
    const userAchievementsWithTemplates = await prisma.user_achievement.findMany({
        where: {
            userId: user.userID,
            template: templateSearch,
            // This will ensure that we only get achievements that are either not streaks or have a recordValue of at least 1
            // Otherwise, we would get all streaks that have not been started yet.
            // This can happen if an event related to a streak was emitted, but does not match any bucket, like "join on time".
            OR: [{ recordValue: null }, { recordValue: { gt: 0 } }],
        },
        include: { template: true },
    });
    return userAchievementsWithTemplates;
}
export type achievements_with_template = ThenArg<ReturnType<typeof getUserAchievementsWithTemplates>>;

const getAchievementById = async (user: User, achievementId: number): Promise<PublicAchievement> => {
    const userAchievement = await prisma.user_achievement.findFirstOrThrow({
        where: { id: achievementId, userId: user.userID },
        include: { template: true },
    });
    const achievement = await assembleAchievementData([userAchievement], user);
    return achievement;
};

// Next step achievements are sequential achievements that are currently active and not yet completed. They get displayed in the next step card section.
const getNextStepAchievements = async (user: User): Promise<PublicAchievement[]> => {
    const userAchievements = await getUserAchievementsWithTemplates(user, AchievementType.SEQUENTIAL);
    const derivedAchievements = await deriveAchievements(user, userAchievements);
    userAchievements.push(...derivedAchievements);

    const userAchievementGroups: { [groupRelation: string]: achievements_with_template } = {};
    userAchievements.forEach((ua) => {
        const key = ua.relation ? `${ua.template.group}/${ua.relation}` : ua.template.group;
        if (!userAchievementGroups[key]) {
            userAchievementGroups[key] = [];
        }
        userAchievementGroups[key].push(ua);
    });
    const achievements = await generateReorderedAchievementData(userAchievementGroups, user);
    return achievements.filter((a) => a.achievementState === AchievementState.ACTIVE);
};

// Inactive achievements are achievements that are not yet existing but could be achieved in the future.
// They are created for every template in a Tiered achievements group that is not yet used as a achievement for a specific user.
const getFurtherAchievements = async (user: User): Promise<PublicAchievement[]> => {
    const userAchievements = await getUserAchievementsWithTemplates(user);

    const groups = Array.from(new Set(userAchievements.map((ua) => ua.template.group)));
    const templates = Array.from(new Set(userAchievements.map((ua) => ua.templateId)));
    const tieredTemplates = await prisma.achievement_template.findMany({
        where: {
            isActive: true,
            group: { in: groups },
            type: AchievementType.TIERED,
            NOT: { id: { in: templates } },
        },
    });

    const tieredAchievements = tieredTemplates.map(async (template) => {
        const dataAggr = template.conditionDataAggregations as Prisma.JsonObject;
        const maxValue = Object.keys(dataAggr)
            .map((key) => {
                const val = dataAggr[key]['valueToAchieve'] as number;
                return Number(val || 0);
            })
            .reduce((a, b) => a + b, 0);
        const achievement: PublicAchievement = {
            id: template.id,
            name: template.title,
            tagline: template.tagline,
            title: template.title,
            footer: template.footer,
            subtitle: template.tagline,
            description: template.description,
            image: await getAchievementImageURL(template),
            alternativeText: 'alternativeText',
            actionType: template.actionType ?? undefined,
            achievementType: template.type,
            achievementState: AchievementState.INACTIVE,
            steps: null,
            maxSteps: maxValue,
            currentStep: 0,
            isNewAchievement: null,
            progressDescription: template.footer,
            actionName: template.actionName,
            actionRedirectLink: template.actionRedirectLink,
        };
        return achievement;
    });
    return Promise.all(tieredAchievements);
};

// User achievements are already started by the user and are either active or completed.
const getUserAchievements = async (user: User): Promise<PublicAchievement[]> => {
    const userAchievements = await getUserAchievementsWithTemplates(user);
    const derivedAchievements = await deriveAchievements(user, userAchievements);
    userAchievements.push(...derivedAchievements);

    const userAchievementGroups: { [group: string]: achievements_with_template } = {};
    userAchievements.forEach((ua) => {
        if (!userAchievementGroups[`${ua.template.group}/${ua.relation}`]) {
            userAchievementGroups[`${ua.template.group}/${ua.relation}`] = [];
        }
        userAchievementGroups[`${ua.template.group}/${ua.relation}`].push(ua);
    });
    const achievements: PublicAchievement[] = await generateReorderedAchievementData(userAchievementGroups, user);
    return achievements;
};

export const achievement_with_template = Prisma.validator<Prisma.user_achievementArgs>()({
    include: { template: true },
});
const generateReorderedAchievementData = async (groups: { [group: string]: achievements_with_template }, user: User): Promise<PublicAchievement[]> => {
    const groupKeys = Object.keys(groups);
    const achievements = await Promise.all(
        groupKeys.map(async (key) => {
            const group = groups[key];
            const sortedGroupAchievements = group.sort((a, b) => a.template.groupOrder - b.template.groupOrder);
            /**
             * This Assembles individual achievements for tiered milestones. Tiered achievements represent steps on the path to higher scores.
             * Unlike sequential achievements, each tier is processed separately and displayed on the frontend as a distinct achievement.
             * The code checks if the first achievement in the sorted group is of type 'TIERED' and, if so, asynchronously assembles the data for each groupAchievement individually.
             */
            if (sortedGroupAchievements[0].template.type === AchievementType.TIERED) {
                return await Promise.all(
                    sortedGroupAchievements.map(async (groupAchievement) => {
                        const achievement: PublicAchievement = await assembleAchievementData([groupAchievement], user);
                        return achievement;
                    })
                );
            }
            const groupAchievement: PublicAchievement = await assembleAchievementData(sortedGroupAchievements, user);
            return [groupAchievement];
        })
    );
    return achievements.flat();
};

// TODO: refactor
const assembleAchievementData = async (userAchievements: achievements_with_template, user: User): Promise<PublicAchievement> => {
    let currentAchievementIndex = userAchievements.findIndex((ua) => !ua.achievedAt);
    currentAchievementIndex = currentAchievementIndex >= 0 ? currentAchievementIndex : userAchievements.length - 1;

    const achievementTemplates = await prisma.achievement_template.findMany({
        where: { group: userAchievements[currentAchievementIndex].template.group, isActive: true },
        orderBy: { groupOrder: 'asc' },
    });
    const derivedTemplates = deriveAchievementTemplates(userAchievements[currentAchievementIndex].template.group);
    achievementTemplates.push(...derivedTemplates);
    achievementTemplates.sort((left, right) => left.groupOrder - right.groupOrder);

    let maxValue: number = achievementTemplates.length;
    let currentValue: number = currentAchievementIndex;
    if (userAchievements[currentAchievementIndex].template.type === AchievementType.STREAK) {
        const evaluationResult = await isAchievementConditionMet(userAchievements[currentAchievementIndex]);
        currentValue = evaluationResult.aggregationResult;
        maxValue = userAchievements[currentAchievementIndex].recordValue;

        // Streaks are usually invalidated if a user does not show up for a certain meeting / course / etc.
        // This means we don't have an event to reevaluate the streak naturally.
        // There are two ways to solve this:
        // 1. We could reevaluate the streak every time the user opens the app.
        // 2. We could create a cronjob that reevaluates all streaks every now and then.
        // As the cron would be more complex and less efficient, we chose the first option, which is implemented here:
        if (evaluationResult.shouldInvalidateStreak) {
            logger.info('Streak will be invalidated', {
                userId: user.userID,
                achievementId: userAchievements[currentAchievementIndex].id,
                currentValue,
                maxValue,
            });
            await prisma.user_achievement.update({
                where: { id: userAchievements[currentAchievementIndex].id },
                data: { achievedAt: null, isSeen: false },
            });
        }
    }
    if (userAchievements[currentAchievementIndex].template.type === AchievementType.TIERED) {
        const evaluationResult = await isAchievementConditionMet(userAchievements[currentAchievementIndex]);
        const {
            template: { conditionDataAggregations },
        } = userAchievements[currentAchievementIndex];
        currentValue = evaluationResult.aggregationResult;
        maxValue = Object.keys(conditionDataAggregations).reduce((acc, key) => acc + conditionDataAggregations[key].valueToAchieve, 0);
    }

    const state: AchievementState = getAchievementState(userAchievements, currentAchievementIndex);
    const isNewAchievement = state === AchievementState.COMPLETED && !userAchievements[currentAchievementIndex].isSeen;

    const achievementContext = transformPrismaJson(
        user,
        userAchievements[currentAchievementIndex].relation,
        userAchievements[currentAchievementIndex].context as Prisma.JsonObject
    );
    const eventsToBeatStreak = maxValue - currentValue + 1;
    const currentAchievementTemplate = renderAchievementWithContext(userAchievements[currentAchievementIndex], achievementContext, {
        remainingProgress: eventsToBeatStreak.toString(),
        progress: currentValue.toString(),
        maxValue: maxValue.toString(),
    });

    let desciption = currentAchievementTemplate.description;
    if (state === AchievementState.COMPLETED && currentAchievementTemplate.achievedDescription) {
        desciption = currentAchievementTemplate.achievedDescription;
    }
    let footer = currentAchievementTemplate.footer;
    if (state === AchievementState.COMPLETED && currentAchievementTemplate.achievedFooter) {
        footer = currentAchievementTemplate.achievedFooter;
    }

    return {
        id: userAchievements[currentAchievementIndex].id,
        title: currentAchievementTemplate.title,
        name: currentAchievementTemplate.title,
        tagline: currentAchievementTemplate.tagline,
        subtitle: currentAchievementTemplate.subtitle,
        footer: footer,
        description: desciption,
        image: await getAchievementImageURL(currentAchievementTemplate, state, userAchievements[currentAchievementIndex].relation),
        alternativeText: 'alternativeText',
        actionType: currentAchievementTemplate.actionType,
        achievementType: currentAchievementTemplate.type,
        achievementState: state,
        steps:
            currentAchievementTemplate.type === AchievementType.SEQUENTIAL
                ? achievementTemplates
                      .map((achievement, index): PublicStep | null => {
                          // for every achievement in the sortedGroupAchievements, we create a step object with the stepName (description) and isActive property for the achievement step currently active but unachieved
                          if (index < achievementTemplates.length && achievement.isActive) {
                              return {
                                  name: achievement.sequentialStepName,
                                  isActive: index === currentAchievementIndex,
                              };
                          }
                          return null;
                      })
                      .filter(isDefined)
                : null,
        maxSteps: maxValue,
        currentStep: currentValue,
        isNewAchievement: isNewAchievement,
        progressDescription: currentAchievementTemplate.footer,
        achievedText: currentAchievementTemplate.achievedFooter,
        streakProgress: currentAchievementTemplate.subtitle,
        actionName: currentAchievementTemplate.actionName,
        actionRedirectLink: currentAchievementTemplate.actionRedirectLink,
    };
};

export { getUserAchievements, getFurtherAchievements, getNextStepAchievements, getAchievementById };
