import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { AchievementContextType, RelationTypes } from './types';
import { join } from 'path';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { achievement_state } from '../../graphql/types/achievement';
import { User, getUserTypeAndIdForUserId } from '../user';
import { Achievement_template, User_achievement } from '../../graphql/generated';
import { renderTemplate } from '../../utils/helpers';

export const ACHIEVEMENT_IMAGE_DEFAULT_PATH = 'gamification/achievements';

export function getAchievementImageKey(imageKey: string) {
    return join(ACHIEVEMENT_IMAGE_DEFAULT_PATH, `${imageKey}`);
}

export function getAchievementImageURL(imageKey: string) {
    return accessURLForKey(imageKey);
}

function getRelationTypeAndId(relation: string): [type: RelationTypes, id: string] {
    const validRelationTypes = ['match', 'subcourse', 'global_match', 'global_subcourse'];
    const [relationType, id] = relation.split('/');
    if (!validRelationTypes.includes(relationType)) {
        throw Error('No valid relation found in relation: ' + relationType);
    }
    return [relationType as RelationTypes, id];
}

// TODO: fix naming
export async function getBucketContext(myUserID: string, relation?: string): Promise<AchievementContextType> {
    const [userType, userId] = getUserTypeAndIdForUserId(myUserID);

    const whereClause = {};

    let relationType = null;
    if (relation) {
        const [relationTypeTmp, relationId] = getRelationTypeAndId(relation);
        relationType = relationTypeTmp;

        if (relationId) {
            whereClause['id'] = Number(relationId);
        }
    }

    let matches = [];
    if (!relationType || relationType === 'match') {
        matches = await prisma.match.findMany({
            where: { ...whereClause, [`${userType}Id`]: userId },
            select: {
                id: true,
                lecture: { where: { NOT: { declinedBy: { hasSome: [`${userType}/${userId}`] } } }, select: { start: true, duration: true } },
            },
        });
    }

    let subcourses = [];
    if (!relationType || relationType === 'subcourse') {
        let subcourseWhere = whereClause;
        if (userType === 'student') {
            subcourseWhere = { ...subcourseWhere, subcourse_instructors_student: { some: { studentId: userId } } };
        } else {
            subcourseWhere = { ...subcourseWhere, subcourse_participants_pupil: { some: { pupilId: userId } } };
        }
        subcourses = await prisma.subcourse.findMany({
            where: subcourseWhere,
            select: {
                id: true,
                lecture: { where: { NOT: { declinedBy: { hasSome: [`${userType}/${userId}`] } } }, select: { start: true, duration: true } },
            },
        });
    }

    // for global relations we get all matches/subcourses of a user by his own id, whereas for specific relations we get the match/subcourse by its relationId
    const achievementContext: AchievementContextType = {
        match: matches.map((match) => ({
            id: match.id,
            relation: relationType ? `${relationType}/${match.id}` : null,
            lecture: match.lecture,
        })),
        subcourse: subcourses.map((subcourse) => ({
            id: subcourse.id,
            relation: relationType ? `${relationType}/${subcourse.id}` : null,
            lecture: subcourse.lecture,
        })),
    };
    return achievementContext;
}

export function transformPrismaJson(user: User, json: Prisma.JsonValue): AchievementContextType | null {
    if (!json['match'] && !json['subcourse']) {
        return null;
    }
    const transformedJson: AchievementContextType = {
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
