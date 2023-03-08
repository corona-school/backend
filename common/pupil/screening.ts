import { pupil as Pupil, pupil_screening_status_enum } from '@prisma/client';
import { prisma } from '../prisma';
import { getLogger } from 'log4js';
import * as Notification from '../notification';
import { PrerequisiteError, RedundantError } from '../util/error';

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

    logger.info(`Pupil (${pupil.id}) was screened`, screening);
}
