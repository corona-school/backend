import 'reflect-metadata';
// ↑ Needed by typegraphql: https://typegraphql.com/docs/installation.html
import { join } from 'path';
import { prisma } from '../prisma';
import { Prisma, achievement_template, achievement_template_for_enum, user_achievement } from '@prisma/client';
import { accessURLForKey } from '../file-bucket';
import { User, getUserTypeAndIdForUserId } from '../user';
import { renderTemplate } from '../../utils/helpers';
import { getLogger } from '../logger/logger';
import { BucketContextType, AchievementState, BucketEvents, TemplateContextType } from './types';
import { SpecificNotificationContext, ActionID } from '../notification/actions';
import { getCourseImageURL } from '../courses/util';
import { EventRelationType, parseRelation } from './relation';

const logger = getLogger('Achievement');

export const ACHIEVEMENT_IMAGE_DEFAULT_PATH = 'gamification/achievements';

export function getAchievementImageKey(imageKey: string) {
    return join(ACHIEVEMENT_IMAGE_DEFAULT_PATH, `${imageKey}`);
}

export async function getAchievementImageURL(template: achievement_template, state?: AchievementState, relation?: string) {
    const { image, achievedImage } = template;
    if (relation) {
        const subcourseId = relation.split('/')[1];
        if (subcourseId && template.templateFor === achievement_template_for_enum.Course) {
            const subcourse = await prisma.subcourse.findUnique({ where: { id: Number(subcourseId) }, select: { course: true } });
            if (subcourse) {
                return getCourseImageURL(subcourse.course).url;
            }
        }
    }
    if (state === AchievementState.COMPLETED && achievedImage) {
        return accessURLForKey(achievedImage);
    }
    return accessURLForKey(image);
}

type WhereInput = Prisma.matchWhereInput | Prisma.subcourseWhereInput;

export async function getBucketContext(userID: string, relation?: string): Promise<BucketContextType> {
    const [userType, id] = getUserTypeAndIdForUserId(userID);

    const whereClause: WhereInput = {};

    let relationType: EventRelationType | null = null;
    if (relation) {
        const [relationTypeTmp, relationId] = parseRelation(relation);
        relationType = relationTypeTmp;

        if (relationId) {
            whereClause['id'] = Number(relationId);
        }
    }

    logger.info('evaluate bucket configuration', { userType, relation, relationType, whereClause });

    let matches: any[] = [];
    if (relation?.includes('match') || !relation) {
        matches = await prisma.match.findMany({
            where: { ...whereClause, [`${userType}Id`]: id },
            select: {
                id: true,
                lecture: {
                    where: { NOT: { declinedBy: { hasSome: [`${userType}/${id}`] } } },
                    select: { id: true, start: true, duration: true },
                },
            },
        });
    }

    let subcourses: any[] = [];
    if (relation?.includes('subcourse') || !relation) {
        const userClause =
            userType === 'student'
                ? { subcourse_instructors_student: { some: { studentId: id } } }
                : { subcourse_participants_pupil: { some: { pupilId: id } } };
        const subcourseWhere = { ...whereClause, ...userClause };
        subcourses = await prisma.subcourse.findMany({
            where: subcourseWhere,
            select: {
                id: true,
                lecture: {
                    where: { NOT: { declinedBy: { hasSome: [`${userType}/${id}`] } } },
                    select: { id: true, start: true, duration: true },
                },
            },
        });
    }

    // for global relations we get all matches/subcourses of a user by his own id, whereas for specific relations we get the match/subcourse by its relationId
    const bucketContext: BucketContextType = {
        match: matches.map((match) => ({
            id: match.id,
            relation: `match/${match.id}`,
            lecture: match.lecture,
        })),
        subcourse: subcourses.map((subcourse) => ({
            id: subcourse.id,
            relation: `subcourse/${subcourse.id}`,
            lecture: subcourse.lecture,
        })),
    };
    return bucketContext;
}

export function removeBucketsBefore(ts: Date, bucketEvents: BucketEvents[], keepBucketsWithEvents: boolean): BucketEvents[] {
    return bucketEvents.filter((bucket) => {
        if (bucket.kind !== 'time') {
            return true;
        }
        if (keepBucketsWithEvents && bucket.events.length > 0) {
            return true;
        }
        return bucket.startTime >= ts;
    });
}

// Filter out time bucketEvents that are in the future and dont contain events.
// This is done to avoid taking future lectures into account during the evaluation of achievements.
// If a lecture was joined early, it will be added to the filteredBuckets array by this function for containing events.
export function removeBucketsAfter(ts: Date, bucketEvents: BucketEvents[], keepBucketsWithEvents: boolean): BucketEvents[] {
    return bucketEvents.filter((bucket) => {
        if (bucket.kind !== 'time') {
            return true;
        }
        if (keepBucketsWithEvents && bucket.events.length > 0) {
            return true;
        }
        return bucket.endTime <= ts;
    });
}

export function transformPrismaJson(user: User, relation: string | null, json: Prisma.JsonObject): TemplateContextType {
    const transformedJson: TemplateContextType = { user: user };
    if (relation) {
        const [relationType, relationId] = parseRelation(relation);
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
    achievementContext: TemplateContextType,
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
        ? AchievementState.INACTIVE
        : userAchievements[currentAchievementIndex].achievedAt
        ? AchievementState.COMPLETED
        : AchievementState.ACTIVE;
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
