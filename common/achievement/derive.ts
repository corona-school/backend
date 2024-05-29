import {
    pupil as Pupil,
    achievement_action_type_enum as AchievementActionType,
    achievement_template_for_enum as AchievementTemplateFor,
    achievement_type_enum as AchievementType,
    achievement_template,
    pupil_screening_status_enum,
} from '@prisma/client';
import { User, getPupil, getStudent } from '../user';
// TODO: Fix import when other PR is in
import { prisma } from '../prisma';
import { achievement_with_template } from './types';
import { getAchievementTemplates, TemplateSelectEnum } from './template';

const GhostAchievements: { [key: string]: achievement_template } = {
    pupil_new_match_1: {
        id: -1,
        templateFor: AchievementTemplateFor.Match,
        group: 'pupil_new_match',
        groupOrder: 1,
        type: AchievementType.SEQUENTIAL,
        image: 'gamification/achievements/release/finish_onboarding/two_pieces/step_1.png',
        tagline: 'Starte eine Lernpatenschaft',
        title: 'Neue Lernunterstützung',
        subtitle: null,
        description:
            'Es war großartig, dich am {{date}} besser kennenzulernen und freuen uns, dass du gemeinsam mit uns die Bildungschancen von Schüler:innen verbessern möchtest. Um dir eine:n passende:n Lernpartner:in zuzuweisen, bitten wir dich zunächst, eine Anfrage auf unserer Plattform zu stellen. Hier kannst du die Fächer und Jahrgangsstufe angeben, die für dich passend sind. Wir freuen uns auf den Start!',
        footer: null,
        actionName: 'Anfrage stellen',
        actionRedirectLink: '/matching',
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
        group: 'pupil_new_match',
        groupOrder: 2,
        type: AchievementType.SEQUENTIAL,
        image: 'gamification/achievements/release/finish_onboarding/two_pieces/step_2.png',
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

        // await derivePupilOnboarding(pupil, result);
        await derivePupilMatching(user, pupil, result, realAchievements);
    }

    if (user.studentId) {
        const student = await getStudent(user);

        // await deriveStudentOnboarding(student, result);
        // await deriveStudentMatching(student, result);
        // ...
    }

    return result;
}

export function deriveAchievementTemplates(group: string): achievement_template[] {
    return Object.values(GhostAchievements).filter((row) => row.group === group);
}

async function derivePupilMatching(user: User, pupil: Pupil, result: achievement_with_template[], userAchievements: achievement_with_template[]) {
    const hasRequest = pupil.openMatchRequestCount > 0;
    // const hasOpenScreening = (await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'pending', invalidated: false } })) > 0;
    const hasSuccessfulScreening = await prisma.pupil_screening.count({
        where: { pupilId: pupil.id, status: pupil_screening_status_enum.success, invalidated: false },
    });

    const userAchievement = userAchievements.find((row) => row.template.group === 'pupil_new_match');
    if (!userAchievement) {
        const groups = await getAchievementTemplates(TemplateSelectEnum.BY_GROUP);
        if (!groups.has('pupil_new_match') || groups.get('pupil_new_match').length === 0) {
            throw new Error('group template not found!');
        }
        // If there is no real achievement yet, we have to fake the first one in the row as well
        result.push({
            id: -1,
            templateId: -1,
            userId: user.userID,
            isSeen: true,
            template: groups.get('pupil_new_match')[0],
            context: {},
            recordValue: null,
            achievedAt: null,
            relation: null,
        });
    }

    result.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: GhostAchievements.pupil_new_match_1,
        context: {},
        recordValue: null,
        achievedAt: hasRequest || userAchievement ? new Date() : null,
        // achievedAt: new Date(),
        relation: userAchievement?.relation ?? null,
    });

    result.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: GhostAchievements.pupil_new_match_2,
        context: {},
        recordValue: null,
        achievedAt: hasSuccessfulScreening || userAchievement ? new Date() : null,
        relation: userAchievement?.relation ?? null,
    });
}
