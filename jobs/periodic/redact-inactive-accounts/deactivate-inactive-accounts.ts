import { findAllPersons } from './query';
import moment from 'moment';
import { deactivatePupil } from '../../../common/pupil/activation';
import { deactivateStudent } from '../../../common/student/activation';
import { getLogger } from '../../../common/logger/logger';
import { DeactivationReason } from '../../../common/user';

export const DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS = 4 * 365;

const logger = getLogger('DeactivateInactiveAccounts');

export async function deactivateInactiveAccounts() {
    logger.info('Start deactivating inactive accounts');
    const persons = await findAllPersons(true, moment().startOf('day').subtract(DEACTIVATE_ACCOUNTS_INACTIVITY_DAYS, 'days').toDate());

    logger.info('Deactivating users', {
        pupils: persons.pupils.map((p) => p.id),
        students: persons.students.map((p) => p.id),
    });

    for (const pupil of persons.pupils) {
        await deactivatePupil(pupil, false, DeactivationReason.inactiveAccount, undefined, false);
    }

    for (const student of persons.students) {
        await deactivateStudent(student, true, DeactivationReason.inactiveAccount);
    }

    logger.info('End deactivating inactive accounts');
}
