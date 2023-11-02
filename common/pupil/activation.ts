import { dissolve_reason, pupil as Pupil } from '@prisma/client';
import { prisma } from '../prisma';
import { dissolveMatch } from '../match/dissolve';
import { RedundantError } from '../util/error';
import * as Notification from '../notification';
import { logTransaction } from '../transactionlog/log';
import { userForPupil } from '../user';
import { dissolved_by_enum } from '../../graphql/generated';

export async function activatePupil(pupil: Pupil) {
    if (pupil.active) {
        throw new RedundantError('Pupil was already activated');
    }

    const updatedPupil = await prisma.pupil.update({
        data: { active: true },
        where: { id: pupil.id },
    });

    await logTransaction('deActivate', pupil, { newStatus: true });

    return updatedPupil;
}

export async function deactivatePupil(pupil: Pupil, reason?: string) {
    if (!pupil.active) {
        throw new RedundantError('Pupil was already deactivated');
    }

    await Notification.actionTaken(userForPupil(pupil), 'pupil_account_deactivated', {});
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
        await dissolveMatch(match, dissolve_reason.accountDeactivated, pupil, dissolved_by_enum.pupil);
    }

    const updatedPupil = await prisma.pupil.update({
        data: { active: false },
        where: { id: pupil.id },
    });

    await logTransaction('deActivate', pupil, { newStatus: false, deactivationReason: reason });

    return updatedPupil;
}
