import {
    pupil as Pupil,
    achievement_action_type_enum as AchievementActionType,
    achievement_template_for_enum as AchievementTemplateFor,
    achievement_type_enum as AchievementType,
} from '@prisma/client';
import { User, getPupil, getStudent, userForPupil } from '../user';
// TODO: Fix import when other PR is in
import { prisma } from '../prisma';
import { achievement_with_template } from './types';

interface ImportantInformation {
    title: string;
    description: string;
    navigateTo: string;
}

interface DerivedInfo {
    importantInformations: ImportantInformation[];
    achievements: achievement_with_template[];
}

// Large parts of our user communication are event based, i.e. users get a notification for an appointment,
// or receive an achievement after taking some action
//
// Sometimes we however want to communicate what users "can do" or "should do next" - This is usually easier to
// derive from the state in the database than to somehow represent this as complex event based state machines
// Depending on whether it is a "standalone step" or part of a "sequence of steps" we communicate these as important
// notifications or as "derived achievements" - unlike other achievements these are not tracked in the database but can be
// derived from the rest of the database on demand
export async function deriveAchievements(user: User): Promise<DerivedInfo> {
    const result: DerivedInfo = { importantInformations: [], achievements: [] };

    if (user.pupilId) {
        const pupil = await getPupil(user);

        // await derivePupilOnboarding(pupil, result);
        await derivePupilMatching(user, pupil, result);
    }

    if (user.studentId) {
        const student = await getStudent(user);

        // await deriveStudentOnboarding(student, result);
        // await deriveStudentMatching(student, result);
        // ...
    }

    return result;
}

async function derivePupilMatching(user: User, pupil: Pupil, result: DerivedInfo) {
    const hasRequest = pupil.openMatchRequestCount > 0;
    // const hasOpenScreening = (await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'pending', invalidated: false } })) > 0;
    const hasSuccessfulScreening = await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'success', invalidated: false } });

    // 1) Pupil has to be sucessfully screened
    // 2) Check if they've created a new request

    // TODO: check if necessary
    if (!hasSuccessfulScreening) return;

    result.achievements.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: {
            id: -1,
            templateFor: AchievementTemplateFor.Match,
            group: 'pupil_new_match',
            groupOrder: 1,
            type: AchievementType.SEQUENTIAL,
            image: '',
            tagline: 'Starte eine Lernpatenschaft',
            title: 'Neue Lernunterstützung',
            subtitle: null,
            description:
                'Es war großartig, dich am {{date}} besser kennenzulernen und freuen uns, dass du gemeinsam mit uns die Bildungschancen von Schüler:innen verbessern möchtest. Um dir eine:n passende:n Lernpartner:in zuzuweisen, bitten wir dich zunächst, eine Anfrage auf unserer Plattform zu stellen. Hier kannst du die Fächer und Jahrgangsstufe angeben, die für dich passend sind. Wir freuen uns auf den Start!',
            footer: '',
            actionName: 'Anfrage stellen',
            actionRedirectLink: null,
            actionType: AchievementActionType.Action,
            condition: 'false', // This will ensure that an evaluation will always fail
            conditionDataAggregations: {},
            isActive: true,
            achievedDescription: null,
            achievedFooter: null,
            achievedImage: null,
            sequentialStepName: null,
        },
        context: {},
        recordValue: null,
        achievedAt: hasRequest ? new Date() : null,
        relation: '',
    });

    result.achievements.push({
        id: -1,
        templateId: -1,
        userId: user.userID,
        isSeen: true,
        template: {
            id: -1,
            templateFor: AchievementTemplateFor.Course,
            group: 'pupil_new_match',
            groupOrder: 1,
            type: AchievementType.SEQUENTIAL,
            image: '',
            tagline: null,
            title: '',
            subtitle: null,
            description: '',
            footer: '',
            actionName: null,
            actionRedirectLink: null,
            actionType: AchievementActionType.Action,
            condition: '',
            conditionDataAggregations: {},
            isActive: true,
            achievedDescription: null,
            achievedFooter: null,
            achievedImage: null,
            sequentialStepName: null,
        },
        context: {},
        recordValue: null,
        achievedAt: new Date(),
        relation: '',
    });
    result.achievements.push({
        subtitle: 'Warten auf Match',
        steps: [{ name: 'Screening absolviert' }, { name: 'Warte auf Match' }],
        // ...
    } as any);
}
