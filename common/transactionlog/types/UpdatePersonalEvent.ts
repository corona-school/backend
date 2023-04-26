import LogUserEvent from './LogUserEvent';
import LogType from './LogType';
import { Student } from '../../entity/Student';
import { Pupil } from '../../entity/Pupil';
import { Mentor } from '../../entity/Mentor';

export default class UpdatePersonalEvent extends LogUserEvent {
    constructor(pupil: Pupil | Student | Mentor) {
        super(LogType.UPDATE_PERSONAL, pupil, {});
    }
}
