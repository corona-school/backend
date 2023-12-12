import { ActionID } from '../notification/types';
import { metricsByAction } from './metrics';
import { Metric, AchievementContextType, RelationTypes } from './types';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import { Prisma } from '@prisma/client';
import { achievement_state } from '../../graphql/types/achievement';
import { User } from '../user';
import { Achievement_template, User_achievement } from '../../graphql/generated';
import { renderTemplate } from '../../utils/helpers';

const logger = getLogger('Gamification');
export function isGamificationFeatureActive(): boolean {
    const isActive: boolean = JSON.parse(process.env.GAMIFICATION_ACTIVE || 'false');

    if (!isActive) {
        logger.warn('Gamification is deactivated');
    }

    return isActive;
}

export function getMetricsByAction<ID extends ActionID>(actionId: ID): Metric[] {
    return metricsByAction.get(actionId) || [];
}

export function getRelationTypeAndId(relation: string): [type: RelationTypes, id: number] {
    const validRelationTypes = ['match', 'subcourse'];
    const [relationType, relationId] = relation.split('/');
    if (!validRelationTypes.includes(relationType)) {
        throw Error('No valid relation found in relation: ' + relationType);
    }

    const parsedRelationId = parseInt(relationId, 10);
    return [relationType as RelationTypes, parsedRelationId];
}

export async function getBucketContext(relation: string): Promise<AchievementContextType> {
    // UserID
    const [type, id] = getRelationTypeAndId(relation);
    const achievementContext: AchievementContextType = {
        type: type,
        match:
            type === 'match'
                ? await prisma.match.findFirst({ where: { id }, select: { id: true, lecture: { select: { start: true, duration: true } } } })
                : null,
        subcourse:
            type === 'subcourse'
                ? await prisma.subcourse.findFirst({ where: { id }, select: { id: true, lecture: { select: { start: true, duration: true } } } })
                : null,
    };
    return achievementContext;
}

export function transformPrismaJson(user: User, json: Prisma.JsonValue): AchievementContextType | null {
    if (!json['match'] && !json['subcourse']) {
        return null;
    }
    const transformedJson: AchievementContextType = {
        type: json['match'] ? 'match' : 'subcourse',
        user: user,
        match: json['match'] ? json['match'] : undefined,
        subcourse: json['subcourse'] ? json['subcourse'] : undefined,
    };
    return transformedJson;
}

export function getCurrentAchievementTemplateWithContext(userAchievement: User_achievement, achievementContext: AchievementContextType): Achievement_template {
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
