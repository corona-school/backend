import { ActionID, NotificationContext } from '../notification/types';
import { metricsByAction } from './metrics';
import { Metric } from './types';
import { prisma } from '../prisma';

export function getRelationByContext(context: NotificationContext): string {
    const { appointment, match, subcourse } = context;
    let relation: string;

    switch (context) {
        case context.match:
            relation = `match/${match.id}`;
            break;
        case context.subcourse:
            relation = `subcourse/${subcourse.id}`;
            break;
        default:
            relation = '';
    }

    return relation;
}

export function getMetricsByAction<ID extends ActionID>(actionId: ID): Metric[] {
    return metricsByAction.get(actionId) || [];
}

type RelationTypes = 'match' | 'subcourse';

export function getRelationTypeAndId(relation: string): [relationType: RelationTypes, id: number] {
    const validRelationTypes = ['match', 'subcourse'];
    const [relationType, relationId] = relation.split('/');
    if (!validRelationTypes.includes(relationType)) {
        throw Error('No valid relation found in relation: ' + relationType);
    }

    const parsedRelationId = parseInt(relationId, 10);
    return [relationType as RelationTypes, parsedRelationId];
}

export async function getRelationContext(relation: string) {
    const [type, id] = getRelationTypeAndId(relation);

    if (type == 'match') {
        const match = await prisma.match.findFirst({ where: { id }, select: { id: true, lecture: { select: { start: true, duration: true } } } });
        return match;
    }
    if (type == 'subcourse') {
        const subcourse = await prisma.subcourse.findFirst({ where: { id }, select: { id: true, lecture: { select: { start: true, duration: true } } } });
        return subcourse;
    }

    throw new Error(`Unknown Relation(${relation})`);
}
