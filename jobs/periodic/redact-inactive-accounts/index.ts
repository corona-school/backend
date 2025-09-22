import { getLogger } from '../../../common/logger/logger';
import { prisma } from '../../../common/prisma';
import moment from 'moment';
import { deleteAttachment } from '../../../common/attachments';
import { ConcreteNotificationState } from '../../../common/notification/types';
import { findAllPersons } from './query';
import { userForPupil, userForStudent } from '../../../common/user';
import redactUsers from '../../../common/user/redaction';

const logger = getLogger();

export const GRACE_PERIOD = 4 * 365; // three years in days

export default async function execute() {
    logger.info('Inactive account redaction job will be executed...');
    const persons = await findAllPersons(false, moment().startOf('day').subtract(GRACE_PERIOD, 'days').toDate());

    await redactUsers(persons);
}
