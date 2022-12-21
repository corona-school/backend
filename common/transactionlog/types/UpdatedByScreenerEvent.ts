import LogUserEvent from './LogUserEvent';
import { Pupil } from '../../entity/Pupil';
import { Student } from '../../entity/Student';
import LogType from './LogType';

export default class UpdatedByScreenerEvent extends LogUserEvent {
    constructor(pupil: Pupil | Student, screener: string) {
        super(LogType.UPDATED_BY_SCREENER, pupil, { screener });
    }
}
