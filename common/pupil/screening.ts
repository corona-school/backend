import { pupil as Pupil, pupil_screening_status_enum as PupilScreeningStatus, screener as Screener } from '@prisma/client';
import { prisma } from '../prisma';
import { getLogger } from '../logger/logger';
import * as Notification from '../notification';
import { PrerequisiteError, RedundantError } from '../util/error';
import { NotFoundError } from '@prisma/client/runtime';
import { userForPupil } from '../user';
import { invalidateSessionsOfUser } from '../user/session';

const logger = getLogger('Pupil Screening');
interface PupilScreeningInput {
    status?: PupilScreeningStatus;
    comment?: string;
    invalidated?: boolean;
}

export async function addPupilScreening(pupil: Pupil, screening: PupilScreeningInput = {}) {
    if (await prisma.pupil_screening.count({ where: { pupilId: pupil.id, invalidated: false } })) {
        throw new RedundantError(`There already is a valid pupil screening for pupil ${pupil.id}`);
    }
    if (!pupil.isPupil) {
        throw new PrerequisiteError(`Pupil ${pupil.id} has isPupil = false`);
    }
    if (!pupil.verifiedAt && pupil.verification) {
        throw new PrerequisiteError(`Pupil ${pupil.id} does not have a verified email`);
    }

    await prisma.pupil_screening.create({ data: { ...screening, pupilId: pupil.id } });
    await Notification.actionTaken(userForPupil(pupil), 'pupil_screening_add', {});

    logger.info(`Added ${screening.status || 'pending'} screening for pupil ${pupil.id}`, screening);
}

interface PupilScreeningUpdate {
    status?: PupilScreeningStatus;
    comment?: string;
}

export async function updatePupilScreening(screener: Screener, pupilScreeningId: number, screeningUpdate: PupilScreeningUpdate) {
    const screening = await prisma.pupil_screening.findFirst({ where: { id: pupilScreeningId }, include: { pupil: {} } });
    if (screening === null) {
        logger.error('cannot find PupilScreening', new Error('cannot find PupilScreening'), { pupilScreeningId });
        throw new NotFoundError('pupil screening not found');
    }

    await prisma.pupil_screening.update({ where: { id: pupilScreeningId }, data: { ...screeningUpdate, updatedAt: new Date() } });
    logger.debug(`successfully updated PupilScreening(${pupilScreeningId})`, { pupilScreeningId, screeningUpdate });

    if (!screening.screenerIds.includes(screener.id)) {
        await prisma.pupil_screening.update({ where: { id: pupilScreeningId }, data: { screenerIds: { push: screener.id } } });
    }

    // We only want to send notifications when the status got updated.
    // Otherwise, we might spam the user while updating the comment.
    if (screening.status && screening.status === screeningUpdate.status) {
        return;
    }

    switch (screeningUpdate.status) {
        case PupilScreeningStatus.rejection:
            await Notification.actionTaken(userForPupil(screening.pupil), 'pupil_screening_rejected', {});
            break;
        case PupilScreeningStatus.success:
            const asUser = userForPupil(screening.pupil);
            await Notification.actionTaken(asUser, 'pupil_screening_succeeded', {});
            invalidateSessionsOfUser(asUser.userID);
            break;

        case PupilScreeningStatus.dispute:
            await Notification.actionTaken(userForPupil(screening.pupil), 'pupil_screening_dispute', {});
            break;

        case PupilScreeningStatus.pending:
            break;
    }
}

export async function invalidatePupilScreening(screeningId: number) {
    const screening = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: screeningId }, include: { pupil: true } });

    if (screening.invalidated) {
        throw new RedundantError(`Pupil screening ${screeningId} is already invalidated`);
    }

    await prisma.pupil_screening.update({ where: { id: screeningId }, data: { invalidated: true } });
    await Notification.actionTaken(userForPupil(screening.pupil), 'pupil_screening_invalidated', {});

    logger.info(`Invalidated PupilScreening (${screeningId}) for Pupil (${screening.pupilId})`);
}

// Use this whenever you want to invalidate a pupil's screenings. A pupil should only have one valid screening at most; but we go sure that all are invalidated.
export async function invalidateAllScreeningsOfPupil(pupilId: number) {
    const { count } = await prisma.pupil_screening.updateMany({ where: { pupilId, invalidated: false }, data: { invalidated: true } });
    logger.info(`Invalidated ${count} pupil screening(s) for Pupil (${pupilId})`);
}
