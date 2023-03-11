import { pupil as Pupil, pupil_screening_status_enum as PupilScreeningStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { getLogger } from 'log4js';
import * as Notification from '../notification';
import { PrerequisiteError, RedundantError } from '../util/error';
import { NotFoundError } from '@prisma/client/runtime';

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
    await Notification.actionTaken(pupil, 'pupil_screening_add', {});

    logger.info(`Added ${screening.status || 'pending'} screening for pupil ${pupil.id}`, screening);
}

interface PupilScreeningUpdate {
    status: PupilScreeningStatus;
    comment: string;
}

export async function updatePupilScreening(pupilScreeningId: number, screeningUpdate: PupilScreeningUpdate) {
    const screening = await prisma.pupil_screening.findFirst({ where: { id: pupilScreeningId } });
    if (screening === null) {
        logger.error('cannot find pupil with', { id: pupilScreeningId });
        throw new NotFoundError('pupil screening not found');
    }

    await prisma.pupil_screening.update({ where: { id: pupilScreeningId }, data: { ...screeningUpdate, updatedAt: new Date() } });
    logger.debug('successfully updated pupil', { pupilScreeningId, screeningUpdate });
}
