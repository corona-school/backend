import { dissolve_reason, pupil as Pupil } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch } from '../match/dissolve';
import { RedundantError } from '../util/error';
import * as Notification from '../notification';
import { logTransaction } from '../transactionlog/log';
import { userForPupil } from '../user';
import { dissolved_by_enum } from '../../graphql/generated';
import { leaveSubcourse } from '../courses/participants';
import { getLogger } from '../logger/logger';
import { removeAllSubcriptions } from '../notification/channels/push';

const logger = getLogger('Pupil Activation');

export async function activatePupil(pupil: Pupil) {
    if (pupil.active) {
        throw new RedundantError('Pupil was already activated');
    }

    const updatedPupil = await prisma.pupil.update({
        data: { active: true },
        where: { id: pupil.id },
    });

    await logTransaction('deActivate', userForPupil(pupil), { newStatus: true });
    logger.info(`Reactivated Pupil(${pupil.id})`);

    return updatedPupil;
}

export async function deactivatePupil(pupil: Pupil, silent = false, reason?: string, byAdmin = false) {
    if (!pupil.active) {
        throw new RedundantError('Pupil was already deactivated');
    }

    if (!silent) {
        const action = byAdmin ? 'pupil_account_deactivated_by_admin' : 'pupil_account_deactivated';
        await Notification.actionTaken(userForPupil(pupil), action, {});
    }

    await Notification.cancelRemindersFor(userForPupil(pupil));
    // Setting 'active' to false will not send out any notifications during deactivation
    pupil.active = false;

    const matches = await prisma.match.findMany({
        where: {
            dissolved: false,
            pupilId: pupil.id,
        },
    });

    for (const match of matches) {
        await dissolveMatch(match, [dissolve_reason.accountDeactivated], pupil, dissolved_by_enum.pupil);
        logger.info(`Match(${match.id}) was dissolved as Pupil(${pupil.id}) was deactivated`);
    }

    const subcoursesParticipating = await prisma.subcourse.findMany({
        where: {
            subcourse_participants_pupil: { some: { pupilId: pupil.id } },
            // Only leave courses that are still ongoing, for older courses it does not matter
            lecture: { some: { start: { gt: new Date() } } },
        },
    });

    for (const subcourse of subcoursesParticipating) {
        await leaveSubcourse(subcourse, pupil);
        logger.info(`Pupil(${pupil.id}) left ongoing Subcourse(${subcourse.id}) as the account was deactivated`);
    }

    await removeAllSubcriptions(userForPupil(pupil));

    const updatedPupil = await prisma.pupil.update({
        data: { active: false },
        where: { id: pupil.id },
    });

    await logTransaction('deActivate', userForPupil(pupil), { newStatus: false, deactivationReason: reason });
    logger.info(`Deactivated Pupil(${pupil.id})`);

    return updatedPupil;
}
