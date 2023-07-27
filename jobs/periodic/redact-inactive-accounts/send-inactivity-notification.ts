import * as Notification from '../../../common/notification';
import { Person } from '../../../common/notification/types';
import moment from 'moment';
import { findAllPersons } from './query';
import { getLogger } from '../../../common/logger/logger';

export const NOTIFY_AFTER_DAYS = 3 * 365 + 9 * 30; // 3 years and 9 months

const logger = getLogger('SendInactivityNotification');

export async function sendInactivityNotification() {
    logger.info('Start sending inactivity notification');

    const p = await findAllPersons(true, moment().startOf('day').subtract(NOTIFY_AFTER_DAYS, 'days').toDate());
    logger.info('Sending inactivity notification to users', {
        pupils: p.pupils.map((p) => p.id),
        students: p.students.map((p) => p.id),
    });

    const persons: Person[] = [...p.pupils, ...p.students, ...p.mentors, ...p.screener];
    for (const person of persons) {
        await Notification.actionTaken(person, 'person_inactivity_reminder', { uniqueId: person.lastLogin.toISOString() });
    }

    logger.info('End sending inactivity notification');
}
