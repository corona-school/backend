import { prisma } from '../prisma';
import { achievement_type_enum, Prisma } from '@prisma/client';
import { Achievement, achievement_state, Step } from '../../graphql/types/achievement';
import { User } from '../user';
import { ConditionDataAggregations } from './types';
import { getAchievementState, renderAchievementWithContext, transformPrismaJson } from './util';
import { evaluateAchievement } from './evaluate';
import { getAchievementImageURL } from './util';
import { isDefined } from './util';

export async function getUserAchievementsWithTemplates(user: User) {
    const userAchievementsWithTemplates = await prisma.user_achievement.findMany({
        where: { userId: user.userID, AND: { template: { isActive: true } } },
        include: { template: true },
    });
    return userAchievementsWithTemplates;
}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type achievements_with_template = ThenArg<ReturnType<typeof getUserAchievementsWithTemplates>>;

const getAchievementById = async (user: User, achievementId: number): Promise<Achievement> => {
    const userAchievement = await prisma.user_achievement.findFirstOrThrow({
        where: { id: achievementId, userId: user.userID },
        include: { template: true },
    });
    const achievement = await assembleAchievementData([userAchievement], user);
    return achievement;
};

// Next step achievements are sequential achievements that are currently active and not yet completed. They get displayed in the next step card section.
const getNextStepAchievements = async (user: User): Promise<Achievement[]> => {
    const userAchievements = await prisma.user_achievement.findMany({
        where: { userId: user.userID, template: { type: achievement_type_enum.SEQUENTIAL } },
        include: { template: true },
    });
    const userAchievementGroups: { [groupRelation: string]: achievements_with_template } = {};
    userAchievements.forEach((ua) => {
        const key = ua.relation ? `${ua.template.group}/${ua.relation}` : ua.template.group;
        if (!userAchievementGroups[key]) {
            userAchievementGroups[key] = [];
        }
        userAchievementGroups[key].push(ua);
    });
    Object.keys(userAchievementGroups).forEach((groupName) => {
        const group = userAchievementGroups[groupName].sort((a, b) => a.template.groupOrder - b.template.groupOrder);
        group[group.length - 1].achievedAt && delete userAchievementGroups[groupName];
    });
    const achievements: Achievement[] = await generateReorderedAchievementData(userAchievementGroups, user);
    return achievements;
};

// Inactive achievements are achievements that are not yet existing but could be achieved in the future.
// They are created for every template in a Tiered achievements group that is not yet used as a achievement for a specific user.
const getFurtherAchievements = async (user: User): Promise<Achievement[]> => {
    const userAchievements = await prisma.user_achievement.findMany({
        where: { userId: user.userID, template: { isActive: true } },
        include: { template: true },
    });

    const groups = Array.from(new Set(userAchievements.map((ua) => ua.template.group)));
    const templates = Array.from(new Set(userAchievements.map((ua) => ua.templateId)));
    const tieredTemplates = await prisma.achievement_template.findMany({
        where: {
            isActive: true,
            group: { in: groups },
            type: achievement_type_enum.TIERED,
            NOT: { id: { in: templates } },
        },
    });

    const tieredAchievements = tieredTemplates.map(async (template) => {
        const dataAggr = template.conditionDataAggregations as Prisma.JsonObject;
        const maxValue = Object.keys(dataAggr)
            .map((key) => {
                const val = dataAggr[key] as number;
                return Number(val);
            })
            .reduce((a, b) => a + b, 0);
        const achievement: Achievement = {
            id: template.id,
            name: template.name,
            subtitle: template.subtitle,
            description: template.description,
            image: await getAchievementImageURL(template),
            alternativeText: 'alternativeText',
            actionType: template.actionType ?? undefined,
            achievementType: template.type,
            achievementState: achievement_state.INACTIVE,
            steps: null,
            maxSteps: maxValue,
            currentStep: 0,
            isNewAchievement: null,
            progressDescription: `Noch ${userAchievements.length - userAchievements.length} Schritte bis zum Abschluss`,
            actionName: template.actionName,
            actionRedirectLink: template.actionRedirectLink,
        };
        return achievement;
    });
    return Promise.all(tieredAchievements);
};

// User achievements are already started by the user and are either active or completed.
const getUserAchievements = async (user: User): Promise<Achievement[]> => {
    const userAchievements = await getUserAchievementsWithTemplates(user);
    const userAchievementGroups: { [group: string]: achievements_with_template } = {};
    userAchievements.forEach((ua) => {
        if (!userAchievementGroups[ua.template.group]) {
            userAchievementGroups[ua.template.group] = [];
        }
        userAchievementGroups[ua.template.group].push(ua);
    });
    const achievements: Achievement[] = await generateReorderedAchievementData(userAchievementGroups, user);
    return achievements;
};

export const achievement_with_template = Prisma.validator<Prisma.user_achievementArgs>()({
    include: { template: true },
});
const generateReorderedAchievementData = async (groups: { [group: string]: achievements_with_template }, user: User): Promise<Achievement[]> => {
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
            if (sortedGroupAchievements[0].template.type === achievement_type_enum.TIERED) {
                return await Promise.all(
                    sortedGroupAchievements.map(async (groupAchievement) => {
                        const achievement: Achievement = await assembleAchievementData([groupAchievement], user);
                        return achievement;
                    })
                );
            }
            const groupAchievement: Achievement = await assembleAchievementData(sortedGroupAchievements, user);
            return [groupAchievement];
        })
    );
    return achievements.flat();
};

// TODO: refactor
const assembleAchievementData = async (userAchievements: achievements_with_template, user: User): Promise<Achievement> => {
    let currentAchievementIndex = userAchievements.findIndex((ua) => !ua.achievedAt);
    currentAchievementIndex = currentAchievementIndex >= 0 ? currentAchievementIndex : userAchievements.length - 1;

    const achievementTemplates = await prisma.achievement_template.findMany({
        where: { group: userAchievements[currentAchievementIndex].template.group, isActive: true },
        orderBy: { groupOrder: 'asc' },
    });

    const condition = userAchievements[currentAchievementIndex].recordValue
        ? userAchievements[currentAchievementIndex].template.condition.replace(
              'recordValue',
              (userAchievements[currentAchievementIndex].recordValue + 1).toString()
          )
        : userAchievements[currentAchievementIndex].template.condition;

    let maxValue: number = 0;
    let currentValue: number = 0;
    if (
        userAchievements[currentAchievementIndex].template.type === achievement_type_enum.STREAK ||
        userAchievements[currentAchievementIndex].template.type === achievement_type_enum.TIERED
    ) {
        const dataAggregationKeys = Object.keys(userAchievements[currentAchievementIndex].template.conditionDataAggregations as Prisma.JsonObject);
        const evaluationResult = await evaluateAchievement(
            user.userID,
            condition,
            userAchievements[currentAchievementIndex].template.conditionDataAggregations as ConditionDataAggregations,
            userAchievements[currentAchievementIndex].recordValue || undefined,
            userAchievements[currentAchievementIndex].relation || undefined
        );
        if (evaluationResult) {
            currentValue = dataAggregationKeys.map((key) => evaluationResult.resultObject[key]).reduce((a, b) => a + b, 0);
            maxValue =
                userAchievements[currentAchievementIndex].template.type === achievement_type_enum.STREAK
                    ? userAchievements[currentAchievementIndex].recordValue !== null && userAchievements[currentAchievementIndex].recordValue > currentValue
                        ? userAchievements[currentAchievementIndex].recordValue
                        : currentValue
                    : dataAggregationKeys
                          .map((key) => {
                              // TODO: check if we can remove valueToAchieve
                              return Number(
                                  (userAchievements[currentAchievementIndex].template.conditionDataAggregations as any)[key].valueToAchieve as string
                              );
                          })
                          .reduce((a, b) => a + b, 0);
            if (currentValue < maxValue && userAchievements[currentAchievementIndex].achievedAt) {
                await prisma.user_achievement.update({
                    where: { id: userAchievements[currentAchievementIndex].id },
                    data: { achievedAt: null, isSeen: false },
                });
            }
        }
    } else {
        currentValue = currentAchievementIndex;
        maxValue = achievementTemplates.length - 1;
    }

    const state: achievement_state = getAchievementState(userAchievements, currentAchievementIndex);
    const isNewAchievement = state === achievement_state.COMPLETED && !userAchievements[currentAchievementIndex].isSeen;

    const achievementContext = transformPrismaJson(
        user,
        userAchievements[currentAchievementIndex].relation,
        userAchievements[currentAchievementIndex].context as Prisma.JsonObject
    );
    const leftProgress = maxValue - currentValue;
    const currentAchievementTemplate = renderAchievementWithContext(userAchievements[currentAchievementIndex], achievementContext, {
        leftProgress: leftProgress.toString(),
        progress: currentValue.toString(),
        recordValue: maxValue.toString(),
    });

    const resultAchievement = {
        id: userAchievements[currentAchievementIndex].id,
        name: currentAchievementTemplate.name,
        subtitle: currentAchievementTemplate.subtitle,
        description: currentAchievementTemplate.description,
        image: await getAchievementImageURL(currentAchievementTemplate, state, userAchievements[currentAchievementIndex].relation),
        alternativeText: 'alternativeText',
        actionType: currentAchievementTemplate.actionType,
        achievementType: currentAchievementTemplate.type,
        achievementState: state,
        steps: currentAchievementTemplate.stepName
            ? achievementTemplates
                  .map((achievement, index): Step | null => {
                      // if a achievementTemplate has a stepName, it means that it must have multiple steps resulting in it having a sequence of achievements / templates
                      // for every achievement in the sortedGroupAchievements, we create a step object with the stepName (descirption) and isActive property for the achievement step currently active but unachieved
                      if (index < achievementTemplates.length - 1 && achievement.isActive) {
                          return {
                              name: achievement.stepName,
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
        progressDescription: currentAchievementTemplate.progressDescription,
        achievedText: currentAchievementTemplate.achievedText,
        streakProgress: currentAchievementTemplate.streakProgress,
        actionName: currentAchievementTemplate.actionName,
        actionRedirectLink: currentAchievementTemplate.actionRedirectLink,
    };
    return resultAchievement;
};

export { getUserAchievements, getFurtherAchievements, getNextStepAchievements, getAchievementById };
