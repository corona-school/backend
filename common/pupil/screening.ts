import { getLogger } from 'log4js';
import { prisma } from '../prisma';
import { RedundantError } from '../util/error';

const logger = getLogger('Pupil Screening');

export async function invalidatePupilScreening(screeningId: number) {
    const screening = await prisma.pupil_screening.findUniqueOrThrow({ where: { id: screeningId } });
    if (screening.invalidated) {
        throw new RedundantError(`Pupil screening ${screeningId} is already invalidated`);
    }
    await prisma.pupil_screening.update({ where: { id: screeningId }, data: { invalidated: true } });
    logger.info(`Invalidated pupil screening ${screeningId} for pupil ${screening.pupilId}`);
}
