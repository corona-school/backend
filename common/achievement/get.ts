import { prisma } from '../prisma';
import { Achievement_template, User_achievement, achievement_action_type_enum, achievement_type_enum } from '../../graphql/generated';
import { Step, Achievement, achievement_state } from '../../graphql/types/achievement';
import { User } from '../user';
import { renderTemplate } from '../../utils/helpers';
import { Context } from '../notification/types';
import { AchievementContextType } from './types';
import { getAchievementContext, getAchievementState, getCurrentAchievementContext, transformPrismaJson } from './helper';

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
        const groupAchievement: Achievement = await assembleAchievementData(sortedGroupAchievements, user);
        achievements.push(groupAchievement);
    }
    return achievements;
};

const assembleAchievementData = async (userAchievements: User_achievement[], user: User): Promise<Achievement> => {
    let currentAchievementIndex = userAchievements.findIndex((ua) => !ua.achievedAt);
    currentAchievementIndex = currentAchievementIndex >= 0 ? currentAchievementIndex : userAchievements.length - 1;

    const userAchievementContext = transformPrismaJson(userAchievements[currentAchievementIndex].context);
    const achievementContext = await getAchievementContext(user, userAchievementContext);
    const currentAchievementTemplate = getCurrentAchievementContext(userAchievements[currentAchievementIndex], achievementContext);

    const resultIndex = currentAchievementIndex < 0 ? null : currentAchievementIndex;
    const state: achievement_state = getAchievementState(userAchievements, currentAchievementIndex);

    const newAchievement = state === achievement_state.COMPLETED && !userAchievements[resultIndex].isSeen;

    return {
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
                      description: achievement.template.stepName,
                      isActive: index === resultIndex,
                  };
              })
            : null,
        maxSteps: userAchievements.length,
        currentStep: currentAchievementIndex,
        newAchievement: newAchievement,
        progressDescription: `Noch ${userAchievements.length - userAchievements.length} Schritte bis zum Abschluss`,
        actionName: userAchievements[userAchievements.length - 1].template.actionName,
        actionRedirectLink: userAchievements[userAchievements.length - 1].template.actionRedirectLink,
    };
};

export { getUserAchievements };
