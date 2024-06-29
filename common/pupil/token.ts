import { pupil } from '@prisma/client';
import moment from 'moment';
import { getLogger } from '../logger/logger';
import { createSecretEmailToken } from '../secret';
import { userForPupil } from '../user';

const logger = getLogger('Pupil Token Auth');

export async function refreshToken(pupil: pupil): Promise<string | never> {
    //PR Note: Do we have to drop this?
    if (pupil.verification !== null) {
        throw new Error('Cannot request access token for Pupil in Verification process');
    }

    if (!pupil.active) {
        throw new Error('Access Token requested by deactivated user');
    }

    const authToken = await createSecretEmailToken(userForPupil(pupil), undefined, moment().add(7, 'days'));
    logger.info(`Created new Auth Token for Pupil`, { pupilID: pupil.id, authToken });

    return authToken;
}
