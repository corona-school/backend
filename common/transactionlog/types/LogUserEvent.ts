import LogEvent from './LogEvent';
import LogType from './LogType';
import EventData from './EventData';
import { Student } from '../../entity/Student';
import { Pupil } from '../../entity/Pupil';
import { Mentor } from '../../entity/Mentor';

export default abstract class LogUserEvent extends LogEvent {
    protected constructor(logType: LogType, user: { wix_id: string }, data: EventData) {
        super(logType, user.wix_id, data);
    }
}
