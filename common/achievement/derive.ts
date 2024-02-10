import { pupil as Pupil } from '@prisma/client';
import { User, getPupil, getStudent } from '../user';
// TODO: Fix import when other PR is in
import { Achievement } from '../../graphql/types/achievement';
import { prisma } from '../prisma';

interface ImportantInformation {
    title: string;
    description: string;
    navigateTo: string;
}

interface DerivedInfo {
    importantInformations: ImportantInformation[];
    achievements: Achievement[];
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
        await derivePupilMatching(pupil, result);
    }

    if (user.studentId) {
        const student = await getStudent(user);

        // await deriveStudentOnboarding(student, result);
        // await deriveStudentMatching(student, result);
        // ...
    }

    return result;
}

async function derivePupilMatching(pupil: Pupil, result: DerivedInfo) {
    const hasRequest = pupil.openMatchRequestCount > 0;
    const hasOpenScreening = (await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'pending', invalidated: false } })) > 0;

    if (!hasRequest && !hasOpenScreening) return;

    if (!hasRequest && hasOpenScreening) {
        result.importantInformations.push({
            title: 'Einladung zum Screening',
            description: '...',
            navigateTo: '/...',
        });
    }

    const hasSuccessfulScreening = await prisma.pupil_screening.count({ where: { pupilId: pupil.id, status: 'success', invalidated: false } });
    if (hasSuccessfulScreening) {
        result.achievements.push({
            subtitle: 'Warten auf Match',
            steps: [{ name: 'Screening absolviert' }, { name: 'Warte auf Match' }],
            // ...
        } as any);
    } else {
        result.achievements.push({
            subtitle: 'Screening absolvieren',
            // ...
        } as any);
    }
}
