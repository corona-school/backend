import { Prisma } from '@prisma/client';
import { AchievementContextType } from './types';
import { achievement_state } from '../../graphql/types/achievement';
import { Context } from '../notification/types';
import { User } from '../user';
import { prisma } from '../prisma';
import { Achievement_template, User_achievement } from '../../graphql/generated';
import { renderTemplate } from '../../utils/helpers';

export function transformPrismaJson(json: Prisma.JsonValue): AchievementContextType | null {
    if (!json['match'] && !json['subcourse']) {
        return null;
    }
    const transformedJson: AchievementContextType = {
        type: json['match'] ? 'match' : 'subcourse',
        match: json['match'] ? json['match'] : undefined,
        subcourse: json['subcourse'] ? json['subcourse'] : undefined,
    };
    return transformedJson;
}

export async function getAchievementContext(user: User, userAchievementContext: AchievementContextType): Promise<Partial<Context>> {
    const achievementContext: Partial<Context> = {
        user: { ...user, fullName: `${user.firstname} ${user.lastname}` },
    };

    if (userAchievementContext) {
        const contextKeys = Object.keys(userAchievementContext);
        const newContextValue = await Promise.all(
            contextKeys.map(async (key) => {
                const [type, id] = userAchievementContext[key].split('/');
                const newContextValue = await prisma[type].findUnique({
                    where: { id: Number(id) },
                });
                return { key: type, value: newContextValue };
            })
        );
        newContextValue.forEach((context) => {
            achievementContext[context.key] = context.value;
        });
    }

    return achievementContext;
}

export function getCurrentAchievementTemplateWithContext(userAchievement: User_achievement, achievementContext: Partial<Context>): Achievement_template {
    const currentAchievementContext = userAchievement.template as Achievement_template;
    const templateKeys = Object.keys(userAchievement.template);
    templateKeys.forEach((key) => {
        const updatedElement =
            currentAchievementContext[key] && typeof currentAchievementContext[key] === 'string'
                ? renderTemplate(currentAchievementContext[key], achievementContext)
                : currentAchievementContext[key];
        currentAchievementContext[key] = updatedElement;
    });
    return currentAchievementContext;
}

export function getAchievementState(userAchievements: User_achievement[], currentAchievementIndex: number) {
    return userAchievements.length === 0
        ? achievement_state.INACTIVE
        : userAchievements[currentAchievementIndex].achievedAt
        ? achievement_state.COMPLETED
        : achievement_state.ACTIVE;
}

export function sortActionTemplatesToGroups(templatesForAction: Achievement_template[]) {
    const templatesByGroups: Map<string, Achievement_template[]> = new Map();
    for (const template of templatesForAction) {
        if (!templatesByGroups.has(template.group)) {
            templatesByGroups.set(template.group, []);
        }
        templatesByGroups.get(template.group).push(template);
    }
    templatesByGroups.forEach((group, key) => {
        group.sort((a, b) => a.groupOrder - b.groupOrder);
        templatesByGroups.set(key, group);
    });
    return templatesByGroups;
}

// replace recordValue in condition with number of last record
export function injectRecordValue(condition: string, recordValue: number) {
    if (typeof recordValue === 'number') {
        return condition.replace('recordValue', recordValue.toString());
    }
    return condition;
}
