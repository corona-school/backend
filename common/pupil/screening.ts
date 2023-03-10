import { getLogger } from 'log4js';
import { prisma } from '../prisma';
import { PrerequisiteError, RedundantError } from '../util/error';
import { pupil as Pupil, pupil_screening_status_enum } from '@prisma/client';
import * as Notification from '../notification';

const logger = getLogger('Pupil Screening');
interface PupilScreeningInput {
    status?: pupil_screening_status_enum;
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
    await Notification.actionTaken(pupil, 'pupil_screening_add', {});

    logger.info(`Added ${screening.status || 'pending'} screening for pupil ${pupil.id}`, screening);
}

export async function invalidatePupilScreening(screeningId: number) {
    const screening = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: screeningId } });

    if (screening.invalidated) {
        throw new RedundantError(`Pupil screening ${screeningId} is already invalidated`);
    }

    await prisma.pupil_screening.update({ where: { id: screeningId }, data: { invalidated: true } });
    logger.info(`Invalidated pupil screening ${screeningId} for pupil ${screening.pupilId}`);
}

// Use this whenever you want to invalidate a pupil's screenings. A pupil should only have one valid screening at most; but we go sure that all are invalidated.
export async function invalidateAllScreeningsOfPupil(pupilId: number) {
    await prisma.pupil_screening.updateMany({ where: { pupilId }, data: { invalidated: true } });
}
