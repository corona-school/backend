import moment from 'moment';

export function getDefaultSemesterEnd(date: Date) {
    const d = moment(date);
    const month = d.month();

    if (month >= 9) {
        // WiSe: Oct 1 – Mar 31
        return moment([d.year() + 1, 2, 31]).toDate();
    }

    if (month <= 2) {
        // WiSe: Oct 1 – Mar 31
        return moment([d.year(), 2, 31]).toDate();
    }

    // SoSe: Apr 1 – Sep 30
    return moment([d.year(), 8, 30]).toDate();
}
