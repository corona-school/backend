import { prisma } from '../prisma';
import { ActionID } from '../notification/actions';
import { ActionEvent, AchievementTemplateFor } from './types';

export enum EventRelationType {
    Match = 'match',
    Subcourse = 'subcourse',
    Appointment = 'appointment',
}

export function createRelation(type: EventRelationType, id: number): string {
    return `${type}/${id}`;
}

export function parseRelation(relation: string): [EventRelationType, number] {
    const [type, id] = relation.split('/');
    return [type as EventRelationType, Number(id)];
}

export async function getAchievementRelationFromEvent<ID extends ActionID>(
    event: ActionEvent<ID>,
    templateFor: AchievementTemplateFor
): Promise<string | undefined> {
    // If the template is global, we should use global or no relation fo the achievement
    switch (templateFor) {
        case AchievementTemplateFor.Global_Courses:
            return EventRelationType.Subcourse;
        case AchievementTemplateFor.Global_Matches:
            return EventRelationType.Match;
        case AchievementTemplateFor.Global:
            return undefined;
        default:
    }

    if (!event.context.relation) {
        return undefined;
    }

    const [type, id] = parseRelation(event.context.relation);
    if (type === EventRelationType.Match || type === EventRelationType.Subcourse) {
        return event.context.relation;
    }

    if (type === EventRelationType.Appointment) {
        const appointment = await prisma.lecture.findUnique({ where: { id } });
        if (!appointment) {
            throw new Error(`Appointment with id ${id} not found`);
        }

        if (appointment.subcourseId) {
            return createRelation(EventRelationType.Subcourse, appointment.subcourseId);
        }
        if (appointment.matchId) {
            return createRelation(EventRelationType.Match, appointment.matchId);
        }
    }

    throw new Error(`Invalid relation type: ${type}`);
}
