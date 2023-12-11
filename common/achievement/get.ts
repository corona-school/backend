import { prisma } from '../prisma';
import { User_achievement, achievement_action_type_enum, achievement_type_enum } from '../../graphql/generated';
import { Achievement, achievement_state } from '../../graphql/types/achievement';
import { User } from '../user';
import { ConditionDataAggregations } from './types';
import { getAchievementState, getCurrentAchievementTemplateWithContext, transformPrismaJson } from './util';
import { evaluateAchievement } from './evaluate';

const getUserAchievements = async (user: User): Promise<Achievement[]> => {
    const userAchievements = await prisma.user_achievement.findMany({
        where: { userId: user.userID },
        include: { template: true },
    });
    const userAchievementGroups: { [group: string]: User_achievement[] } = {};
    userAchievements.forEach((ua) => {
        if (!userAchievementGroups[ua.template.group]) {
            userAchievementGroups[ua.template.group] = [];
        }
        userAchievementGroups[ua.template.group].push(ua);
    });
    const achievements: Achievement[] = await generateReorderedAchievementData(userAchievementGroups, user);
    return achievements;
};

const generateReorderedAchievementData = async (groups: { [group: string]: User_achievement[] }, user: User): Promise<Achievement[]> => {
    const achievements: Achievement[] = [];
    for (const group in groups) {
        const sortedGroupAchievements = groups[group].sort((a, b) => a.groupOrder - b.groupOrder);
        if (sortedGroupAchievements[0].template.type === achievement_type_enum.TIERED) {
            sortedGroupAchievements.forEach(async (groupAchievement, index) => {
                const achievement: Achievement = await assembleAchievementData([groupAchievement], user);
                achievements.push(achievement);
            });
        } else {
            const groupAchievement: Achievement = await assembleAchievementData(sortedGroupAchievements, user);
            achievements.push(groupAchievement);
        }
    }
    return Promise.all(achievements);
};

const assembleAchievementData = async (userAchievements: User_achievement[], user: User): Promise<Achievement> => {
    let currentAchievementIndex = userAchievements.findIndex((ua) => !ua.achievedAt);
    currentAchievementIndex = currentAchievementIndex >= 0 ? currentAchievementIndex : userAchievements.length - 1;

    const achievementContext = await transformPrismaJson(user, userAchievements[currentAchievementIndex].context);
    const currentAchievementTemplate = getCurrentAchievementTemplateWithContext(userAchievements[currentAchievementIndex], achievementContext);

    const state: achievement_state = getAchievementState(userAchievements, currentAchievementIndex);

    const isNewAchievement = state === achievement_state.COMPLETED && !userAchievements[currentAchievementIndex].isSeen;

    const condition = currentAchievementTemplate.condition.includes('recordValue')
        ? currentAchievementTemplate.condition.replace('recordValue', (userAchievements[currentAchievementIndex].recordValue + 1).toString())
        : currentAchievementTemplate.condition;

    let maxValue;
    let currentValue;
    if (currentAchievementTemplate.type === achievement_type_enum.STREAK || currentAchievementTemplate.type === achievement_type_enum.TIERED) {
        const dataAggregationKey = Object.keys(currentAchievementTemplate.conditionDataAggregations)[0];
        const evaluationResult = await evaluateAchievement(
            condition,
            currentAchievementTemplate.conditionDataAggregations as ConditionDataAggregations,
            currentAchievementTemplate.metrics,
            userAchievements[currentAchievementIndex].recordValue
        );
        currentValue = evaluationResult.resultObject[dataAggregationKey];
        maxValue =
            currentAchievementTemplate.type === achievement_type_enum.STREAK
                ? userAchievements[currentAchievementIndex].recordValue
                : currentAchievementTemplate.conditionDataAggregations[dataAggregationKey].valueToAchieve || 0;
    } else {
        currentValue = currentAchievementIndex + 1;
        maxValue = userAchievements.length - 1;
    }

    return {
        id: userAchievements[currentAchievementIndex].id,
        name: currentAchievementTemplate.name,
        subtitle: currentAchievementTemplate.subtitle,
        description: currentAchievementTemplate.description,
        image: currentAchievementTemplate.image,
        alternativeText: 'alternativeText',
        actionType: currentAchievementTemplate.actionType as achievement_action_type_enum,
        achievementType: currentAchievementTemplate.type as achievement_type_enum,
        achievementState: state,
        steps: currentAchievementTemplate.stepName
            ? userAchievements.map((achievement, index) => {
                  // if a achievementTemplate has a stepName, it means that it must have multiple steps as well as being a sequential achievement
                  // for every achievement in the sortedGroupAchievements, we create a step object with the stepName (descirption) and isActive property for the achievement step currently active but unachieved
                  return {
                      name: achievement.template.stepName,
                      isActive: index === currentAchievementIndex,
                  };
              })
            : null,
        maxSteps: maxValue,
        currentStep: currentValue,
        isNewAchievement: isNewAchievement,
        progressDescription: `Noch ${userAchievements.length - userAchievements.length} Schritte bis zum Abschluss`,
        actionName: userAchievements[currentAchievementIndex].template.actionName,
        actionRedirectLink: userAchievements[currentAchievementIndex].template.actionRedirectLink,
    };
};

export { getUserAchievements };
