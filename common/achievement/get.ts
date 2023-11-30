import { prisma } from '../prisma';
import { Achievement_template, User_achievement, achievement_action_type_enum, achievement_type_enum } from '../../graphql/generated';
import { Step, Achievement, achievement_state } from '../../graphql/types/achievement';
import { User } from '../user';
import { renderTemplate } from '../../utils/helpers';
import { Context } from '../notification/types';

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
    const achievements: Achievement[] = await createFrontendAchievements(userAchievementGroups, user);
    return achievements;
};

const createFrontendAchievements = async (groups: { [group: string]: User_achievement[] }, user: User): Promise<Achievement[]> => {
    const achievements: Achievement[] = [];
    for (const group in groups) {
        const sortedGroupAchievements = groups[group].sort((a, b) => a.groupOrder - b.groupOrder);
        const groupAchievement: Achievement = await putTogetherAchievement(sortedGroupAchievements, user);
        achievements.push(groupAchievement);
    }
    return achievements;
};

const putTogetherAchievement = async (userAchievements: User_achievement[], user: User): Promise<Achievement> => {
    let currentAchievementIndex = userAchievements.findIndex((ua) => !ua.achievedAt);
    currentAchievementIndex = currentAchievementIndex >= 0 ? currentAchievementIndex : userAchievements.length - 1;
    const contextKeys = Object.keys(userAchievements[currentAchievementIndex].context);
    const achievementContext: Partial<Context> = {
        user: { ...user, fullName: `${user.firstname} ${user.lastname}` },
    };
    const newContextValue = await Promise.all(
        contextKeys.map(async (key) => {
            const [type, id] = userAchievements[currentAchievementIndex].context[key].split('/');
            const newContextValue = await prisma[type].findUnique({
                where: { id: Number(id) },
            });
            return { key: type, value: newContextValue };
        })
    );
    newContextValue.forEach((context) => {
        achievementContext[context.key] = context.value;
    });
    const currentAchievementTemplate = userAchievements[currentAchievementIndex].template as Achievement_template;
    const templateKeys = Object.keys(userAchievements[currentAchievementIndex].template);
    templateKeys.forEach((key) => {
        const updatedElement =
            currentAchievementTemplate[key] && typeof currentAchievementTemplate[key] === 'string'
                ? renderTemplate(currentAchievementTemplate[key], achievementContext)
                : currentAchievementTemplate[key];
        currentAchievementTemplate[key] = updatedElement;
    });
    const resultIndex = currentAchievementIndex < 0 ? null : currentAchievementIndex;
    const state: achievement_state =
        userAchievements.length === 0 ? achievement_state.INACTIVE : typeof resultIndex !== 'number' ? achievement_state.COMPLETED : achievement_state.ACTIVE;
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
        currentStep: userAchievements.length,
        newAchievement: newAchievement,
        progressDescription: `Noch ${userAchievements.length - userAchievements.length} Schritte bis zum Abschluss`,
        actionName: userAchievements[userAchievements.length - 1].template.actionName,
        actionRedirectLink: userAchievements[userAchievements.length - 1].template.actionRedirectLink,
    };
};

export { getUserAchievements };
