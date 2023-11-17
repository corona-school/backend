import { prisma } from '../prisma';
import { Achievement_template, User_achievement, achievement_action_type_enum, achievement_type_enum } from '../../graphql/generated';
import { Step, Achievement, achievement_state } from '../../graphql/types/achievement';

const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
    const userAchievements = await prisma.user_achievement.findMany({
        where: { userId: userId },
    });
    const userAchievementGroups: { [group: string]: User_achievement[] } = {};
    userAchievements.forEach((ua) => {
        if (!userAchievementGroups[ua.group]) {
            userAchievementGroups[ua.group] = [];
        }
        userAchievementGroups[ua.group].push(ua);
    });
    const templates = await prisma.achievement_template.findMany({
        where: { group: { in: userAchievements.map((ua) => ua.group) } },
    });
    const achievementTemplates: { [group: string]: Achievement_template[] } = {};
    templates.forEach((template) => {
        if (!achievementTemplates[template.group]) {
            achievementTemplates[template.group] = [];
        }
        achievementTemplates[template.group].push(template);
    });
    const achievements: Achievement[] = [];
    for (const group in achievementTemplates) {
        const sortedGroupAchievements = achievementTemplates[group].sort((a, b) => a.groupOrder - b.groupOrder);
        const state: achievement_state =
            userAchievementGroups[group].length === 0
                ? achievement_state.INACTIVE
                : userAchievementGroups[group].length === achievementTemplates[group].length
                ? achievement_state.COMPLETED
                : achievement_state.ACTIVE;
        const newAchievement =
            userAchievementGroups[group].length === sortedGroupAchievements.length &&
            !userAchievementGroups[group][userAchievementGroups[group].length - 1].isSeen;

        const steps: Step[] = sortedGroupAchievements.map((achievement, index) => {
            if (!achievement.stepName) {
                return null;
            }
            const step: Step = {
                description: achievement.stepName,
                isActive: index === userAchievementGroups[group].length - 1,
            };
            return step;
        });
        const groupAchievement: Achievement = {
            name: sortedGroupAchievements[0].name,
            subtitle: sortedGroupAchievements[0].subtitle,
            description: sortedGroupAchievements[0].description,
            image: sortedGroupAchievements[sortedGroupAchievements.length - 1].image,
            alternativeText: 'alternativeText',
            actionType: sortedGroupAchievements[0].actionType as achievement_action_type_enum,
            achievementType: sortedGroupAchievements[0].type as achievement_type_enum,
            achievementState: state,
            steps: sortedGroupAchievements[0].stepName ? steps : undefined,
            maxSteps: sortedGroupAchievements.length,
            currentStep: userAchievementGroups[group].length,
            newAchievement: newAchievement,
            progressDescription: `Noch ${sortedGroupAchievements.length - userAchievementGroups[group].length} Schritte bis zum Abschluss`,
            actionName: sortedGroupAchievements[userAchievementGroups[group].length - 1].actionName,
            actionRedirectLink: sortedGroupAchievements[userAchievementGroups[group].length - 1].actionRedirectLink,
        };
        achievements.push(groupAchievement);
    }
    return achievements;
};

export { getUserAchievements };
