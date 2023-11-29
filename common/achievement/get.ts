import { prisma } from '../prisma';
import { Achievement_template, User_achievement, achievement_action_type_enum, achievement_type_enum } from '../../graphql/generated';
import { Step, Achievement, achievement_state } from '../../graphql/types/achievement';
import { User } from '../user';

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
    const achievements: Achievement[] = createFrontendAchievements(userAchievementGroups);
    return achievements;
};

const createFrontendAchievements = (groups: { [group: string]: User_achievement[] }): Achievement[] => {
    const achievements: Achievement[] = [];
    for (const group in groups) {
        const sortedGroupAchievements = groups[group].sort((a, b) => a.groupOrder - b.groupOrder);
        const currentAchievementIndex = sortedGroupAchievements.findIndex((ua) => !ua.achievedAt);
        const resultIndex = currentAchievementIndex < 0 ? null : currentAchievementIndex;
        const state: achievement_state =
            sortedGroupAchievements.length === 0
                ? achievement_state.INACTIVE
                : typeof resultIndex !== 'number'
                ? achievement_state.COMPLETED
                : achievement_state.ACTIVE;
        const newAchievement = state === achievement_state.COMPLETED && !sortedGroupAchievements[resultIndex].isSeen;

        const currentAchievementTemplate = sortedGroupAchievements[0].template;
        const groupAchievement: Achievement = {
            name: currentAchievementTemplate.name,
            subtitle: currentAchievementTemplate.subtitle,
            description: currentAchievementTemplate.description,
            image: currentAchievementTemplate.image,
            alternativeText: 'alternativeText',
            actionType: currentAchievementTemplate.actionType as achievement_action_type_enum,
            achievementType: currentAchievementTemplate.type as achievement_type_enum,
            achievementState: state,
            steps: currentAchievementTemplate.stepName
                ? sortedGroupAchievements.map((achievement, index) => {
                      // if a achievementTemplate has a stepName, it means that it must have multiple steps as well as being a sequential achievement
                      // for every achievement in the sortedGroupAchievements, we create a step object with the stepName (descirption) and isActive property for the achievement step currently active but unachieved
                      return {
                          description: achievement.template.stepName,
                          isActive: index === resultIndex,
                      };
                  })
                : null,
            maxSteps: sortedGroupAchievements.length,
            currentStep: sortedGroupAchievements.length,
            newAchievement: newAchievement,
            progressDescription: `Noch ${sortedGroupAchievements.length - sortedGroupAchievements.length} Schritte bis zum Abschluss`,
            actionName: sortedGroupAchievements[sortedGroupAchievements.length - 1].template.actionName,
            actionRedirectLink: sortedGroupAchievements[sortedGroupAchievements.length - 1].template.actionRedirectLink,
        };
        achievements.push(groupAchievement);
    }
    return achievements;
};

export { getUserAchievements };
