import { ActionID, SpecificNotificationContext } from '../notification/actions';
import { NotificationContext } from '../notification/types';
import { prisma } from '../prisma';
import { achievementsByGroup, getTemplatesByAction } from './template';

async function doesUserAchievementAlreadyExist(templateId: number): Promise<boolean> {
    const userAchievement = await prisma.user_achievement.findFirstOrThrow({ where: { templateId } });
    if (!userAchievement) {
        return false;
    }
    return true;
}

async function createUserAchievement<ID extends ActionID>(actionId: ID, userId: string, context: SpecificNotificationContext<ID>) {
    const templatesForAction = await getTemplatesByAction(actionId);

    for (const template of templatesForAction) {
        const achievementExistForUser = await doesUserAchievementAlreadyExist(template.id);

        if (!achievementExistForUser) {
            const groupAchievements = achievementsByGroup.get(template.group);
            if (template.type === 'SEQUENTIAL') {
                const userAchievements = await prisma.user_achievement.findFirstOrThrow({ where: { template: { group: template.group } } });

                // TODO - create next step
            }
            await prisma.user_achievement.create({
                data: {
                    templateId: template.id,
                    userId,
                    group: template.group,
                    groupOrder: template.groupOrder,
                    context,
                },
            });
            // TODO - add handlebars for templating texts
        }
    }
}

export { createUserAchievement };
