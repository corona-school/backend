import {
    pupil as Pupil,
    student as Student,
    achievement_action_type_enum as AchievementActionType,
    achievement_template_for_enum as AchievementTemplateFor,
    achievement_type_enum as AchievementType,
    achievement_template,
    pupil_screening_status_enum,
    Prisma,
} from '@prisma/client';
import { User, getPupil, getStudent } from '../user';
import { prisma } from '../prisma';
import { achievement_with_template } from './types';
import { getAchievementTemplates, TemplateSelectEnum } from './template';
import { createRelation, EventRelationType } from './relation';

const PupilNewMatchGroup = 'pupil_new_match';
const PupilNewMatchGroupOrder = 3;
const StudentNewMatchGroup = 'student_new_match';
const StudentNewMatchGroupOrder = 3;

const GhostAchievements: { [key: string]: achievement_template } = {
    pupil_new_match_1: {
        id: -1,
        templateFor: AchievementTemplateFor.Match,
        group: PupilNewMatchGroup,
        groupOrder: 1,
        type: AchievementType.SEQUENTIAL,
        image: 'gamification/achievements/release/new_match/five_pieces/empty_state.png',
        tagline: 'Starte eine Lernpatenschaft',
        title: 'Neue Lernunterstützung',
        subtitle: null,
        description:
            'Damit wir dir den:die perfekte:n Lernpartner:in zuweisen können, musst du zunächst eine Anfrage auf unserer Plattform stellen. Dort kannst du ganz einfach die Fächer angeben, die für dich wichtig sind und in denen wir dir helfen können. Wir freuen uns darauf, mit dir gemeinsam durchzustarten und die Lernreise zu beginnen!',
        footer: null,
        actionName: 'Anfrage stellen',
        actionRedirectLink: '/request-match',
        actionType: AchievementActionType.Action,
        condition: 'false', // This will ensure that an evaluation will always fail
        conditionDataAggregations: {},
        isActive: true,
        achievedDescription: null,
        achievedFooter: null,
        achievedImage: null,
        sequentialStepName: 'Anfrage stellen',
    },
    pupil_new_match_2: {
        id: -1,
        templateFor: AchievementTemplateFor.Match,
        group: PupilNewMatchGroup,
        groupOrder: 2,
        type: AchievementType.SEQUENTIAL,
        image: 'gamification/achievements/release/new_match/five_pieces/step_1.png',
        tagline: 'Starte eine Lernpatenschaft',
        title: 'Neue Lernunterstützung',
        subtitle: null,
        description:
            'Fantastisch, deine Anfrage ist eingegangen! Bevor wir dir deine:n ideale:n Lernpartner:in vermitteln können, möchten wir gerne kurz per Zoom mit dir sprechen. Unser Ziel ist es, die perfekte Person für dich zu finden und genau zu verstehen, was du dir wünschst. Buche doch gleich einen Termin für unser Gespräch – wir sind schon ganz gespannt auf dich!',
        footer: null,
        actionName: 'Termin buchen',
        actionRedirectLink: 'https://calendly.com',
        actionType: AchievementActionType.Action,
        condition: 'false',
        conditionDataAggregations: {},
        isActive: true,
        achievedDescription: null,
        achievedFooter: null,
        achievedImage: null,
        sequentialStepName: 'Gespräch mit Lern-Fair absolvieren',
    },
    student_new_match_1: {
        id: -1,
        templateFor: AchievementTemplateFor.Match,
        group: StudentNewMatchGroup,
        groupOrder: 1,
        type: AchievementType.SEQUENTIAL,
        image: 'gamification/achievements/release/new_match/five_pieces/empty_state.png',
        tagline: 'Starte eine Lernpatenschaft',
        title: 'Neue Lernunterstützung',
        subtitle: null,
        description:
            'Es war großartig, dich am {{date}} besser kennenzulernen und freuen uns, dass du gemeinsam mit uns die Bildungschancen von Schüler:innen verbessern möchtest. Um dir eine:n passende:n Lernpartner:in zuzuweisen, bitten wir dich zunächst, eine Anfrage auf unserer Plattform zu stellen. Hier kannst du die Fächer und Jahrgangsstufe angeben, die für dich passend sind. Wir freuen uns auf den Start!',
        footer: null,
        actionName: 'Anfrage stellen',
        actionRedirectLink: '/request-match',
        actionType: AchievementActionType.Action,
        condition: 'false', // This will ensure that an evaluation will always fail
        conditionDataAggregations: {},
        isActive: true,
        achievedDescription: null,
        achievedFooter: null,
        achievedImage: null,
        sequentialStepName: 'Anfrage stellen',
    },
};

// Large parts of our user communication are event based, i.e. users get a notification for an appointment,
// or receive an achievement after taking some action
//
// Sometimes we however want to communicate what users "can do" or "should do next" - This is usually easier to
// derive from the state in the database than to somehow represent this as complex event based state machines
// Depending on whether it is a "standalone step" or part of a "sequence of steps" we communicate these as important
// notifications or as "derived achievements" - unlike other achievements these are not tracked in the database but can be
// derived from the rest of the database on demand
export async function deriveAchievements(user: User, realAchievements: achievement_with_template[]): Promise<achievement_with_template[]> {
    const result: achievement_with_template[] = [];

    if (user.pupilId) {
        const pupil = await getPupil(user);
        await derivePupilMatching(user, pupil, result, realAchievements);
    }

    if (user.studentId) {
        const student = await getStudent(user);
        await deriveStudentMatching(user, student, result, realAchievements);
    }

    return result;
}

export function deriveAchievementTemplates(group: string): achievement_template[] {
    return Object.values(GhostAchievements).filter((row) => row.group === group);
}

async function generatePupilMatching(
    achievement: achievement_with_template | null,
    user: User,
    hasRequest: boolean,
    hasSuccessfulScreening: boolean,
    ctx: PupilNewMatchGhostContext
): Promise<achievement_with_template[]> {
    const result: achievement_with_template[] = [];
    // Generating a ramdom relation to be able to show multiple sequences of this kind in parallel
    const randomRelation = createRelation(EventRelationType.Match, Math.random()) + '-tmp';
    if (!achievement) {
        const groups = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
        if (!groups.has(PupilNewMatchGroup) || groups.get(PupilNewMatchGroup).length === 0) {
            throw new Error('group template not found!');
        }
        // If there is no real achievement yet, we have to fake the first one in the row as well
        result.push({
            id: -1,
            templateId: -1,
            userId: user.userID,
            isSeen: true,
            template: groups.get(PupilNewMatchGroup)[0],
            context: ctx,
            recordValue: null,
            achievedAt: null,
            relation: randomRelation,
        });
    }

    console.log('iso', hasRequest, hasSuccessfulScreening, achievement);

    result.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: GhostAchievements.pupil_new_match_1,
        context: ctx,
        recordValue: null,
        achievedAt: hasRequest || achievement ? new Date() : null,
        relation: achievement?.relation ?? randomRelation,
    });

    result.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: GhostAchievements.pupil_new_match_2,
        context: ctx,
        recordValue: null,
        achievedAt: hasSuccessfulScreening || achievement ? new Date() : null,
        relation: achievement?.relation ?? randomRelation,
    });
    return result;
}

interface PupilNewMatchGhostContext extends Prisma.JsonObject {
    lastScreeningDate: string | null;
}

async function derivePupilMatching(user: User, pupil: Pupil, result: achievement_with_template[], userAchievements: achievement_with_template[]) {
    const hasRequest = pupil.openMatchRequestCount > 0;
    const successfulScreenings = await prisma.pupil_screening.findMany({
        where: { pupilId: pupil.id, status: pupil_screening_status_enum.success, invalidated: false },
        orderBy: { createdAt: 'desc' },
    });
    const hasSuccessfulScreenings = successfulScreenings.length > 0;
    const totalMatchCount = await prisma.match.count({ where: { pupilId: pupil.id } });

    const newMatchAchievements = userAchievements.filter(
        (row) => row.template.group === PupilNewMatchGroup && row.template.groupOrder === PupilNewMatchGroupOrder
    );

    const ctx: PupilNewMatchGhostContext = {
        lastScreeningDate: null,
    };
    if (successfulScreenings.length > 0) {
        ctx.lastScreeningDate = successfulScreenings[0].updatedAt.toISOString();
    }
    // This case happens when the student just registered and had a successful screening
    if (pupil.openMatchRequestCount === 0 && totalMatchCount === 0) {
        const ghosts = await generatePupilMatching(null, user, hasRequest, hasSuccessfulScreenings, ctx);
        result.push(...ghosts);
    }
    for (let i = 0; i < pupil.openMatchRequestCount; i++) {
        const ghosts = await generatePupilMatching(null, user, hasRequest, hasSuccessfulScreenings, ctx);
        result.push(...ghosts);
    }
    for (const userAchievement of newMatchAchievements) {
        const ghosts = await generatePupilMatching(userAchievement, user, hasRequest, hasSuccessfulScreenings, ctx);
        result.push(...ghosts);
    }
}

interface StudentNewMatchGhostContext extends Prisma.JsonObject {
    lastScreeningDate: string | null;
}

async function deriveStudentMatching(user: User, student: Student, result: achievement_with_template[], userAchievements: achievement_with_template[]) {
    const hasRequest = student.openMatchRequestCount > 0;
    const successfulScreenings = await prisma.screening.findMany({
        where: { studentId: student.id, success: true },
        orderBy: { createdAt: 'desc' },
    });
    const totalMatchCount = await prisma.match.count({ where: { studentId: student.id } });

    const newMatchAchievements = userAchievements.filter(
        (row) => row.template.group === StudentNewMatchGroup && row.template.groupOrder === StudentNewMatchGroupOrder
    );

    const ctx: StudentNewMatchGhostContext = {
        lastScreeningDate: null,
    };
    if (successfulScreenings.length > 0) {
        ctx.lastScreeningDate = successfulScreenings[0].updatedAt.toISOString();
    }
    // This case happens when the student just registered and had a successful screening
    if (student.openMatchRequestCount === 0 && totalMatchCount === 0) {
        const ghosts = await generateStudentMatching(null, user, hasRequest, ctx);
        result.push(...ghosts);
    }
    // This will
    for (let i = 0; i < student.openMatchRequestCount; i++) {
        const ghosts = await generateStudentMatching(null, user, hasRequest, ctx);
        result.push(...ghosts);
    }

    for (const userAchievement of newMatchAchievements) {
        const ghosts = await generateStudentMatching(userAchievement, user, hasRequest, ctx);
        result.push(...ghosts);
    }
}

async function generateStudentMatching(
    achievement: achievement_with_template | null,
    user: User,
    hasRequest: boolean,
    ctx: StudentNewMatchGhostContext
): Promise<achievement_with_template[]> {
    const result: achievement_with_template[] = [];
    // Generating a ramdom relation to be able to show multiple sequences of this kind in parallel
    const randomRelation = createRelation(EventRelationType.Match, Math.random()) + '-tmp';
    if (!achievement) {
        const groups = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
        if (!groups.has(StudentNewMatchGroup) || groups.get(StudentNewMatchGroup).length === 0) {
            throw new Error('group template not found!');
        }
        // If there is no real achievement yet, we have to fake the first one in the row as well
        result.push({
            id: -1,
            templateId: -1,
            userId: user.userID,
            isSeen: true,
            template: groups.get(StudentNewMatchGroup)[0],
            context: ctx,
            recordValue: null,
            achievedAt: null,
            relation: randomRelation,
        });
    }

    result.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: GhostAchievements.student_new_match_1,
        context: ctx,
        recordValue: null,
        achievedAt: hasRequest || achievement ? new Date() : null,
        relation: achievement?.relation ?? randomRelation,
    });

    return result;
}
