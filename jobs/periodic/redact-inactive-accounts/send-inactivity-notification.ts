import * as Notification from '../../../common/notification';
import moment from 'moment';
import { findAllPersons } from './query';
import { getLogger } from '../../../common/logger/logger';
import { User, userForPupil, userForScreener, userForStudent } from '../../../common/user';

export const NOTIFY_AFTER_DAYS = 3 * 365 + 9 * 30; // 3 years and 9 months

const logger = getLogger('SendInactivityNotification');

export async function sendInactivityNotification() {
    logger.info('Start sending inactivity notification');

    const p = await findAllPersons(true, moment().startOf('day').subtract(NOTIFY_AFTER_DAYS, 'days').toDate());
    logger.info('Sending inactivity notification to users', {
        pupils: p.pupils.map((p) => p.id),
        students: p.students.map((p) => p.id),
    });

    const users: User[] = [
        ...p.pupils.map(userForPupil), ...p.students.map(userForStudent), ...p.screener.map(userForScreener)];
    for (const user of users) {
        await Notification.actionTaken(user, 'person_inactivity_reminder', { uniqueId: user.lastLogin.toISOString() });
    }

    logger.info('End sending inactivity notification');
}
