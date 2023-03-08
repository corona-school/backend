import { getLogger } from 'log4js';
import { prisma } from '../prisma';
import { RedundantError } from '../util/error';

const logger = getLogger('Pupil Screening');

export async function invalidatePupilScreening(screeningId: number) {
    const screening = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: screeningId } });
    if (screening.invalidated) {
        throw new RedundantError(`Pupil screening ${screeningId} already is invalidated`);
    }
}
