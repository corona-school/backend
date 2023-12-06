import { ActionID } from '../notification/types';
import { metricsByAction } from './metrics';
import { Metric, AchievementContextType, RelationTypes } from './types';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';

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
    const [type, id] = getRelationTypeAndId(relation);
    const achievementContext: AchievementContextType = {
        type: type,
        match:
            type === 'match'
                ? await prisma.match.findFirst({ where: { id: id }, select: { id: true, lecture: { select: { start: true, duration: true } } } })
                : null,
        subcourse:
            type === 'subcourse'
                ? await prisma.subcourse.findFirst({ where: { id: id }, select: { id: true, lecture: { select: { start: true, duration: true } } } })
                : null,
    };
    return achievementContext;
}
