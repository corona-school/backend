import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { join } from 'path';
import { prisma } from '../prisma';
import { Prisma, achievement_template, achievement_template_for_enum, achievement_type_enum, user_achievement } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { achievement_state } from '../../graphql/types/achievement';
import { User, getUserTypeAndIdForUserId } from '../user';
import { renderTemplate } from '../../utils/helpers';
import { getLogger } from '../logger/logger';
import { RelationTypes, AchievementContextType, ExtendedAchievementContextType } from './types';
import { SpecificNotificationContext, ActionID } from '../notification/actions';
import { getTemplatesWithRelation } from './template';
import { getCourseImageURL } from '../courses/util';

const logger = getLogger('Achievement');

export const ACHIEVEMENT_IMAGE_DEFAULT_PATH = 'gamification/achievements';

export function getAchievementImageKey(imageKey: string) {
    return join(ACHIEVEMENT_IMAGE_DEFAULT_PATH, `${imageKey}`);
}

export async function getAchievementImageURL(template: achievement_template, state?: achievement_state, relation?: string) {
    const templatesWithCourseRelation = await getTemplatesWithRelation(achievement_template_for_enum.Course);
    const { image, achievedImage } = template;
    if (templatesWithCourseRelation && relation) {
        const subcourseId = relation.split('/')[1];
        if (subcourseId && template.templateFor === achievement_template_for_enum.Course && template.type === achievement_type_enum.TIERED) {
            const subcourse = await prisma.subcourse.findUnique({ where: { id: Number(subcourseId) }, select: { course: true } });
            if (subcourse) {
                return getCourseImageURL(subcourse.course);
            }
        }
    }
    if (state === achievement_state.COMPLETED && achievedImage) {
        return accessURLForKey(achievedImage);
    }
    return accessURLForKey(image);
}

function getRelationTypeAndId(relation: string): [type: RelationTypes, id: string] {
    const validRelationTypes = ['match', 'subcourse', 'global_match', 'global_subcourse'];
    const [relationType, id] = relation.split('/');
    if (!validRelationTypes.includes(relationType)) {
        throw Error('No valid relation found in relation: ' + relationType);
    }
    return [relationType as RelationTypes, id];
}

type WhereInput = Prisma.matchWhereInput | Prisma.subcourseWhereInput;

export async function getBucketContext(userID: string, templateFor: achievement_template_for_enum, relation?: string): Promise<AchievementContextType> {
    const [userType, id] = getUserTypeAndIdForUserId(userID);

    const whereClause: WhereInput = {};

    let relationType: string | null = null;
    if (relation) {
        const [relationTypeTmp, relationId] = getRelationTypeAndId(relation);
        relationType = relationTypeTmp;

        if (relationId) {
            whereClause['id'] = Number(relationId);
        }
    }

    logger.info('evaluate bucket configuration', { userType, relation, relationType, whereClause });

    let matches: any[] = [];
    if (
        templateFor === achievement_template_for_enum.Global_Matches ||
        templateFor === achievement_template_for_enum.Match ||
        templateFor === achievement_template_for_enum.Global
    ) {
        matches = await prisma.match.findMany({
            where: { ...whereClause, [`${userType}Id`]: id },
            select: {
                id: true,
                lecture: { where: { NOT: { declinedBy: { hasSome: [`${userType}/${id}`] } } }, select: { start: true, duration: true } },
            },
        });
    }

    let subcourses: any[] = [];
    if (
        templateFor === achievement_template_for_enum.Global_Courses ||
        templateFor === achievement_template_for_enum.Course ||
        templateFor === achievement_template_for_enum.Global
    ) {
        const userClause =
            userType === 'student'
                ? { subcourse_instructors_student: { some: { studentId: id } } }
                : { subcourse_participants_pupil: { some: { pupilId: id } } };
        const subcourseWhere = { ...whereClause, ...userClause };
        subcourses = await prisma.subcourse.findMany({
            where: subcourseWhere,
            select: {
                id: true,
                lecture: { where: { NOT: { declinedBy: { hasSome: [`${userType}/${id}`] } } }, select: { start: true, duration: true } },
            },
        });
    }

    // for global relations we get all matches/subcourses of a user by his own id, whereas for specific relations we get the match/subcourse by its relationId
    const achievementContext: AchievementContextType = {
        match: matches.map((match) => ({
            id: match.id,
            relation: relationType ? `${relationType}/${match.id}` : undefined,
            lecture: match.lecture,
        })),
        subcourse: subcourses.map((subcourse) => ({
            id: subcourse.id,
            relation: relationType ? `${relationType}/${subcourse.id}` : undefined,
            lecture: subcourse.lecture,
        })),
    };
    return achievementContext;
}

export function transformPrismaJson(user: User, relation: string | null, json: Prisma.JsonObject): ExtendedAchievementContextType {
    const transformedJson: ExtendedAchievementContextType = {
        user: user,
        match: [],
        subcourse: [],
    };
    if (relation) {
        const [relationType, relationId] = getRelationTypeAndId(relation);
        transformedJson[`${relationType}Id`] = relationId;
        transformedJson['relation'] = relation;
    }
    if (!json) {
        return transformedJson;
    }
    const keys = Object.keys(json) || [];
    keys.forEach((key) => {
        transformedJson[key] = json[key];
    });
    return transformedJson;
}

export function renderAchievementWithContext(
    userAchievement: user_achievement & { template: achievement_template },
    achievementContext: AchievementContextType,
    additionalContext?: { [key: string]: string }
): achievement_template {
    const currentAchievementContext = userAchievement.template as any;
    const templateKeys = Object.keys(userAchievement.template);
    templateKeys.forEach((key) => {
        const updatedElement =
            currentAchievementContext[key] && typeof currentAchievementContext[key] === 'string'
                ? renderTemplate(currentAchievementContext[key], { ...achievementContext, ...additionalContext })
                : currentAchievementContext[key];
        currentAchievementContext[key] = updatedElement;
    });
    return currentAchievementContext as achievement_template;
}

export function getAchievementState(userAchievements: user_achievement[], currentAchievementIndex: number) {
    return userAchievements.length === 0
        ? achievement_state.INACTIVE
        : userAchievements[currentAchievementIndex].achievedAt
        ? achievement_state.COMPLETED
        : achievement_state.ACTIVE;
}

export function sortActionTemplatesToGroups(templatesForAction: achievement_template[]) {
    const templatesByGroups: Map<string, achievement_template[]> = new Map();
    for (const template of templatesForAction) {
        if (!templatesByGroups.has(template.group)) {
            templatesByGroups.set(template.group, []);
        }
        templatesByGroups.get(template.group)!.push(template);
    }
    templatesByGroups.forEach((group, key) => {
        group.sort((a, b) => a.groupOrder - b.groupOrder);
        templatesByGroups.set(key, group);
    });
    return templatesByGroups;
}

export function isDefined<T>(argument: T | undefined | null): argument is T {
    return argument !== undefined && argument !== null;
}

export function transformEventContextToUserAchievementContext<T extends ActionID>(ctx: SpecificNotificationContext<T>): object {
    // Copy the context to not mutate the original one.
    const uaCtx = { ...ctx };
    // The relation will be stored directly in the user_achievement table.
    // To make sure we are not misusing the one in the context, we delete it here.
    delete uaCtx.relation;
    return uaCtx;
}

export function checkIfAchievementIsGlobal(template: achievement_template) {
    return (
        template.templateFor === achievement_template_for_enum.Global ||
        template.templateFor === achievement_template_for_enum.Global_Courses ||
        template.templateFor === achievement_template_for_enum.Global_Matches
    );
}
