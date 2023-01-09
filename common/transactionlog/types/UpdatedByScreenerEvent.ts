import LogUserEvent from './LogUserEvent';
import { Pupil } from '../../entity/Pupil';
import { Student } from '../../entity/Student';
import LogType from './LogType';

export default class UpdatedByScreenerEvent extends LogUserEvent {
    constructor(user: Pupil | Student, screenerId: number) {
        super(LogType.UPDATED_BY_SCREENER, user, { screenerId });
    }
}
