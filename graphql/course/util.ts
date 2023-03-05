import { subcourse, lecture } from '@prisma/client';
import moment from 'moment-timezone';

export function hasSubcourseFinished(sc: subcourse & { lecture: lecture[] }) {
    let sorted = sc.lecture.sort((l1, l2) => l1.start.getMilliseconds() - l2.start.getMilliseconds());
    const lastLecture = sorted[sorted.length - 1];
    return moment(lastLecture.start).add(lastLecture.duration, 'minutes').isSameOrBefore(Date.now());
}
